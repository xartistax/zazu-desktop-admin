import { Badge } from "@/components/ui/badge"
import { isBanned, type AdminUser } from "@/lib/users"

export function UserBadges({ user }: { user: AdminUser }) {
  return (
    <div className="flex flex-wrap gap-1">
      {user.is_admin && <Badge>Admin</Badge>}
      {isBanned(user) && <Badge variant="destructive">Gesperrt</Badge>}
      {!user.email_confirmed_at && <Badge variant="outline">E-Mail unbestätigt</Badge>}
    </div>
  )
}
