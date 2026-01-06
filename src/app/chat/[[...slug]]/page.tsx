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
import { MODELS, DEFAULT_MODEL, ModelType } from "@/lib/constants"

export default function ChatPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [isSidebarOpen, setSidebarOpen] = React.useState(false)
  const [model, setModel] = React.useState<ModelType>(DEFAULT_MODEL)
  const handleModelChange = (id: string) => setModel(id as ModelType)
  const handleChatModelChange = (m: string) => setModel(m as ModelType)

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
    <div className="flex h-screen overflow-hidden relative">
      {/* 背景光晕装饰 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-theme-purple/20 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-theme-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-theme-pinkLight/10 rounded-full blur-3xl" />
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="
          border-b border-white/10
          bg-[#1e1b2e]/80 backdrop-blur-xl px-4 py-4
        ">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-slate-300 hover:text-white hover:bg-white/10"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="text-gradient-mystical font-bold text-xl tracking-wide">
                知命阁 · AI
              </div>
            </div>

            <div className="hidden sm:block">
              <ModelSelector
                models={MODELS}
                value={model}
                onChange={handleModelChange}
                className="bg-[#2d2a3d]/80 border border-white/10"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden relative">
          <ChatWindow
            chatId={chatId}
            model={model}
            onModelChange={handleChatModelChange}
          />
        </main>
      </div>
    </div>
  )
}