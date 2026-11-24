// Zentrale Beschreibung aller pflegbaren Kataloge.
// Listen, Formulare und Auswahlfelder werden daraus generiert.

export type Option = { value: string; label: string }

type BaseField = {
  name: string
  label: string
  help?: string
  required?: boolean
}

export type Field =
  | (BaseField & { type: "text" | "textarea" | "url" })
  | (BaseField & { type: "number"; defaultValue?: number })
  | (BaseField & { type: "boolean"; defaultValue?: boolean })
  | (BaseField & { type: "tags"; defaultValue?: string[] })
  | (BaseField & { type: "select"; options: Option[]; defaultValue?: string })
  | (BaseField & { type: "reference"; resource: string })

export type Resource = {
  slug: string
  table: string
  group: string
  label: string
  singular: string
  description: string
  primaryKey: string[]
  // Spalte, die als Name des Eintrags angezeigt wird (z. B. in Auswahllisten)
  labelColumn: string
  searchColumns: string[]
  listColumns: string[]
  defaultSort: { column: string; ascending: boolean }
  fields: Field[]
}

// Fokus vorerst auf die Schweiz: ESCO und Deutschland wurden entfernt
// (Migration 20261124190000_remove_esco_and_de.sql).
const sources: Option[] = [
  { value: "ch_isco_19", label: "CH-ISCO-19" },
]

const countries: Option[] = [
  { value: "CH", label: "Schweiz" },
]

// Prüfstatus importierter Einträge, siehe Prüfliste (/pruefliste)
export const validationStatus: Option[] = [
  { value: "review_required", label: "Prüfung nötig" },
  { value: "verified", label: "Geprüft" },
]

const fieldValidationStatus: Option[] = [
  ...validationStatus,
  { value: "reference_category", label: "Referenzkategorie (keine Prüfung)" },
]

export const fieldKinds: Option[] = [
  { value: "apprenticeship", label: "Lehrberuf" },
  { value: "study_area", label: "Studienbereich" },
  { value: "study_field", label: "Studienrichtung" },
  { value: "specialization", label: "Spezialisierung" },
  { value: "training_context", label: "Ausbildungskontext" },
  { value: "search_alias", label: "Suchbegriff" },
]

