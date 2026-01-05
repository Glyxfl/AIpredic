import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { streamChatCompletion } from "@/lib/openai"
import { streamClaudeCompletion } from "@/lib/claude"
import { streamMoonshotCompletion } from "@/lib/moonshot"
import { FORTUNE_SYSTEM_PROMPT, ModelType } from "@/lib/constants"

// 强制动态渲染，因为使用了 getServerSession
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 })
    }

    const { searchParams } = new URL(req.url)
    const chatId = searchParams.get("chatId")

    if (!chatId) {
      return NextResponse.json({ error: "缺少 chatId" }, { status: 400 })
    }

    const chat = await prisma.chat.findUnique({
      where: { id: chatId, userId: user.id }
    })

    if (!chat) {
      return NextResponse.json({ error: "聊天不存在" }, { status: 404 })
    }

    return NextResponse.json({
      id: chat.id,
      title: chat.title,
      model: chat.model,
      messages: chat.messages,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    })
  } catch (error) {
    console.error("GET Chat API error:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "未登录" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 })
    }

    const body = await req.json()
    const { chatId, model, message } = body

    if (!model || !message) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 })
    }

    let chat
    let messages: any[] = []
    
    if (chatId) {
      chat = await prisma.chat.findUnique({
        where: { id: chatId, userId: user.id }
      })
      
      if (chat) {
        messages = [...(chat.messages as any[]), { role: "user", content: message }]
        
        chat = await prisma.chat.update({
          where: { id: chatId },
          data: {
            messages,
            model,
            updatedAt: new Date(),
          }
        })
      }
    }
    
    if (!chat) {
      const title = message.slice(0, 30) + (message.length > 30 ? "..." : "")
      messages = [{ role: "system", content: FORTUNE_SYSTEM_PROMPT }, { role: "user", content: message }]
      
      chat = await prisma.chat.create({
        data: {
          userId: user.id,
          title,
          messages,
          model,
        }
      })
    }

    messages = chat.messages as any[]

    const encoder = new TextEncoder()
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = ""
          
          const onData = (token: string) => {
            fullResponse += token
            controller.enqueue(encoder.encode(`data: {"token": "${token}"}\n\n`))
          }

          if (model === ModelType.CLAUDE_35) {
            await streamClaudeCompletion(messages, "claude-3-5-sonnet-20241022", onData)
          } else if (model === ModelType.MOONSHOT_V1) {
            await streamMoonshotCompletion(messages, "kimi-k2-turbo-preview", onData)
          } else {
            await streamChatCompletion(messages, model, onData)
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"))

          // 确保助手消息只保存一次：移除最后一条助手消息（如果是流式生成的部分内容），添加完整消息
          let messagesToSave = messages.filter((m: any) => {
            // 保留所有非助手消息
            if (m.role !== 'assistant') return true
            // 移除最后一条助手消息（如果它是刚刚开始生成的）
            return m.content === fullResponse
          })
          
          // 确保添加完整的助手消息
          const hasFullAssistantMessage = messagesToSave.some(
            (m: any) => m.role === 'assistant' && m.content === fullResponse
          )
          
          if (!hasFullAssistantMessage) {
            messagesToSave = [...messagesToSave, { role: "assistant", content: fullResponse }]
          }
          
          await prisma.chat.update({
            where: { id: chat.id },
            data: {
              messages: messagesToSave,
            }
          })
        } catch (error) {
          console.error("Stream error:", error)
          controller.enqueue(encoder.encode("data: {\"error\": \"处理失败\"}\n\n"))
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
      "X-Chat-Id": chat.id,
    }
  })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}