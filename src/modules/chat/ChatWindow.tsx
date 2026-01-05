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
  // 使用 ref 而非 state 来跟踪当前聊天ID，避免状态不同步问题
  const currentChatIdRef = React.useRef<string>(chatId)
  const typing = useTyping("")
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const isFetchingRef = React.useRef(false)

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  React.useEffect(() => {
    scrollToBottom()
  }, [messages, typing.text, scrollToBottom])

  // 同步 chatId 到 ref
  React.useEffect(() => {
    currentChatIdRef.current = chatId
  }, [chatId])

  const fetchChat = React.useCallback(async () => {
    const idToFetch = currentChatIdRef.current
    if (!idToFetch || idToFetch === "new") return
    
    // 防止并发请求
    if (isFetchingRef.current) return
    isFetchingRef.current = true

    try {
      const res = await fetch(`/api/chat?chatId=${idToFetch}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
        if (data.model && data.model !== model) {
          onModelChange(data.model)
        }
      }
    } catch (error) {
      console.error("Failed to fetch chat:", error)
    } finally {
      isFetchingRef.current = false
    }
  }, [model, onModelChange])

  React.useEffect(() => {
    fetchChat()
  }, [chatId, fetchChat])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessageContent = input.trim()
    setInput("")
    setLoading(true)
    typing.reset()
    
    // 先添加用户消息到本地状态
    setMessages((prev) => [...prev, { role: "user", content: userMessageContent }])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: currentChatIdRef.current === "new" ? undefined : currentChatIdRef.current,
          model,
          message: userMessageContent,
        }),
      })

      // 从响应头获取新的 chatId 并更新 ref
      const newChatId = response.headers.get("X-Chat-Id")
      if (newChatId && currentChatIdRef.current === "new") {
        currentChatIdRef.current = newChatId
        // 通知父组件刷新路由
        window.history.pushState({}, '', `/chat/${newChatId}`)
      }

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error("No response body")

      let accumulatedContent = ""
      let hasReceivedDone = false
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            
            if (data === "[DONE]") {
              hasReceivedDone = true
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
        
        if (hasReceivedDone) break
      }

      // 将助手消息添加到本地消息数组
      if (accumulatedContent) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: accumulatedContent }
        ])
      }
      
      // 重置 typing 状态
      typing.reset()
      
      // 关键修复：从服务器重新获取完整消息列表，确保同步
      // 延迟一下确保服务器完成保存
      setTimeout(() => {
        fetchChat()
      }, 500)
      
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