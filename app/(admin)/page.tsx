import Link from "next/link"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { requireAdmin } from "@/lib/auth"
import { resourceGroups, resources } from "@/lib/resources"

export default async function DashboardPage() {
  const { supabase } = await requireAdmin()

  const counts = await Promise.all(
    resources.map(async (resource) => {
      const { count } = await supabase
        .from(resource.table)
        .select("*", { count: "exact", head: true })
      return [resource.slug, count ?? 0] as const
    })
  )
  const countBySlug = Object.fromEntries(counts)

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Übersicht</h1>
        <p className="text-sm text-muted-foreground">
          Hier pflegst du die Auswahllisten, die Kandidaten in der ZAZU-App sehen.
          Änderungen sind sofort in der App sichtbar.
        </p>
      </div>
      {resourceGroups.map((group) => (
        <section key={group} className="grid gap-3">
          <h2 className="text-lg font-medium">{group}</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {resources
              .filter((resource) => resource.group === group)
              .map((resource) => (
                <Link key={resource.slug} href={`/${resource.slug}`}>
                  <Card className="h-full transition-colors hover:bg-muted/50">
                    <CardHeader>
                      <CardTitle className="flex items-baseline justify-between gap-2">
                        {resource.label}
                        <span className="text-sm font-normal text-muted-foreground tabular-nums">
                          {countBySlug[resource.slug].toLocaleString("de-CH")}
                        </span>
                      </CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  )
}
