import { Suspense } from "react"
import { LogOutIcon } from "lucide-react"
import { AdminNav } from "@/components/admin-nav"
import { Button } from "@/components/ui/button"
import { requireAdmin } from "@/lib/auth"
import { resourceGroups, resources } from "@/lib/resources"
import { signOut } from "../login/actions"

const groups = [
  { title: "Konten", items: [{ slug: "benutzer", label: "Benutzer" }] },
  ...resourceGroups.map((title) => ({
    title,
    items: resources
      .filter((resource) => resource.group === title)
      .map(({ slug, label }) => ({ slug, label })),
  })),
]

async function CurrentUser() {
  const { user } = await requireAdmin()
  const initials = (user.email ?? "?").slice(0, 2).toUpperCase()
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
        {initials}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{user.email}</p>
        <p className="text-xs text-muted-foreground">Administrator</p>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      <aside className="flex flex-col gap-8 border-b border-sidebar-border bg-sidebar p-4 text-sidebar-foreground md:sticky md:top-0 md:h-svh md:w-64 md:shrink-0 md:overflow-y-auto md:border-r md:border-b-0">
        <div className="flex items-center gap-2.5 px-1 pt-1">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm">
            Z
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">ZAZU Admin</p>
            <p className="text-xs text-muted-foreground">Benutzer und Berufswahl</p>
          </div>
        </div>
        <Suspense>
          <AdminNav groups={groups} />
        </Suspense>
        <div className="mt-auto grid gap-3 border-t border-sidebar-border pt-4">
          <Suspense fallback={<p className="text-xs text-muted-foreground">…</p>}>
            <CurrentUser />
          </Suspense>
          <form action={signOut}>
            <Button type="submit" variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
              <LogOutIcon />
              Abmelden
            </Button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 bg-background px-4 py-6 md:px-10 md:py-10">
        <div className="mx-auto max-w-6xl">
          <Suspense fallback={<p className="text-sm text-muted-foreground">Laden …</p>}>
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  )
}
