"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export type NavGroup = {
  title: string
  items: { slug: string; label: string }[]
}

export function AdminNav({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname()

  return (
    <nav className="grid gap-5">
      <Link
        href="/"
        className={cn(
          "rounded-md px-2 py-1.5 text-sm font-medium hover:bg-muted",
          pathname === "/" && "bg-muted"
        )}
      >
        Übersicht
      </Link>
      {groups.map((group) => (
        <div key={group.title} className="grid gap-1">
          <p className="px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {group.title}
          </p>
          {group.items.map((item) => {
            const active =
              pathname === `/${item.slug}` || pathname.startsWith(`/${item.slug}/`)
            return (
              <Link
                key={item.slug}
                href={`/${item.slug}`}
                className={cn(
                  "rounded-md px-2 py-1.5 text-sm hover:bg-muted",
                  active && "bg-muted font-medium"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
