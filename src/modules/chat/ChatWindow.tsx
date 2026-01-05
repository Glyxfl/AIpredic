import * as React from "react"
import { useSWRConfig } from "swr"
import { Send } from "lucide-react"
import { MessageBubble } from "./MessageBubble"
import { useTyping } from "./useTyping"
import { Message } from "./types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface ChatWindowProps {
  chatId: string
  model: string
  onModelChange: (m: string) => void
}

export function ChatWindow({ chatId, model, onModelChange }: ChatWindowProps) {
  const { mutate } = useSWRConfig()
  const [input, setInput] = React.useState("")
  const [messages, setMessages] = React.useState<Message[]>([])
  const [isLoading, setLoading] = React.useState(false)
  const [currentChatId, setCurrentChatId] = React.useState(chatId)
  const typing = useTyping("")
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  React.useEffect(() => {
    scrollToBottom()
  }, [messages, typing.text, scrollToBottom])

  React.useEffect(() => {
    const fetchChat = async () => {
      if (!chatId || chatId === "new") return

      try {
        const res = await fetch(`/api/chat?chatId=${chatId}`)
        if (res.ok) {
          const data = await res.json()
          setMessages(data.messages || [])
          if (data.model && data.model !== model) {
            onModelChange(data.model)
          }
        }
      } catch (error) {
        console.error("Failed to fetch chat:", error)
      }
    }

    fetchChat()
  }, [chatId, model, onModelChange])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessageContent = input.trim()
    setInput("")
    setLoading(true)
    typing.reset()
    
    // 先添加用户消息
    setMessages((prev) => [...prev, { role: "user", content: userMessageContent }])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: currentChatId === "new" ? undefined : currentChatId,
          model,
          message: userMessageContent,
        }),
      })

      // 从响应头获取新的 chatId 并更新状态
      const newChatId = response.headers.get("X-Chat-Id")
      if (newChatId && currentChatId === "new") {
        setCurrentChatId(newChatId)
      }

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error("No response body")

      let accumulatedContent = ""
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            
            if (data === "[DONE]") {
              // 直接将最终内容添加到消息数组中
              setMessages((prev) => [
                ...prev,
                { role: "assistant", content: accumulatedContent }
              ])
              // 重置 typing 状态（不清空内容，因为消息已经保存）
              typing.reset()
              break
            }

            try {
              const parsed = JSON.parse(data)
              if (parsed.token) {
                typing.appendToken(parsed.token)
                accumulatedContent += parsed.token
              }
              if (parsed.error) {
                typing.setErrorText(parsed.error)
              }
            } catch (e) {
              console.error("Failed to parse SSE data:", e)
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error)
      typing.setErrorText("发送失败，请重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto scrollbar-amber p-6">
        {messages.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full text-center">
            <div className="card-glow p-8 max-w-md">
              <div className="text-gradient text-xl font-semibold mb-2">
                开始对话
              </div>
              <p className="text-slate-600 text-sm">
                向算命先生询问运势问题，我会用温暖简洁的语言为您解答
              </p>
            </div>
          </div>
        )}

        {messages
          .filter((msg) => msg.role !== 'system')
          .map((msg, idx) => (
            <MessageBubble
              key={idx}
              role={msg.role as 'user' | 'assistant'}
              content={msg.content}
            />
          ))}

        {(isLoading || typing.isTyping) && (
          <MessageBubble
            role="assistant"
            content={typing.text}
            isStreaming={true}
          />
        )}

        {typing.error && (
          <div className="flex justify-start mb-4">
            <div className="max-w-[80%] p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 rounded-bl-md">
              <p className="text-sm">{typing.error}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-6 border-t border-amber-100">
        <div className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入您的问题..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}