import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserBadges } from "@/components/user-badges"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { requireAdmin } from "@/lib/auth"
import {
  formatDate,
  roleLabel,
  userDisplayName,
  userFilters,
  type AdminUser,
} from "@/lib/users"

const PAGE_SIZE = 50

const selectClassName =
  "h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string; page?: string }>
}) {
  const { q = "", filter = "", page: pageParam = "1" } = await searchParams
  const page = Math.max(1, Number.parseInt(pageParam, 10) || 1)
  const term = q.replace(/[%_\\]/g, " ").trim()
  const activeFilter = userFilters.some((option) => option.value === filter) ? filter : ""

  const { supabase } = await requireAdmin()

  const { data, error } = await supabase.rpc("admin_list_users", {
    p_search: term || null,
    p_filter: activeFilter || null,
    p_limit: PAGE_SIZE,
    p_offset: (page - 1) * PAGE_SIZE,
  })
  const users = (data ?? []) as AdminUser[]
  const total = users[0]?.total_count ?? 0
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const pageHref = (target: number) => {
    const search = new URLSearchParams()
    if (q) search.set("q", q)
    if (activeFilter) search.set("filter", activeFilter)
    if (target > 1) search.set("page", String(target))
    const value = search.toString()
    return `/benutzer${value ? `?${value}` : ""}`
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Benutzer</h1>
        <p className="text-sm text-muted-foreground">
          Alle Konten der ZAZU-App – Kandidaten und Arbeitgeber.
        </p>
      </div>

      <form className="flex max-w-2xl flex-wrap gap-2">
        <Input
          name="q"
          defaultValue={q}
          placeholder="Name, E-Mail oder Telefon …"
          className="min-w-48 flex-1"
        />
        <select
          name="filter"
          defaultValue={activeFilter}
          aria-label="Filter"
          className={selectClassName}
        >
          <option value="">Alle</option>
          {userFilters.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Button type="submit" variant="outline">
          Suchen
        </Button>
      </form>

      {error ? (
        <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          Benutzer konnten nicht geladen werden: {error.message}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Rolle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registriert</TableHead>
                <TableHead>Letzter Login</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    {term || activeFilter ? "Keine Treffer für diese Suche." : "Noch keine Benutzer."}
                  </TableCell>
                </TableRow>
              )}
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="max-w-xs truncate">
                    <Link
                      href={`/benutzer/${user.id}`}
                      className="font-medium underline-offset-4 hover:underline"
                    >
                      {userDisplayName(user)}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{user.email}</TableCell>
                  <TableCell>{roleLabel(user.account_role)}</TableCell>
                  <TableCell>
                    <UserBadges user={user} />
                  </TableCell>
                  <TableCell className="tabular-nums">{formatDate(user.created_at)}</TableCell>
                  <TableCell className="tabular-nums">
                    {formatDate(user.last_sign_in_at, true)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {total.toLocaleString("de-CH")} Benutzer · Seite {page} von {pageCount}
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
