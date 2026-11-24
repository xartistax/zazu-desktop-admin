// Benutzerverwaltung: Typen und Beschriftungen.
// Die Daten kommen aus public.admin_list_users() (siehe Migration
// 20261124140000_add_admin_user_management.sql im ZAZU-iOS-Repo).

import type { Option } from "@/lib/resources"

export type AdminUser = {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  phone_number: string | null
  account_role: string | null
  created_at: string
  last_sign_in_at: string | null
  email_confirmed_at: string | null
  banned_until: string | null
  is_admin: boolean
  total_count: number
}

export const accountRoles: Option[] = [
  { value: "candidate", label: "Kandidat" },
  { value: "employer", label: "Arbeitgeber" },
]

export const userFilters: Option[] = [
  ...accountRoles,
  { value: "admin", label: "Admins" },
  { value: "banned", label: "Gesperrt" },
]

export const skillProficiency: Record<string, string> = {
  beginner: "Einsteiger",
  basic: "Grundkenntnisse",
  good: "Gut",
  very_good: "Sehr gut",
  expert: "Experte",
}

export const languageProficiency: Record<string, string> = {
  a1: "A1",
  a2: "A2",
  b1: "B1",
  b2: "B2",
  c1: "C1",
  c2: "C2",
  native: "Muttersprache",
}

export const workModels: Record<string, string> = {
  onsite: "Vor Ort",
  hybrid: "Hybrid",
  remote: "Remote",
}

export function roleLabel(role: string | null) {
  return accountRoles.find((option) => option.value === role)?.label ?? role ?? "–"
}

export function userDisplayName(user: AdminUser) {
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ").trim()
  return name || user.email || "(ohne Namen)"
}

export function isBanned(user: AdminUser) {
  return user.banned_until !== null && new Date(user.banned_until) > new Date()
}

export function formatDate(value: string | null, withTime = false) {
  if (!value) return "–"
  return new Intl.DateTimeFormat("de-CH", {
    dateStyle: "medium",
    ...(withTime && { timeStyle: "short" }),
    timeZone: "Europe/Zurich",
  }).format(new Date(value))
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isUuid(value: string) {
  return UUID_PATTERN.test(value)
}
