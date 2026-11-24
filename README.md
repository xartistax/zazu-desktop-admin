# ZAZU Admin

Admin-Panel für die ZAZU iOS-App: Benutzerverwaltung und Pflege der Berufswahl-Inhalte (Ausbildung, Berufe, Skills).
Next.js (App Router) + Supabase + shadcn/ui.

## Setup

```bash
pnpm install
cp .env.example .env.local   # Supabase-URL und Publishable Key eintragen
pnpm dev                     # http://localhost:3000
```

## Umgebungsvariablen

| Variable | Beschreibung |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL des Supabase-Projekts |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable (anon) Key – kein Service-Role-Key nötig |

## Admin-Zugriff

Schreibrechte werden per RLS erzwungen. Voraussetzung ist die Migration
`20261124120000_add_admin_panel_access.sql` im ZAZU-iOS-Repo (`ZAZU/supabase/migrations/`).
Sie legt `public.admin_users`, `public.is_admin()` und die Admin-Policies an.
Für die Benutzerverwaltung zusätzlich `20261124140000_add_admin_user_management.sql`
(Lesezugriff auf Profile und Kandidaten-Daten sowie die Funktionen `admin_list_users`,
`admin_set_user_banned`, `admin_set_user_admin` und `admin_delete_user`).

Neuen Admin anlegen:

1. Supabase-Dashboard → Auth → Users → «Add user» (E-Mail + Passwort)
2. Im SQL-Editor freischalten:

   ```sql
   INSERT INTO public.admin_users (user_id)
   SELECT id FROM auth.users WHERE email = 'name@example.com';
   ```

## Struktur

- `lib/resources.ts` – alle pflegbaren Tabellen mit Feldern und Beschriftungen; neue Bereiche hier ergänzen
- `lib/actions.ts` – Server Actions (Speichern, Löschen, Suche für Auswahlfelder)
- `app/(admin)/benutzer`, `lib/users.ts`, `lib/user-actions.ts` – Benutzerverwaltung (eigene Seiten, nicht über `resources.ts`)
- `app/(admin)/pruefliste`, `lib/review.ts`, `lib/review-actions.ts` – Prüfliste für importierte Fachrichtungen und Institutionen; Prüfvermerk (wer/wann) setzt der DB-Trigger aus `20261124160000_add_catalog_review.sql`
- `app/(admin)/[resource]` – generische Listen-, Neu- und Bearbeiten-Seiten
- `proxy.ts` – Session-Refresh und Weiterleitung zum Login
- `lib/supabase/database.types.ts` – generiert mit `supabase gen types typescript --linked`
