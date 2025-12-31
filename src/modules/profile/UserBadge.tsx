import * as React from "react"
import { useSession, signOut } from "next-auth/react"
import { LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function UserBadge() {
  const { data: session } = useSession()

  if (!session?.user?.email) return null

  const email = session.user.email
  const displayName = email.split("@")[0]

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">
          {displayName}
        </p>
        <p className="text-xs text-slate-500 truncate">{email}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex-shrink-0"
        title="退出登录"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  )
}