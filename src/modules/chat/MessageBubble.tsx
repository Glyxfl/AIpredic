import * as React from "react"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  id?: string
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export function MessageBubble({ id, role, content, isStreaming }: MessageBubbleProps) {
  const isUser = role === 'user'

  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start",
      !isUser && "message-ai"
    )}>
      <div
        className={cn(
          "max-w-[80%] p-4 rounded-2xl",
          isUser
            ? "bg-[#291F5E] text-purple-200 rounded-br-md message-user shadow-lg shadow-[#291F5E]/30"
            : "bg-[#2d2a3d]/80 border border-white/10 text-slate-200 rounded-bl-md backdrop-blur-sm",
          isStreaming && !isUser && "animate-pulse"
        )}
      >
        <p className="whitespace-pre-wrap break-words leading-relaxed text-sm">
          {content || (isStreaming && <span className="animate-pulse">▋</span>)}
        </p>
      </div>
    </div>
  )
}