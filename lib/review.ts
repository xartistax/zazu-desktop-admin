// Prüfliste: Kataloge mit importierten Einträgen, die ein Admin kontrollieren soll.
// Prüfstatus und Prüfvermerk siehe Migration 20261124160000_add_catalog_review.sql
// im ZAZU-iOS-Repo.

export const reviewCatalogs = [
  { slug: "fachrichtungen", label: "Fachrichtungen & Lehrberufe" },
  { slug: "institutionen", label: "Institutionen" },
] as const

export type ReviewCatalog = (typeof reviewCatalogs)[number]["slug"]

export function isReviewCatalog(slug: string): slug is ReviewCatalog {
  return reviewCatalogs.some((catalog) => catalog.slug === slug)
}

export type ReviewRow = {
  id: string
  name: string
  // Art bzw. Institutionstyp
  kind: string | null
  parent: string | null
  source_name: string | null
  source_url: string | null
  note: string | null
  reviewed_at: string | null
  reviewer: string | null
}
