import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { streamChatCompletion } from "@/lib/openai"
import { streamClaudeCompletion } from "@/lib/claude"
import { FORTUNE_SYSTEM_PROMPT, DEFAULT_MODEL } from "@/lib/constants"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const body = await req.json()
    const { question, type } = body

    if (!question) {
      return NextResponse.json({ error: "请输入算命问题" }, { status: 400 })
    }

    const enhancedPrompt = type
      ? `${FORTUNE_SYSTEM_PROMPT}\n\n用户询问类型：${type}\n用户问题：${question}`
      : `${FORTUNE_SYSTEM_PROMPT}\n\n用户问题：${question}`

    const messages = [
      { role: "system", content: FORTUNE_SYSTEM_PROMPT },
      { role: "user", content: question }
    ]

    const encoder = new TextEncoder()
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const onData = (token: string) => {
            controller.enqueue(encoder.encode(`data: {"token": "${token}"}\n\n`))
          }

          await streamChatCompletion(messages, DEFAULT_MODEL, onData)
          controller.enqueue(encoder.encode("data: [DONE]\n\n"))
        } catch (error) {
          console.error("Divination stream error:", error)
          controller.enqueue(encoder.encode("data: {\"error\": \"计算失败\"}\n\n"))
        } finally {
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      }
    })
  } catch (error) {
    console.error("Divination API error:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}