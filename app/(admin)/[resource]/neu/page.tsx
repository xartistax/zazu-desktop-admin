import Link from "next/link"
import { notFound } from "next/navigation"
import { RecordForm } from "@/components/record-form"
import { requireAdmin } from "@/lib/auth"
import { getResource } from "@/lib/resources"

export default async function NewRecordPage({
  params,
}: {
  params: Promise<{ resource: string }>
}) {
  const { resource: slug } = await params
  const resource = getResource(slug)
  if (!resource) notFound()

  await requireAdmin()

  return (
    <div className="grid gap-6">
      <div>
        <Link href={`/${slug}`} className="text-sm text-muted-foreground hover:underline">
          ← {resource.label}
        </Link>
        <h1 className="text-2xl font-semibold">{resource.singular} hinzufügen</h1>
      </div>
      <RecordForm
        slug={slug}
        recordKey={null}
        fields={resource.fields}
        values={{}}
        referenceLabels={{}}
      />
    </div>
  )
}
