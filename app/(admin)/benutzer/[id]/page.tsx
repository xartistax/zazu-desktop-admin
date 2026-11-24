import Link from "next/link"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"
import type { SupabaseClient } from "@supabase/supabase-js"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UserActions } from "@/components/user-actions"
import { UserBadges } from "@/components/user-badges"
import { UserProfileForm } from "@/components/user-profile-form"
import { requireAdmin } from "@/lib/auth"
import {
  formatDate,
  isBanned,
  isUuid,
  languageProficiency,
  roleLabel,
  skillProficiency,
  userDisplayName,
  workModels,
  type AdminUser,
} from "@/lib/users"

type CandidateProfile = {
  region: string | null
  nationality: string | null
  has_work_authorization: boolean | null
  work_authorization_details: string | null
  onboarding_step: number
  onboarding_completed: boolean
  desired_workload_min: number | null
  desired_workload_max: number | null
  desired_work_location: string | null
  work_radius_km: number | null
  willing_to_commute: boolean | null
  willing_to_relocate: boolean | null
  earliest_start_date: string | null
  preferred_work_model: string | null
  accepts_fully_remote: boolean | null
  salary_min: number | null
  salary_max: number | null
}

type SkillEntry = { proficiency: string; name: string; custom: boolean }
type LanguageEntry = { proficiency: string; languages: { name: string; sort_order: number } | null }
type HistoryEntry = {
  id: string
  title: string
  subtitle: string | null
  start_date: string | null
  end_date: string | null
  is_current: boolean
  description: string | null
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!isUuid(id)) notFound()

  const { supabase, user: currentUser } = await requireAdmin()
  const { data } = await supabase.rpc("admin_list_users", { p_user_id: id })
  const user = (data as AdminUser[] | null)?.[0]
  if (!user) notFound()

  const name = userDisplayName(user)
  const banned = isBanned(user)

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-1">
          <Link href="/benutzer" className="text-sm text-muted-foreground hover:underline">
            ← Benutzer
          </Link>
          <h1 className="text-2xl font-semibold">{name}</h1>
          <UserBadges user={user} />
        </div>
        <UserActions
          userId={user.id}
          name={name}
          banned={banned}
          admin={user.is_admin}
          isSelf={user.id === currentUser.id}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Konto</CardTitle>
          </CardHeader>
          <CardContent>
            <Details
              items={[
                ["E-Mail", user.email ?? "–"],
                ["Rolle", roleLabel(user.account_role)],
                ["Registriert", formatDate(user.created_at, true)],
                ["Letzter Login", formatDate(user.last_sign_in_at, true)],
                ["E-Mail bestätigt", formatDate(user.email_confirmed_at, true)],
                ["Status", banned ? "Gesperrt" : "Aktiv"],
                ["Benutzer-ID", <code key="id" className="text-xs">{user.id}</code>],
              ]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
          </CardHeader>
          <CardContent>
            <UserProfileForm user={user} />
          </CardContent>
        </Card>
      </div>

      {user.account_role === "candidate" && (
        <CandidateData supabase={supabase} userId={user.id} />
      )}
    </div>
  )
}

