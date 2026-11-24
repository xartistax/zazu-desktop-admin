import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ReviewTable } from "@/components/review-table"
import { requireAdmin } from "@/lib/auth"
import { loadReferenceLabels } from "@/lib/references"
import { fieldKinds, getResource } from "@/lib/resources"
import { isReviewCatalog, reviewCatalogs, type ReviewRow } from "@/lib/review"
import { cn } from "@/lib/utils"
import { userDisplayName, type AdminUser } from "@/lib/users"

const PAGE_SIZE = 50

const views = [
  { value: "offen", label: "Prüfung nötig", status: "review_required" },
  { value: "geprueft", label: "Geprüft", status: "verified" },
] as const

const columnsBySlug = {
  fachrichtungen:
    "id, name:name_de, field_kind, parent_id, source_name, source_url, note, reviewed_at, reviewed_by",
  institutionen:
    "id, name, institution_type_id, source_url, reviewed_at, reviewed_by",
}

type RawRow = {
  id: string
  name: string
  field_kind?: string | null
  parent_id?: string | null
  institution_type_id?: string
  source_name?: string | null
  source_url: string | null
  note?: string | null
  reviewed_at: string | null
  reviewed_by: string | null
}

export default async function ReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ katalog?: string; ansicht?: string; q?: string; page?: string }>
}) {
  const params = await searchParams
  const slug = params.katalog && isReviewCatalog(params.katalog) ? params.katalog : "fachrichtungen"
  const view = views.find((option) => option.value === params.ansicht) ?? views[0]
  const q = params.q ?? ""
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1)
  const term = q.replace(/[%_,()"\\*]/g, " ").trim()
  const resource = getResource(slug)!

  const { supabase } = await requireAdmin()

  const openCounts = await Promise.all(
    reviewCatalogs.map(async (catalog) => {
      const { count } = await supabase
        .from(getResource(catalog.slug)!.table)
        .select("id", { count: "exact", head: true })
        .eq("validation_status", "review_required")
      return count ?? 0
    })
  )

  let query = supabase
    .from(resource.table)
    .select(columnsBySlug[slug], { count: "exact" })
    .eq("validation_status", view.status)
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
  query =
    view.value === "geprueft"
      ? query.order("reviewed_at", { ascending: false, nullsFirst: false })
      : query.order(resource.labelColumn, { ascending: true })
  if (term) {
    query = query.ilike(resource.labelColumn, `%${term}%`)
  }

  const { data, count, error } = await query
  const raw = (data ?? []) as unknown as RawRow[]
  const referenceLabels = await loadReferenceLabels(
    supabase,
    resource,
    raw as unknown as Record<string, unknown>[]
  )

  // Prüfer: wenige Admins, daher einzeln nachschlagen
  const reviewerIds = [...new Set(raw.map((row) => row.reviewed_by).filter((id) => id !== null))]
  const reviewers = Object.fromEntries(
    await Promise.all(
      reviewerIds.map(async (id) => {
        const { data: users } = await supabase.rpc("admin_list_users", { p_user_id: id })
        const user = (users as AdminUser[] | null)?.[0]
        return [id, user ? userDisplayName(user) : "Gelöschter Benutzer"] as const
      })
    )
  )

  const rows: ReviewRow[] = raw.map((row) => ({
    id: row.id,
    name: row.name,
    kind:
      slug === "fachrichtungen"
        ? (fieldKinds.find((kind) => kind.value === row.field_kind)?.label ?? row.field_kind ?? null)
        : (referenceLabels.institution_type_id?.[row.institution_type_id ?? ""] ?? null),
    parent: row.parent_id ? (referenceLabels.parent_id?.[row.parent_id] ?? null) : null,
    source_name: row.source_name ?? null,
    source_url: row.source_url,
    note: row.note ?? null,
    reviewed_at: row.reviewed_at,
    reviewer: row.reviewed_by ? reviewers[row.reviewed_by] : null,
  }))

  const total = count ?? 0
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const href = (changes: { katalog?: string; ansicht?: string; page?: number }) => {
    const search = new URLSearchParams()
    const katalog = changes.katalog ?? slug
    const ansicht = changes.ansicht ?? view.value
    if (katalog !== "fachrichtungen") search.set("katalog", katalog)
    if (ansicht !== "offen") search.set("ansicht", ansicht)
    // Beim Wechsel von Katalog oder Ansicht Suche und Seite zurücksetzen
    if (!changes.katalog && !changes.ansicht) {
      if (q) search.set("q", q)
      if (changes.page && changes.page > 1) search.set("page", String(changes.page))
    }
    const value = search.toString()
    return `/pruefliste${value ? `?${value}` : ""}`
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Prüfliste</h1>
        <p className="text-sm text-muted-foreground">
          Aus externen Quellen importierte Einträge, die noch niemand kontrolliert hat.
          Prüfe Name, Zuordnung und Quelle, korrigiere bei Bedarf über «Bearbeiten» und
          markiere den Eintrag dann als geprüft.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1 rounded-lg bg-muted p-1">
          {reviewCatalogs.map((catalog, index) => (
            <Link
              key={catalog.slug}
              href={href({ katalog: catalog.slug })}
              className={cn(
                "rounded-md px-3 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground",
                catalog.slug === slug && "bg-background font-medium text-foreground shadow-sm"
              )}
            >
              {catalog.label}
              <span className="ml-1.5 tabular-nums">{openCounts[index].toLocaleString("de-CH")}</span>
            </Link>
          ))}
        </div>
        <div className="flex gap-1">
          {views.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={option.value === view.value ? "secondary" : "ghost"}
              nativeButton={false}
              render={<Link href={href({ ansicht: option.value })} />}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <form className="flex max-w-md gap-2">
        {slug !== "fachrichtungen" && <input type="hidden" name="katalog" value={slug} />}
        {view.value !== "offen" && <input type="hidden" name="ansicht" value={view.value} />}
        <Input name="q" defaultValue={q} placeholder="Name suchen …" />
        <Button type="submit" variant="outline">
          Suchen
        </Button>
      </form>

      {error ? (
        <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          Daten konnten nicht geladen werden: {error.message}
        </p>
      ) : (
        <ReviewTable
          key={`${slug}-${view.value}-${page}-${term}`}
          slug={slug}
          rows={rows}
          verified={view.value === "geprueft"}
          showParent={slug === "fachrichtungen"}
          showNote={slug === "fachrichtungen"}
          kindLabel={slug === "fachrichtungen" ? "Art" : "Institutionstyp"}
          emptyText={
            term
              ? "Keine Treffer für diese Suche."
              : view.value === "offen"
                ? "Alles geprüft – hier gibt es nichts mehr zu tun."
                : "Noch keine Einträge geprüft."
          }
        />
      )}

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {total.toLocaleString("de-CH")} Einträge · Seite {page} von {pageCount}
        </span>
        <div className="flex gap-2">
          {page > 1 ? (
            <Button variant="outline" size="sm" nativeButton={false} render={<Link href={href({ page: page - 1 })} />}>
              Zurück
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Zurück
            </Button>
          )}
          {page < pageCount ? (
            <Button variant="outline" size="sm" nativeButton={false} render={<Link href={href({ page: page + 1 })} />}>
              Weiter
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Weiter
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
