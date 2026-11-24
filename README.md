# ZAZU Admin

Admin-Panel zum Pflegen der Berufswahl-Inhalte der ZAZU iOS-App (Ausbildung, Berufe, Skills).
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
- `app/(admin)/[resource]` – generische Listen-, Neu- und Bearbeiten-Seiten
- `proxy.ts` – Session-Refresh und Weiterleitung zum Login
- `lib/supabase/database.types.ts` – generiert mit `supabase gen types typescript --linked`
