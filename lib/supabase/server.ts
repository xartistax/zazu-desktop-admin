import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { connection } from "next/server"

export async function createClient() {
  // Supabase liest die Uhrzeit (Session-Ablauf) – nur zur Request-Zeit ausführen.
  await connection()
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Aus einer Server Component aufgerufen – der Proxy erneuert die Session.
          }
        },
      },
    }
  )
}
