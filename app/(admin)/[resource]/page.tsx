import Link from "next/link"
import { notFound } from "next/navigation"
import { PlusIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { requireAdmin } from "@/lib/auth"
import { loadReferenceLabels, type ReferenceLabels } from "@/lib/references"
import { encodeRecordKey, getResource, type Field } from "@/lib/resources"

const PAGE_SIZE = 50

function formatCell(
  field: Field | undefined,
  row: Record<string, unknown>,
  referenceLabels: ReferenceLabels
) {
  if (!field) return null
  const value = row[field.name]

  switch (field.type) {
    case "boolean":
      return value ? <Badge>Ja</Badge> : <Badge variant="outline">Nein</Badge>
    case "tags":
      return (value as string[] | null)?.join(", ")
    case "select":
      return field.options.find((option) => option.value === value)?.label ?? (value as string)
    case "reference":
      return typeof value === "string"
        ? (referenceLabels[field.name]?.[value] ?? value)
        : null
    default:
      return value == null ? null : String(value)
  }
}

export default async function ResourceListPage({
  params,
  searchParams,
}: {
  params: Promise<{ resource: string }>
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { resource: slug } = await params
  const resource = getResource(slug)
  if (!resource) notFound()

  const { q = "", page: pageParam = "1" } = await searchParams
  const page = Math.max(1, Number.parseInt(pageParam, 10) || 1)
  const term = q.replace(/[%_,()"\\*]/g, " ").trim()

  const { supabase } = await requireAdmin()

  let query = supabase
    .from(resource.table)
    .select("*", { count: "exact" })
    .order(resource.defaultSort.column, { ascending: resource.defaultSort.ascending })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  if (term && resource.searchColumns.length > 0) {
    query = query.or(
      resource.searchColumns.map((column) => `${column}.ilike.%${term}%`).join(",")
    )
  }

  const { data, count, error } = await query
  const rows = (data ?? []) as unknown as Record<string, unknown>[]
  const referenceLabels = await loadReferenceLabels(supabase, resource, rows)
  const total = count ?? 0
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const columns = resource.listColumns.map((name) =>
    resource.fields.find((field) => field.name === name)
  )

  const pageHref = (target: number) => {
    const search = new URLSearchParams()
    if (q) search.set("q", q)
    if (target > 1) search.set("page", String(target))
    const value = search.toString()
    return `/${slug}${value ? `?${value}` : ""}`
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{resource.label}</h1>
          <p className="text-sm text-muted-foreground">{resource.description}</p>
        </div>
        <Button nativeButton={false} render={<Link href={`/${slug}/neu`} />}>
          <PlusIcon />
          {resource.singular} hinzufügen
        </Button>
      </div>

      {resource.searchColumns.length > 0 && (
        <form className="flex max-w-md gap-2">
          <Input name="q" defaultValue={q} placeholder="Suchen …" />
          <Button type="submit" variant="outline">
            Suchen
          </Button>
        </form>
      )}

      {error ? (
        <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          Daten konnten nicht geladen werden: {error.message}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((field, index) => (
                  <TableHead key={resource.listColumns[index]}>
                    {field?.label ?? resource.listColumns[index]}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} className="py-8 text-center text-muted-foreground">
                    {term ? "Keine Treffer für diese Suche." : "Noch keine Einträge."}
                  </TableCell>
                </TableRow>
              )}
              {rows.map((row) => {
                const key = encodeRecordKey(resource, row)
                return (
                  <TableRow key={key}>
                    {columns.map((field, index) => (
                      <TableCell key={resource.listColumns[index]} className="max-w-xs truncate">
                        {index === 0 ? (
                          <Link
                            href={`/${slug}/${encodeURIComponent(key)}`}
                            className="font-medium underline-offset-4 hover:underline"
                          >
                            {formatCell(field, row, referenceLabels) ?? "(ohne Namen)"}
                          </Link>
                        ) : (
                          formatCell(field, row, referenceLabels)
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {total.toLocaleString("de-CH")} Einträge · Seite {page} von {pageCount}
        </span>
        <div className="flex gap-2">
          {page > 1 ? (
            <Button variant="outline" size="sm" nativeButton={false} render={<Link href={pageHref(page - 1)} />}>
              Zurück
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Zurück
            </Button>
          )}
          {page < pageCount ? (
            <Button variant="outline" size="sm" nativeButton={false} render={<Link href={pageHref(page + 1)} />}>
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
