"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteRecord } from "@/lib/actions"

export function DeleteButton({
  slug,
  recordKey,
  label,
}: {
  slug: string
  recordKey: string
  label: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteRecord(slug, recordKey)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success("Gelöscht")
      router.push(`/${slug}`)
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" disabled={pending} />}>
        Löschen
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>«{label}» löschen?</AlertDialogTitle>
          <AlertDialogDescription>
            Der Eintrag wird sofort aus der App entfernt. Das kann nicht rückgängig
            gemacht werden.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete}>
            Endgültig löschen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
