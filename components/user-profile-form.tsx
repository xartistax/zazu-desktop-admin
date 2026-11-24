"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateUserProfile } from "@/lib/user-actions"
import { accountRoles, type AdminUser } from "@/lib/users"

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

export function UserProfileForm({ user }: { user: AdminUser }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await updateUserProfile(user.id, formData)
      if (!result.ok) {
        setError(result.error)
        return
      }
      toast.success("Gespeichert")
      router.refresh()
    })
  }

  return (
    <form action={handleSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="field-first_name">Vorname</Label>
          <Input id="field-first_name" name="first_name" defaultValue={user.first_name ?? ""} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="field-last_name">Nachname</Label>
          <Input id="field-last_name" name="last_name" defaultValue={user.last_name ?? ""} />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="field-phone_number">Telefon</Label>
        <Input
          id="field-phone_number"
          name="phone_number"
          type="tel"
          defaultValue={user.phone_number ?? ""}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="field-account_role">
          Rolle<span className="text-destructive">*</span>
        </Label>
        <select
          id="field-account_role"
          name="account_role"
          required
          defaultValue={user.account_role ?? "candidate"}
          className={selectClassName}
        >
          {accountRoles.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">
          Bestimmt, welche Oberfläche die App zeigt. Bestehende Kandidaten- oder
          Firmendaten werden beim Wechsel nicht umgewandelt.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Speichern …" : "Speichern"}
        </Button>
      </div>
    </form>
  )
}
