import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import { getResource, type Resource } from "@/lib/resources"

// Namen verknüpfter Einträge: Feldname → (ID → Name).
export type ReferenceLabels = Record<string, Record<string, string>>

export async function loadReferenceLabels(
  supabase: SupabaseClient,
  resource: Resource,
  rows: Record<string, unknown>[]
): Promise<ReferenceLabels> {
  const entries = await Promise.all(
    resource.fields.map(async (field) => {
      if (field.type !== "reference") return null
      const target = getResource(field.resource)
      if (!target) return null

      const ids = [
        ...new Set(
          rows
            .map((row) => row[field.name])
            .filter((id): id is string => typeof id === "string")
        ),
      ]
      if (ids.length === 0) return [field.name, {}] as const

      const { data } = await supabase
        .from(target.table)
        .select(`id, ${target.labelColumn}`)
        .in("id", ids)

      const labels = Object.fromEntries(
        ((data ?? []) as unknown as Record<string, string>[]).map((row) => [
          row.id,
          row[target.labelColumn],
        ])
      )
      return [field.name, labels] as const
    })
  )

  return Object.fromEntries(entries.filter((entry) => entry !== null))
}