export const resources: Resource[] = [
  // ---------------------------------------------------------------- Ausbildung
  {
    slug: "ausbildungstypen",
    table: "education_types",
    group: "Ausbildung",
    label: "Ausbildungstypen",
    singular: "Ausbildungstyp",
    description: "Oberste Stufe der Auswahl, z. B. Studium oder Berufslehre.",
    primaryKey: ["id"],
    labelColumn: "name_de",
    searchColumns: ["name_de", "code"],
    listColumns: ["name_de", "code", "internal_group", "countries", "sort_order"],
    defaultSort: { column: "sort_order", ascending: true },
    fields: [
      { name: "name_de", label: "Name", type: "text", required: true },
      { name: "code", label: "Code", type: "text", required: true, help: "Eindeutiges Kürzel, z. B. A16." },
      { name: "internal_group", label: "Gruppe", type: "text" },
      { name: "countries", label: "Länder", type: "tags", defaultValue: ["CH"], help: "Länderkürzel, mit Komma getrennt. Aktuell nur CH." },
      { name: "sort_order", label: "Reihenfolge", type: "number", required: true, help: "Kleinere Zahlen erscheinen in der App weiter oben." },
    ],
  },
  {
    slug: "abschluesse",
    table: "education_type_degrees",
    group: "Ausbildung",
    label: "Abschlüsse",
    singular: "Abschluss",
    description: "Abschlüsse pro Ausbildungstyp, z. B. Bachelor oder EFZ.",
    primaryKey: ["id"],
    labelColumn: "name_de",
    searchColumns: ["name_de"],
    listColumns: ["name_de", "education_type_id", "note", "sort_order"],
    defaultSort: { column: "name_de", ascending: true },
    fields: [
      { name: "name_de", label: "Name", type: "text", required: true },
      { name: "education_type_id", label: "Ausbildungstyp", type: "reference", resource: "ausbildungstypen", required: true },
      { name: "note", label: "Hinweis", type: "text" },
      { name: "sort_order", label: "Reihenfolge", type: "number", required: true },
    ],
  },
  {
    slug: "fachrichtungen",
    table: "education_fields",
    group: "Ausbildung",
    label: "Fachrichtungen & Lehrberufe",
    singular: "Fachrichtung",
    description: "Studienrichtungen, Lehrberufe und Spezialisierungen.",
    primaryKey: ["id"],
    labelColumn: "name_de",
    searchColumns: ["name_de", "code"],
    listColumns: ["name_de", "field_kind", "parent_id", "country_code", "validation_status"],
    defaultSort: { column: "name_de", ascending: true },
    fields: [
      { name: "name_de", label: "Name", type: "text", required: true },
      {
        name: "field_kind",
        label: "Art",
        type: "select",
        options: fieldKinds,
      },
      { name: "parent_id", label: "Übergeordnet", type: "reference", resource: "fachrichtungen", help: "Optional, z. B. der Studienbereich einer Studienrichtung." },
      { name: "code", label: "Code", type: "text", required: true, help: "Eindeutiger technischer Schlüssel." },
      { name: "country_code", label: "Land", type: "select", options: countries },
      { name: "validation_status", label: "Status", type: "select", options: fieldValidationStatus, defaultValue: "review_required", required: true },
      { name: "source_name", label: "Quelle", type: "text" },
      { name: "source_url", label: "Quell-Link", type: "url" },
      { name: "note", label: "Notiz", type: "textarea", help: "Interne Anmerkung, z. B. aus dem Import. Wird in der App nicht angezeigt." },
    ],
  },
  {
    slug: "abschluss-fachrichtungen",
    table: "education_degree_fields",
    group: "Ausbildung",
    label: "Abschluss ↔ Fachrichtung",
    singular: "Zuordnung",
    description: "Welche Fachrichtungen bei welchem Abschluss wählbar sind.",
    primaryKey: ["education_type_degree_id", "education_field_id"],
    labelColumn: "education_field_id",
    searchColumns: [],
    listColumns: ["education_type_degree_id", "education_field_id"],
    defaultSort: { column: "education_type_degree_id", ascending: true },
    fields: [
      { name: "education_type_degree_id", label: "Abschluss", type: "reference", resource: "abschluesse", required: true },
      { name: "education_field_id", label: "Fachrichtung", type: "reference", resource: "fachrichtungen", required: true },
    ],
  },
  {
    slug: "institutionstypen",
    table: "education_institution_types",
    group: "Ausbildung",
    label: "Institutionstypen",
    singular: "Institutionstyp",
    description: "Arten von Schulen, z. B. Universität oder Fachhochschule.",
    primaryKey: ["id"],
    labelColumn: "name_de",
    searchColumns: ["name_de"],
    listColumns: ["name_de", "typical_education_type", "countries", "sort_order"],
    defaultSort: { column: "sort_order", ascending: true },
    fields: [
      { name: "name_de", label: "Name", type: "text", required: true },
      { name: "typical_education_type", label: "Typische Ausbildung", type: "text" },
      { name: "countries", label: "Länder", type: "tags", defaultValue: ["CH"], help: "Länderkürzel, mit Komma getrennt. Aktuell nur CH." },
      { name: "note", label: "Hinweis", type: "text" },
      { name: "sort_order", label: "Reihenfolge", type: "number", required: true, defaultValue: 0 },
    ],
  },
  {
    slug: "institutionen",
    table: "education_institutions",
    group: "Ausbildung",
    label: "Institutionen",
    singular: "Institution",
    description: "Konkrete Schulen und Hochschulen.",
    primaryKey: ["id"],
    labelColumn: "name",
    searchColumns: ["name"],
    listColumns: ["name", "institution_type_id", "country_code", "validation_status"],
    defaultSort: { column: "name", ascending: true },
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "institution_type_id", label: "Institutionstyp", type: "reference", resource: "institutionstypen", required: true },
      { name: "country_code", label: "Land", type: "select", options: countries, defaultValue: "CH", required: true },
      { name: "validation_status", label: "Status", type: "select", options: validationStatus, defaultValue: "review_required", required: true },
      { name: "source_url", label: "Quell-Link", type: "url" },
    ],
  },
  {
    slug: "qualifikationen",
    table: "education_qualifications",
    group: "Ausbildung",
    label: "Qualifikationen",
    singular: "Qualifikation",
    description: "Titel, die Kandidaten auswählen können. Inaktive sind in der App ausgeblendet.",
    primaryKey: ["id"],
    labelColumn: "name",
    searchColumns: ["name", "source_code"],
    listColumns: ["name", "education_level", "is_active", "source"],
    defaultSort: { column: "name", ascending: true },
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "education_level", label: "Bildungsstufe", type: "text", required: true, help: "Technischer Wert, den die App zum Filtern nutzt." },
      { name: "is_active", label: "In der App sichtbar", type: "boolean", defaultValue: true },
      { name: "source", label: "Quelle", type: "text" },
      { name: "source_code", label: "Quell-Code", type: "text" },
      { name: "source_url", label: "Quell-Link", type: "url" },
    ],
  },
  {
    slug: "qualifikations-optionen",
    table: "education_qualification_options",
    group: "Ausbildung",
    label: "Qualifikation ↔ Abschluss",
    singular: "Zuordnung",
    description: "Welche Qualifikation bei welchem Abschluss, welcher Fachrichtung oder Institution angeboten wird.",
    primaryKey: ["id"],
    labelColumn: "qualification_id",
    searchColumns: [],
    listColumns: ["qualification_id", "education_type_degree_id", "education_field_id", "institution_id"],
    defaultSort: { column: "created_at", ascending: false },
    fields: [
      { name: "qualification_id", label: "Qualifikation", type: "reference", resource: "qualifikationen", required: true },
      { name: "education_type_degree_id", label: "Abschluss", type: "reference", resource: "abschluesse", required: true },
      { name: "education_field_id", label: "Fachrichtung", type: "reference", resource: "fachrichtungen" },
      { name: "institution_id", label: "Institution", type: "reference", resource: "institutionen" },
    ],
  },

  // ---------------------------------------------------------------- Berufe
  {
    slug: "berufskategorien",
    table: "occupation_categories",
    group: "Berufe",
    label: "Berufskategorien",
    singular: "Berufskategorie",
    description: "Hierarchie der Berufsgruppen nach CH-ISCO-19.",
    primaryKey: ["id"],
    labelColumn: "name_de",
    searchColumns: ["name_de", "code"],
    listColumns: ["name_de", "code", "level", "parent_id", "source"],
    defaultSort: { column: "code", ascending: true },
    fields: [
      { name: "name_de", label: "Name", type: "text", required: true },
      { name: "code", label: "Code", type: "text", required: true },
      { name: "level", label: "Ebene", type: "number", required: true, help: "1 = oberste Ebene, 5 = feinste Ebene." },
      { name: "parent_id", label: "Übergeordnete Kategorie", type: "reference", resource: "berufskategorien" },
      { name: "source", label: "Quelle", type: "select", options: sources, defaultValue: "ch_isco_19", required: true },
    ],
  },
  {
    slug: "berufe",
    table: "occupations",
    group: "Berufe",
    label: "Berufe",
    singular: "Beruf",
    description: "Offizielle Berufe. Inaktive Berufe sind in der App ausgeblendet.",
    primaryKey: ["id"],
    labelColumn: "name_de",
    searchColumns: ["name_de", "source_code", "isco_08_code"],
    listColumns: ["name_de", "category_id", "source_code", "source", "is_active"],
    defaultSort: { column: "name_de", ascending: true },
    fields: [
      { name: "name_de", label: "Name", type: "text", required: true },
      { name: "category_id", label: "Berufskategorie", type: "reference", resource: "berufskategorien" },
      { name: "is_active", label: "In der App sichtbar", type: "boolean", defaultValue: true },
      { name: "source", label: "Quelle", type: "select", options: sources, defaultValue: "ch_isco_19", required: true },
      { name: "source_code", label: "Quell-Code", type: "text", required: true },
      { name: "isco_08_code", label: "ISCO-08-Code", type: "text" },
      { name: "source_uri", label: "Quell-Link", type: "url" },
    ],
  },
  {
    slug: "beruf-skills",
    table: "occupation_skills",
    group: "Berufe",
    label: "Beruf ↔ Skill",
    singular: "Zuordnung",
    description: "Welche Skills zu einem Beruf gehören.",
    primaryKey: ["occupation_id", "skill_id"],
    labelColumn: "skill_id",
    searchColumns: [],
    listColumns: ["occupation_id", "skill_id", "relation_type"],
    defaultSort: { column: "created_at", ascending: false },
    fields: [
      { name: "occupation_id", label: "Beruf", type: "reference", resource: "berufe", required: true },
      { name: "skill_id", label: "Skill", type: "reference", resource: "skills", required: true },
      {
        name: "relation_type",
        label: "Bedeutung",
        type: "select",
        required: true,
        defaultValue: "essential",
        options: [
          { value: "essential", label: "Wichtig" },
          { value: "optional", label: "Optional" },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Skills
  {
    slug: "skill-kategorien",
    table: "skill_categories",
    group: "Skills",
    label: "Skill-Kategorien",
    singular: "Skill-Kategorie",
    description: "Gruppen, in denen Skills in der App angezeigt werden.",
    primaryKey: ["id"],
    labelColumn: "name",
    searchColumns: ["name"],
    listColumns: ["name", "app_behavior", "sort_order"],
    defaultSort: { column: "sort_order", ascending: true },
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "sort_order", label: "Reihenfolge", type: "number", required: true, defaultValue: 0 },
      { name: "app_behavior", label: "Verhalten in der App", type: "text", help: "Technischer Wert – nur ändern, wenn abgesprochen." },
    ],
  },
  {
    slug: "skills",
    table: "skills",
    group: "Skills",
    label: "Skills",
    singular: "Skill",
    description: "Fähigkeiten, die Kandidaten in ihrem Profil wählen können.",
    primaryKey: ["id"],
    labelColumn: "name",
    searchColumns: ["name", "search_alias"],
    listColumns: ["name", "category_id", "category", "cv_selectable"],
    defaultSort: { column: "name", ascending: true },
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "category_id", label: "Skill-Kategorie", type: "reference", resource: "skill-kategorien" },
      { name: "category", label: "Kategorie (Text)", type: "text", required: true, help: "Wird von der App zum Filtern genutzt. Bleibt leer → Name der Skill-Kategorie." },
      { name: "search_alias", label: "Suchbegriffe", type: "text", help: "Weitere Begriffe, unter denen der Skill gefunden wird." },
      { name: "cv_selectable", label: "Im Profil wählbar", type: "boolean", defaultValue: true },
      { name: "skill_type", label: "Skill-Typ", type: "text" },
      { name: "origin", label: "Herkunft", type: "text" },
      { name: "proficiency_levels", label: "Niveaustufen", type: "text" },
      { name: "skill_code", label: "Skill-Code", type: "text" },
    ],
  },
]

export const resourceGroups = ["Ausbildung", "Berufe", "Skills"] as const

export function getResource(slug: string) {
  return resources.find((resource) => resource.slug === slug)
}

// Datensatz-Schlüssel für die URL; zusammengesetzte Schlüssel mit "~" verbunden.
export function encodeRecordKey(resource: Resource, row: Record<string, unknown>) {
  return resource.primaryKey.map((column) => String(row[column])).join("~")
}

export function decodeRecordKey(resource: Resource, key: string) {
  const values = decodeURIComponent(key).split("~")
  if (values.length !== resource.primaryKey.length) return null
  return Object.fromEntries(
    resource.primaryKey.map((column, index) => [column, values[index]])
  )
}
