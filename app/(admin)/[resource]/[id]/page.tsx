import Link from "next/link"
import { notFound } from "next/navigation"
import { DeleteButton } from "@/components/delete-button"
import { RecordForm } from "@/components/record-form"
import { requireAdmin } from "@/lib/auth"
import { loadReferenceLabels } from "@/lib/references"
import { decodeRecordKey, getResource, type Option } from "@/lib/resources"

export default async function EditRecordPage({
  params,
}: {
  params: Promise<{ resource: string; id: string }>
}) {
  const { resource: slug, id } = await params
  const resource = getResource(slug)
  if (!resource) notFound()

  const match = decodeRecordKey(resource, id)
  if (!match) notFound()

  const { supabase } = await requireAdmin()
  const { data } = await supabase
    .from(resource.table)
    .select("*")
    .match(match)
    .maybeSingle()
  if (!data) notFound()

  const row = data as unknown as Record<string, unknown>
  const recordKey = decodeURIComponent(id)

  const labels = await loadReferenceLabels(supabase, resource, [row])
  const referenceLabels: Record<string, Option | null> = {}
  for (const field of resource.fields) {
    if (field.type !== "reference") continue
    const value = row[field.name] as string | null
    referenceLabels[field.name] = value
      ? { value, label: labels[field.name]?.[value] ?? value }
      : null
  }

  const labelField = resource.fields.find((f) => f.name === resource.labelColumn)
  const title =
    labelField?.type === "reference"
      ? referenceLabels[labelField.name]?.label
      : (row[resource.labelColumn] as string | undefined)

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href={`/${slug}`} className="text-sm text-muted-foreground hover:underline">
            ← {resource.label}
          </Link>
          <h1 className="text-2xl font-semibold">
            {title ?? resource.singular} bearbeiten
          </h1>
        </div>
        <DeleteButton
          slug={slug}
          recordKey={recordKey}
          label={title ?? resource.singular}
        />
      </div>
      <RecordForm
        slug={slug}
        recordKey={recordKey}
        fields={resource.fields}
        values={row}
        referenceLabels={referenceLabels}
      />
    </div>
  )
}
