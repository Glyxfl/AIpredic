"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import useSWR from "swr"
import { Menu } from "lucide-react"
import { ModelSelector } from "@/modules/chat/ModelSelector"
import { ChatWindow } from "@/modules/chat/ChatWindow"
import { Sidebar } from "@/modules/history/Sidebar"
import { Button } from "@/components/ui/button"
import { MODELS } from "@/lib/constants"
import { DEFAULT_MODEL } from "@/lib/constants"

export default function ChatPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [isSidebarOpen, setSidebarOpen] = React.useState(false)
  const [model, setModel] = React.useState(DEFAULT_MODEL)

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-500">加载中...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const chatId = params?.slug?.[0] || "new"

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-amber-100 bg-white/80 backdrop-blur-sm px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="text-gradient font-semibold text-lg">
                ZGSM-AI
              </div>
            </div>

            <div className="hidden sm:block">
              <ModelSelector
                models={MODELS}
                value={model}
                onChange={setModel}
              />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          <ChatWindow
            chatId={chatId}
            model={model}
            onModelChange={setModel}
          />
        </main>
      </div>
    </div>
  )
}