import { Suspense } from "react"
import { AdminNav } from "@/components/admin-nav"
import { Button } from "@/components/ui/button"
import { requireAdmin } from "@/lib/auth"
import { resourceGroups, resources } from "@/lib/resources"
import { signOut } from "../login/actions"

const groups = resourceGroups.map((title) => ({
  title,
  items: resources
    .filter((resource) => resource.group === title)
    .map(({ slug, label }) => ({ slug, label })),
}))

async function CurrentUser() {
  const { user } = await requireAdmin()
  return <p className="truncate text-xs text-muted-foreground">{user.email}</p>
}

export default function AdminLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      <aside className="flex flex-col gap-6 border-b bg-muted/30 p-4 md:sticky md:top-0 md:h-svh md:w-64 md:shrink-0 md:overflow-y-auto md:border-r md:border-b-0">
        <div>
          <p className="font-semibold">ZAZU Admin</p>
          <p className="text-xs text-muted-foreground">Inhalte der Berufswahl</p>
        </div>
        <Suspense>
          <AdminNav groups={groups} />
        </Suspense>
        <div className="mt-auto grid gap-2 border-t pt-4">
          <Suspense fallback={<p className="text-xs text-muted-foreground">…</p>}>
            <CurrentUser />
          </Suspense>
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm" className="w-full">
              Abmelden
            </Button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Laden …</p>}>
          {children}
        </Suspense>
      </main>
    </div>
  )
}
