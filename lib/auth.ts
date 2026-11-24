import "server-only"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

// Liefert einen Supabase-Client für einen eingeloggten Admin.
// Schreibrechte werden zusätzlich per RLS (public.is_admin()) erzwungen.
export async function requireAdmin() {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    redirect("/login")
  }

  const { data: isAdmin } = await supabase.rpc("is_admin")
  if (!isAdmin) {
    redirect("/login?error=no-admin")
  }

  return { supabase, user: userData.user }
}
