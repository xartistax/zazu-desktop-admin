"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth"
import { getResource } from "@/lib/resources"
import { isReviewCatalog } from "@/lib/review"
import { isUuid } from "@/lib/users"

const MAX_IDS = 200

// Markiert Einträge als geprüft oder setzt sie zurück auf «Prüfung nötig».
// Wer wann geprüft hat, setzt der Trigger set_catalog_review() in der DB.
export async function setReviewed(
  slug: string,
  ids: string[],
  verified: boolean
): Promise<{ ok: true; count: number } | { ok: false; error: string }> {
  const resource = getResource(slug)
  if (!resource || !isReviewCatalog(slug)) {
    return { ok: false, error: "Unbekannter Bereich." }
  }
  if (ids.length === 0) return { ok: false, error: "Keine Einträge ausgewählt." }
  if (ids.length > MAX_IDS) {
    return { ok: false, error: `Höchstens ${MAX_IDS} Einträge auf einmal.` }
  }
  if (!ids.every(isUuid)) return { ok: false, error: "Ungültige Auswahl." }

  const { supabase } = await requireAdmin()

  const { data, error } = await supabase
    .from(resource.table)
    .update({ validation_status: verified ? "verified" : "review_required" })
    .in("id", ids)
    .eq("validation_status", verified ? "review_required" : "verified")
    .select("id")
  if (error) {
    return {
      ok: false,
      error:
        error.code === "42501"
          ? "Keine Berechtigung für diese Aktion."
          : `Speichern fehlgeschlagen: ${error.message}`,
    }
  }

  revalidatePath("/pruefliste")
  revalidatePath(`/${resource.slug}`)
  revalidatePath("/")
  return { ok: true, count: data?.length ?? 0 }
}
