"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BriefcaseIcon,
  GraduationCapIcon,
  LayoutDashboardIcon,
  SparklesIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type NavGroup = {
  title: string
  items: { slug: string; label: string }[]
}

const groupIcons: Record<string, LucideIcon> = {
  Konten: UsersIcon,
  Ausbildung: GraduationCapIcon,
  Berufe: BriefcaseIcon,
  Skills: SparklesIcon,
}

const linkClassName =
  "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
const activeClassName = "bg-sidebar-accent font-medium text-sidebar-accent-foreground"

export function AdminNav({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname()

  return (
    <nav className="grid gap-6">
      <Link href="/" className={cn(linkClassName, pathname === "/" && activeClassName)}>
        <LayoutDashboardIcon className="size-4 shrink-0" />
        Übersicht
      </Link>
      {groups.map((group) => {
        const Icon = groupIcons[group.title]
        return (
          <div key={group.title} className="grid gap-0.5">
            <p className="flex items-center gap-2 px-2.5 pb-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
              {Icon && <Icon className="size-3.5" />}
              {group.title}
            </p>
            {group.items.map((item) => {
              const active =
                pathname === `/${item.slug}` || pathname.startsWith(`/${item.slug}/`)
              return (
                <Link
                  key={item.slug}
                  href={`/${item.slug}`}
                  className={cn(linkClassName, "pl-8", active && activeClassName)}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        )
      })}
    </nav>
  )
}
