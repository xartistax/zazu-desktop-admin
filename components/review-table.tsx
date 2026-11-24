"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { CheckIcon, ExternalLinkIcon, Undo2Icon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { setReviewed } from "@/lib/review-actions"
import type { ReviewRow } from "@/lib/review"
import { formatDate } from "@/lib/users"

export function ReviewTable({
  slug,
  rows,
  verified,
  showParent,
  showNote,
  kindLabel,
  emptyText,
}: {
  slug: string
  rows: ReviewRow[]
  // true: Ansicht «Geprüft» – Aktion setzt zurück auf «Prüfung nötig»
  verified: boolean
  showParent: boolean
  showNote: boolean
  kindLabel: string
  emptyText: string
}) {
  const router = useRouter()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [pending, startTransition] = useTransition()

  const allSelected = rows.length > 0 && selected.size === rows.length
  const columnCount = 4 + (showParent ? 1 : 0) + (showNote ? 1 : 0) + (verified ? 1 : 0)

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function apply(ids: string[]) {
    startTransition(async () => {
      const result = await setReviewed(slug, ids, !verified)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      const entries = result.count === 1 ? "1 Eintrag" : `${result.count} Einträge`
      toast.success(verified ? `${entries} zurückgesetzt` : `${entries} als geprüft markiert`)
      setSelected(new Set())
      router.refresh()
    })
  }

  const actionLabel = verified ? "Zurücksetzen" : "Geprüft"
  const ActionIcon = verified ? Undo2Icon : CheckIcon

  return (
    <div className="grid gap-3">
      <div className="flex min-h-8 flex-wrap items-center gap-3">
        <Button
          size="sm"
          variant={verified ? "outline" : "default"}
          disabled={pending || selected.size === 0}
          onClick={() => apply([...selected])}
        >
          <ActionIcon />
          {verified ? "Auswahl zurücksetzen" : "Auswahl als geprüft markieren"}
          {selected.size > 0 && ` (${selected.size})`}
        </Button>
        {selected.size > 0 && (
          <button
            type="button"
            className="text-sm text-muted-foreground hover:underline"
            onClick={() => setSelected(new Set())}
          >
            Auswahl aufheben
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  aria-label="Alle auf dieser Seite auswählen"
                  checked={allSelected}
                  disabled={rows.length === 0}
                  onChange={() =>
                    setSelected(allSelected ? new Set() : new Set(rows.map((row) => row.id)))
                  }
                  className="size-4 accent-primary"
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>{kindLabel}</TableHead>
              {showParent && <TableHead>Übergeordnet</TableHead>}
              <TableHead>Quelle</TableHead>
              {showNote && <TableHead>Notiz</TableHead>}
              {verified && <TableHead>Geprüft</TableHead>}
              <TableHead className="w-px" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columnCount + 1} className="py-8 text-center text-muted-foreground">
                  {emptyText}
                </TableCell>
              </TableRow>
            )}
            {rows.map((row) => (
              <TableRow key={row.id} data-state={selected.has(row.id) ? "selected" : undefined}>
                <TableCell>
                  <input
                    type="checkbox"
                    aria-label={`${row.name} auswählen`}
                    checked={selected.has(row.id)}
                    onChange={() => toggle(row.id)}
                    className="size-4 accent-primary"
                  />
                </TableCell>
                <TableCell className="max-w-xs">
                  <Link
                    href={`/${slug}/${row.id}`}
                    className="font-medium underline-offset-4 hover:underline"
                    title="Bearbeiten"
                  >
                    {row.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{row.kind ?? "–"}</TableCell>
                {showParent && (
                  <TableCell className="max-w-48 truncate text-muted-foreground">
                    {row.parent ?? "–"}
                  </TableCell>
                )}
                <TableCell className="max-w-56 text-muted-foreground">
                  {row.source_url ? (
                    <a
                      href={row.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
                    >
                      {row.source_name ?? hostname(row.source_url)}
                      <ExternalLinkIcon className="size-3 shrink-0" />
                    </a>
                  ) : (
                    (row.source_name ?? "–")
                  )}
                </TableCell>
                {showNote && (
                  <TableCell className="max-w-56 text-sm text-muted-foreground">
                    {row.note ?? ""}
                  </TableCell>
                )}
                {verified && (
                  <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
                    {formatDate(row.reviewed_at, true)}
                    {row.reviewer && <span className="block text-xs">{row.reviewer}</span>}
                  </TableCell>
                )}
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={pending}
                    onClick={() => apply([row.id])}
                  >
                    <ActionIcon />
                    {actionLabel}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function hostname(url: string) {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}