async function CandidateData({
  supabase,
  userId,
}: {
  supabase: SupabaseClient
  userId: string
}) {
  const [profile, skills, customSkills, languages, educations, experiences] =
    await Promise.all([
      supabase.from("candidate_profiles").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("candidate_skills").select("proficiency, skills(name)").eq("candidate_id", userId),
      supabase.from("candidate_custom_skills").select("name, proficiency").eq("candidate_id", userId),
      supabase.from("candidate_languages").select("proficiency, languages(name, sort_order)").eq("candidate_id", userId),
      supabase
        .from("educations")
        .select("id, degree, institution_name, field_of_study, start_date, end_date, is_current, description")
        .eq("candidate_id", userId)
        .order("start_date", { ascending: false, nullsFirst: true }),
      supabase
        .from("work_experiences")
        .select("id, job_title, employer_name, location, start_date, end_date, is_current, description")
        .eq("candidate_id", userId)
        .order("start_date", { ascending: false }),
    ])

  const candidate = profile.data as CandidateProfile | null

  const skillEntries: SkillEntry[] = [
    ...((skills.data ?? []) as unknown as { proficiency: string; skills: { name: string } | null }[]).map(
      (row) => ({ proficiency: row.proficiency, name: row.skills?.name ?? "?", custom: false })
    ),
    ...((customSkills.data ?? []) as { name: string; proficiency: string }[]).map((row) => ({
      ...row,
      custom: true,
    })),
  ].sort((a, b) => a.name.localeCompare(b.name, "de"))

  const languageEntries = ((languages.data ?? []) as unknown as LanguageEntry[]).sort(
    (a, b) => (a.languages?.sort_order ?? 0) - (b.languages?.sort_order ?? 0)
  )

  const educationEntries: HistoryEntry[] = (
    (educations.data ?? []) as {
      id: string
      degree: string
      institution_name: string
      field_of_study: string | null
      start_date: string | null
      end_date: string | null
      is_current: boolean
      description: string | null
    }[]
  ).map((row) => ({
    ...row,
    title: row.degree,
    subtitle: [row.institution_name, row.field_of_study].filter(Boolean).join(" · "),
  }))

  const experienceEntries: HistoryEntry[] = (
    (experiences.data ?? []) as {
      id: string
      job_title: string
      employer_name: string
      location: string | null
      start_date: string | null
      end_date: string | null
      is_current: boolean
      description: string | null
    }[]
  ).map((row) => ({
    ...row,
    title: row.job_title,
    subtitle: [row.employer_name, row.location].filter(Boolean).join(" · "),
  }))

  const loadError = [profile, skills, customSkills, languages, educations, experiences].find(
    (result) => result.error
  )?.error

  return (
    <section className="grid gap-4">
      <div>
        <h2 className="text-lg font-medium">Kandidaten-Daten</h2>
        <p className="text-sm text-muted-foreground">
          So hat der Kandidat sein Profil in der App ausgefüllt. Nur lesend.
        </p>
      </div>

      {loadError && (
        <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          Kandidaten-Daten konnten nicht vollständig geladen werden: {loadError.message}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Wünsche & Rahmenbedingungen</CardTitle>
            {candidate && (
              <CardDescription>
                {candidate.onboarding_completed
                  ? "Onboarding abgeschlossen"
                  : `Onboarding bei Schritt ${candidate.onboarding_step} von 8`}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {candidate ? (
              <Details
                items={[
                  ["Region", candidate.region ?? "–"],
                  ["Nationalität", candidate.nationality ?? "–"],
                  [
                    "Arbeitsbewilligung",
                    [yesNo(candidate.has_work_authorization), candidate.work_authorization_details]
                      .filter(Boolean)
                      .join(" – "),
                  ],
                  ["Pensum", range(candidate.desired_workload_min, candidate.desired_workload_max, "%")],
                  ["Arbeitsort", candidate.desired_work_location ?? "–"],
                  ["Umkreis", candidate.work_radius_km != null ? `${candidate.work_radius_km} km` : "–"],
                  [
                    "Arbeitsmodell",
                    candidate.preferred_work_model
                      ? (workModels[candidate.preferred_work_model] ?? candidate.preferred_work_model)
                      : "–",
                  ],
                  ["Voll remote möglich", yesNo(candidate.accepts_fully_remote)],
                  ["Pendeln", yesNo(candidate.willing_to_commute)],
                  ["Umzug", yesNo(candidate.willing_to_relocate)],
                  ["Frühester Start", formatDate(candidate.earliest_start_date)],
                  ["Lohnvorstellung", range(candidate.salary_min, candidate.salary_max, " CHF")],
                ]}
              />
            ) : (
              <Empty>Kein Kandidatenprofil vorhanden.</Empty>
            )}
          </CardContent>
        </Card>

        <div className="grid content-start gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              {skillEntries.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {skillEntries.map((skill) => (
                    <li key={`${skill.custom}-${skill.name}`}>
                      <Badge variant={skill.custom ? "outline" : "secondary"}>
                        {skill.name}
                        <span className="text-muted-foreground">
                          · {skillProficiency[skill.proficiency] ?? skill.proficiency}
                        </span>
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <Empty>Keine Skills erfasst.</Empty>
              )}
              {skillEntries.some((skill) => skill.custom) && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Umrandete Skills hat der Kandidat selbst eingegeben – sie sind nicht im Katalog.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sprachen</CardTitle>
            </CardHeader>
            <CardContent>
              {languageEntries.length > 0 ? (
                <Details
                  items={languageEntries.map((entry) => [
                    entry.languages?.name ?? "?",
                    languageProficiency[entry.proficiency] ?? entry.proficiency,
                  ])}
                />
              ) : (
                <Empty>Keine Sprachen erfasst.</Empty>
              )}
            </CardContent>
          </Card>
        </div>

        <History title="Ausbildung" entries={educationEntries} empty="Keine Ausbildung erfasst." />
        <History title="Berufserfahrung" entries={experienceEntries} empty="Keine Berufserfahrung erfasst." />
      </div>
    </section>
  )
}

function History({
  title,
  entries,
  empty,
}: {
  title: string
  entries: HistoryEntry[]
  empty: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length > 0 ? (
          <ol className="grid gap-4">
            {entries.map((entry) => (
              <li key={entry.id} className="grid gap-0.5">
                <p className="font-medium">{entry.title}</p>
                {entry.subtitle && <p className="text-sm">{entry.subtitle}</p>}
                <p className="text-xs text-muted-foreground tabular-nums">
                  {formatDate(entry.start_date)} –{" "}
                  {entry.is_current ? "heute" : formatDate(entry.end_date)}
                </p>
                {entry.description && (
                  <p className="text-sm whitespace-pre-line text-muted-foreground">
                    {entry.description}
                  </p>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <Empty>{empty}</Empty>
        )}
      </CardContent>
    </Card>
  )
}

function Details({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="grid grid-cols-[minmax(0,10rem)_1fr] gap-x-4 gap-y-2 text-sm">
      {items.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="min-w-0 break-words">{value || "–"}</dd>
        </div>
      ))}
    </dl>
  )
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>
}

function yesNo(value: boolean | null) {
  if (value === null) return "–"
  return value ? "Ja" : "Nein"
}

function range(min: number | null, max: number | null, unit: string) {
  const format = (value: number) => value.toLocaleString("de-CH")
  if (min == null && max == null) return "–"
  if (min == null) return `bis ${format(max!)}${unit}`
  if (max == null || max === min) return `${max == null ? "ab " : ""}${format(min)}${unit}`
  return `${format(min)}–${format(max)}${unit}`
}
