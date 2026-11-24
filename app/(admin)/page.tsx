import Link from "next/link"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { requireAdmin } from "@/lib/auth"
import { resourceGroups, resources } from "@/lib/resources"
import type { AdminUser } from "@/lib/users"

const userCountCards = [
  { label: "Alle Benutzer", filter: null, description: "Alle Konten der App." },
  { label: "Kandidaten", filter: "candidate", description: "Personen auf Stellensuche." },
  { label: "Arbeitgeber", filter: "employer", description: "Konten von Firmen." },
]

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

  const userCounts = await Promise.all(
    userCountCards.map(async (card) => {
      const { data } = await supabase.rpc("admin_list_users", {
        p_filter: card.filter,
        p_limit: 1,
      })
      return (data as AdminUser[] | null)?.[0]?.total_count ?? 0
    })
  )

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Übersicht</h1>
        <p className="text-sm text-muted-foreground">
          Hier verwaltest du die Konten der ZAZU-App und pflegst die Auswahllisten,
          die Kandidaten sehen. Änderungen sind sofort in der App sichtbar.
        </p>
      </div>
      <section className="grid gap-3">
        <h2 className="text-lg font-medium">Konten</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {userCountCards.map((card, index) => (
            <Link
              key={card.label}
              href={card.filter ? `/benutzer?filter=${card.filter}` : "/benutzer"}
            >
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader>
                  <CardTitle className="flex items-baseline justify-between gap-2">
                    {card.label}
                    <span className="text-sm font-normal text-muted-foreground tabular-nums">
                      {userCounts[index].toLocaleString("de-CH")}
                    </span>
                  </CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
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
