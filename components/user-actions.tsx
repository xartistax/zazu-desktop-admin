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
import type { ActionResult } from "@/lib/actions"
import { deleteUser, setUserAdmin, setUserBanned } from "@/lib/user-actions"

// Sperren, Admin-Rechte und Löschen – jeweils mit Bestätigung.
// Für das eigene Konto sind die Aktionen gesperrt (zusätzlich in der DB geprüft).
export function UserActions({
  userId,
  name,
  banned,
  admin,
  isSelf,
}: {
  userId: string
  name: string
  banned: boolean
  admin: boolean
  isSelf: boolean
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function run(action: () => Promise<ActionResult>, success: string, redirectTo?: string) {
    startTransition(async () => {
      const result = await action()
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success(success)
      if (redirectTo) {
        router.push(redirectTo)
      } else {
        router.refresh()
      }
    })
  }

  return (
    <div className="flex flex-wrap gap-2">
      <ConfirmAction
        trigger={admin ? "Admin-Rechte entziehen" : "Zum Admin machen"}
        title={admin ? `«${name}» die Admin-Rechte entziehen?` : `«${name}» zum Admin machen?`}
        description={
          admin
            ? "Der Benutzer kann sich danach nicht mehr im Admin-Panel anmelden."
            : "Der Benutzer kann danach alle Inhalte und Benutzer im Admin-Panel verwalten."
        }
        confirm={admin ? "Rechte entziehen" : "Zum Admin machen"}
        disabled={pending || (isSelf && admin)}
        onConfirm={() =>
          run(
            () => setUserAdmin(userId, !admin),
            admin ? "Admin-Rechte entzogen" : "Admin-Rechte vergeben"
          )
        }
      />
      <ConfirmAction
        trigger={banned ? "Entsperren" : "Sperren"}
        title={banned ? `«${name}» entsperren?` : `«${name}» sperren?`}
        description={
          banned
            ? "Der Benutzer kann sich danach wieder in der App anmelden."
            : "Der Benutzer wird abgemeldet und kann sich nicht mehr anmelden. Eine bereits geöffnete App bleibt höchstens noch eine Stunde aktiv. Die Daten bleiben erhalten."
        }
        confirm={banned ? "Entsperren" : "Sperren"}
        destructive={!banned}
        disabled={pending || isSelf}
        onConfirm={() =>
          run(
            () => setUserBanned(userId, !banned),
            banned ? "Benutzer entsperrt" : "Benutzer gesperrt"
          )
        }
      />
      <ConfirmAction
        trigger="Löschen"
        title={`«${name}» löschen?`}
        description="Das Konto wird mit Profil, Kandidaten-Daten, Matches und Firmen-Mitgliedschaften endgültig gelöscht. Das kann nicht rückgängig gemacht werden."
        confirm="Endgültig löschen"
        destructive
        disabled={pending || isSelf}
        onConfirm={() => run(() => deleteUser(userId), "Benutzer gelöscht", "/benutzer")}
      />
    </div>
  )
}

function ConfirmAction({
  trigger,
  title,
  description,
  confirm,
  destructive = false,
  disabled,
  onConfirm,
}: {
  trigger: string
  title: string
  description: string
  confirm: string
  destructive?: boolean
  disabled: boolean
  onConfirm: () => void
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant={destructive ? "destructive" : "outline"} disabled={disabled} />
        }
      >
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction
            variant={destructive ? "destructive" : "default"}
            onClick={onConfirm}
          >
            {confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
