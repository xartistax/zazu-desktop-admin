"use server"

import { revalidatePath } from "next/cache"
import type { PostgrestError } from "@supabase/supabase-js"
import { requireAdmin } from "@/lib/auth"
import {
  decodeRecordKey,
  getResource,
  type Option,
  type Resource,
} from "@/lib/resources"

export type ActionResult = { ok: true } | { ok: false; error: string }

function friendlyError(error: PostgrestError): string {
  switch (error.code) {
    case "23505":
      return "Ein Eintrag mit diesen Werten existiert bereits."
    case "23503":
      return "Dieser Eintrag wird noch verwendet (z. B. in Profilen, Jobs oder Zuordnungen) und kann nicht gelöscht werden."
    case "23514":
      return "Ein Wert ist ungültig. Bitte die Eingaben prüfen."
    case "23502":
      return "Bitte alle Pflichtfelder ausfüllen."
    case "42501":
      return "Keine Berechtigung für diese Aktion."
    default:
      return `Speichern fehlgeschlagen: ${error.message}`
  }
}

function parseForm(resource: Resource, formData: FormData) {
  const payload: Record<string, unknown> = {}
  const missing: string[] = []

  for (const field of resource.fields) {
    const raw = formData.get(field.name)
    const text = typeof raw === "string" ? raw.trim() : ""
    let value: unknown

    switch (field.type) {
      case "boolean":
        value = raw === "on"
        break
      case "number":
        value = text === "" ? null : Number(text)
        if (Number.isNaN(value)) {
          return { error: `«${field.label}» muss eine Zahl sein.` }
        }
        break
      case "tags":
        value = text
          .split(",")
          .map((part) => part.trim())
          .filter(Boolean)
        break
      default:
        value = text === "" ? null : text
    }

    // Leere Textkategorie bei Skills wird unten aus der Skill-Kategorie übernommen.
    const derived = resource.table === "skills" && field.name === "category"
    if (field.required && !derived && (value === null || value === "")) {
      missing.push(field.label)
    }

    payload[field.name] = value
  }

  if (missing.length > 0) {
    return { error: `Bitte ausfüllen: ${missing.join(", ")}.` }
  }

  return { payload }
}

export async function saveRecord(
  slug: string,
  recordKey: string | null,
  formData: FormData
): Promise<ActionResult> {
  const resource = getResource(slug)
  if (!resource) return { ok: false, error: "Unbekannter Bereich." }

  const { supabase } = await requireAdmin()

  const parsed = parseForm(resource, formData)
  if ("error" in parsed) return { ok: false, error: parsed.error! }
  const payload = parsed.payload

  if (resource.table === "skills" && !payload.category) {
    if (!payload.category_id) {
      return {
        ok: false,
        error: "Bitte eine Skill-Kategorie wählen oder «Kategorie (Text)» ausfüllen.",
      }
    }
    const { data: category } = await supabase
      .from("skill_categories")
      .select("name")
      .eq("id", payload.category_id as string)
      .single()
    payload.category = category?.name ?? null
  }

  if (recordKey === null) {
    const { error } = await supabase.from(resource.table).insert(payload)
    if (error) return { ok: false, error: friendlyError(error) }
  } else {
    const match = decodeRecordKey(resource, recordKey)
    if (!match) return { ok: false, error: "Ungültiger Eintrag." }

    const { data, error } = await supabase
      .from(resource.table)
      .update(payload)
      .match(match)
      .select()
    if (error) return { ok: false, error: friendlyError(error) }
    if (!data?.length) {
      return { ok: false, error: "Eintrag nicht gefunden oder keine Berechtigung." }
    }
  }

  revalidatePath(`/${resource.slug}`)
  revalidatePath("/")
  return { ok: true }
}

export async function deleteRecord(
  slug: string,
  recordKey: string
): Promise<ActionResult> {
  const resource = getResource(slug)
  if (!resource) return { ok: false, error: "Unbekannter Bereich." }

  const match = decodeRecordKey(resource, recordKey)
  if (!match) return { ok: false, error: "Ungültiger Eintrag." }

  const { supabase } = await requireAdmin()

  const { data, error } = await supabase
    .from(resource.table)
    .delete()
    .match(match)
    .select()
  if (error) return { ok: false, error: friendlyError(error) }
  if (!data?.length) {
    return { ok: false, error: "Eintrag nicht gefunden oder keine Berechtigung." }
  }

  revalidatePath(`/${resource.slug}`)
  revalidatePath("/")
  return { ok: true }
}

export async function searchOptions(
  slug: string,
  query: string
): Promise<Option[]> {
  const resource = getResource(slug)
  if (!resource) return []

  const { supabase } = await requireAdmin()
  const term = query.replace(/[%_,()"\\*]/g, " ").trim()

  let request = supabase
    .from(resource.table)
    .select(`id, ${resource.labelColumn}`)
    .order(resource.labelColumn, { ascending: true })
    .limit(30)

  if (term) {
    request = request.ilike(resource.labelColumn, `%${term}%`)
  }

  const { data } = await request
  return ((data ?? []) as unknown as Record<string, string>[]).map((row) => ({
    value: row.id,
    label: row[resource.labelColumn],
  }))
}
