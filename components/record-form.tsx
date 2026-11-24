"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ReferenceSelect } from "@/components/reference-select"
import { saveRecord } from "@/lib/actions"
import type { Field, Option } from "@/lib/resources"

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

export function RecordForm({
  slug,
  recordKey,
  fields,
  values,
  referenceLabels,
}: {
  slug: string
  recordKey: string | null
  fields: Field[]
  values: Record<string, unknown>
  referenceLabels: Record<string, Option | null>
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await saveRecord(slug, recordKey, formData)
      if (!result.ok) {
        setError(result.error)
        return
      }
      toast.success("Gespeichert")
      router.push(`/${slug}`)
    })
  }

  return (
    <form action={handleSubmit} className="grid max-w-2xl gap-5">
      {fields.map((field) => {
        const id = `field-${field.name}`
        const value = values[field.name]

        return (
          <div key={field.name} className="grid gap-2">
            {field.type === "boolean" ? (
              <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium">
                <input
                  id={id}
                  name={field.name}
                  type="checkbox"
                  defaultChecked={Boolean(value ?? field.defaultValue)}
                  className="size-4 accent-primary"
                />
                {field.label}
              </label>
            ) : (
              <Label htmlFor={id}>
                {field.label}
                {field.required && <span className="text-destructive">*</span>}
              </Label>
            )}

            {(field.type === "text" || field.type === "url") && (
              <Input
                id={id}
                name={field.name}
                type={field.type}
                required={field.required && !(slug === "skills" && field.name === "category")}
                defaultValue={(value as string) ?? ""}
              />
            )}
            {field.type === "textarea" && (
              <Textarea id={id} name={field.name} defaultValue={(value as string) ?? ""} />
            )}
            {field.type === "number" && (
              <Input
                id={id}
                name={field.name}
                type="number"
                required={field.required}
                defaultValue={(value as number) ?? field.defaultValue ?? ""}
              />
            )}
            {field.type === "tags" && (
              <Input
                id={id}
                name={field.name}
                defaultValue={((value as string[]) ?? field.defaultValue ?? []).join(", ")}
              />
            )}
            {field.type === "select" && (
              <select
                id={id}
                name={field.name}
                required={field.required}
                defaultValue={(value as string) ?? field.defaultValue ?? ""}
                className={selectClassName}
              >
                {!field.required && <option value="">–</option>}
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
                {typeof value === "string" &&
                  value !== "" &&
                  !field.options.some((option) => option.value === value) && (
                    <option value={value}>{value}</option>
                  )}
              </select>
            )}
            {field.type === "reference" && (
              <ReferenceSelect
                id={id}
                name={field.name}
                resource={field.resource}
                initial={referenceLabels[field.name] ?? null}
                required={field.required}
              />
            )}

            {field.help && (
              <p className="text-xs text-muted-foreground">{field.help}</p>
            )}
          </div>
        )
      })}

      {error && (
        <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Speichern …" : "Speichern"}
        </Button>
        <Button variant="outline" nativeButton={false} render={<Link href={`/${slug}`} />}>
          Abbrechen
        </Button>
      </div>
    </form>
  )
}
