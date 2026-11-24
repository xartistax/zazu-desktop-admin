"use server"

import { revalidatePath } from "next/cache"
import type { PostgrestError } from "@supabase/supabase-js"
import type { ActionResult } from "@/lib/actions"
import { requireAdmin } from "@/lib/auth"
import { accountRoles, isUuid } from "@/lib/users"

function friendlyError(error: PostgrestError): string {
  switch (error.code) {
    // Meldungen aus RAISE EXCEPTION in den admin_*-Funktionen
    case "P0001":
    case "P0002":
      return error.message
    case "42501":
      return "Keine Berechtigung für diese Aktion."
    case "23503":
      return "Der Benutzer ist noch mit anderen Daten verknüpft und kann nicht gelöscht werden."
    default:
      return `Aktion fehlgeschlagen: ${error.message}`
  }
}

function revalidateUser(userId: string) {
  revalidatePath("/benutzer")
  revalidatePath(`/benutzer/${userId}`)
  revalidatePath("/")
}

export async function updateUserProfile(
  userId: string,
  formData: FormData
): Promise<ActionResult> {
  if (!isUuid(userId)) return { ok: false, error: "Ungültiger Benutzer." }

  const text = (name: string) => {
    const value = formData.get(name)
    const trimmed = typeof value === "string" ? value.trim() : ""
    return trimmed === "" ? null : trimmed
  }

  const accountRole = text("account_role")
  if (!accountRoles.some((option) => option.value === accountRole)) {
    return { ok: false, error: "Bitte eine gültige Rolle wählen." }
  }

  const { supabase } = await requireAdmin()

  const { data, error } = await supabase
    .from("profiles")
    .update({
      first_name: text("first_name"),
      last_name: text("last_name"),
      phone_number: text("phone_number"),
      account_role: accountRole,
    })
    .eq("id", userId)
    .select("id")
  if (error) return { ok: false, error: friendlyError(error) }
  if (!data?.length) {
    return { ok: false, error: "Profil nicht gefunden oder keine Berechtigung." }
  }

  revalidateUser(userId)
  return { ok: true }
}

export async function setUserBanned(
  userId: string,
  banned: boolean
): Promise<ActionResult> {
  if (!isUuid(userId)) return { ok: false, error: "Ungültiger Benutzer." }

  const { supabase } = await requireAdmin()
  const { error } = await supabase.rpc("admin_set_user_banned", {
    p_user_id: userId,
    p_banned: banned,
  })
  if (error) return { ok: false, error: friendlyError(error) }

  revalidateUser(userId)
  return { ok: true }
}

export async function setUserAdmin(
  userId: string,
  admin: boolean
): Promise<ActionResult> {
  if (!isUuid(userId)) return { ok: false, error: "Ungültiger Benutzer." }

  const { supabase } = await requireAdmin()
  const { error } = await supabase.rpc("admin_set_user_admin", {
    p_user_id: userId,
    p_admin: admin,
  })
  if (error) return { ok: false, error: friendlyError(error) }

  revalidateUser(userId)
  return { ok: true }
}

export async function deleteUser(userId: string): Promise<ActionResult> {
  if (!isUuid(userId)) return { ok: false, error: "Ungültiger Benutzer." }

  const { supabase } = await requireAdmin()
  const { error } = await supabase.rpc("admin_delete_user", { p_user_id: userId })
  if (error) return { ok: false, error: friendlyError(error) }

  revalidateUser(userId)
  return { ok: true }
}
