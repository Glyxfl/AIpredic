import * as React from "react"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export function MessageBubble({ role, content, isStreaming }: MessageBubbleProps) {
  const isUser = role === 'user'

  return (
    <div className={cn("flex w-full mb-4", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] p-4 rounded-2xl shadow-sm",
          isUser
            ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-br-md"
            : "bg-white border border-amber-100 text-slate-800 rounded-bl-md",
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