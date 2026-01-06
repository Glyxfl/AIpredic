import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUserChats } from "./api"
import { NewChatButton } from "./NewChatButton"
import { UserBadge } from "@/modules/profile/UserBadge"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter()
  const params = useParams()
  const currentChatId = params?.slug?.[0]
  const { data: chats, isLoading } = useUserChats()

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity backdrop-blur-sm",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 w-72",
          "bg-[#1e1b2e]/95 backdrop-blur-xl",
          "border-r border-white/10",
          "transform transition-transform z-50 lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="mb-6">
            <NewChatButton />
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-mystical-custom space-y-1">
            <div className="px-3 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
              历史记录
            </div>

            {isLoading ? (
              <div className="space-y-2 px-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 bg-[#2d2a3d]/50 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : chats && chats.length > 0 ? (
              chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    router.push(`/chat/${chat.id}`)
                    onClose()
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-3",
                    currentChatId === chat.id
                      ? "bg-theme-purple/20 text-theme-pinkLight border border-theme-purple/30"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  )}
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 truncate text-sm">{chat.title}</span>
                </button>
              ))
            ) : (
              <div className="px-3 py-8 text-center text-sm text-slate-500">
                暂无历史记录
              </div>
            )}
          </div>

          <div className="border-t border-white/10 pt-4 mt-4">
            <UserBadge />
          </div>
        </div>
      </aside>
    </>
  )
}