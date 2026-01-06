export interface Message {
  id?: string  // 消息唯一标识
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: number  // 消息时间戳
}

export type MessageRole = 'user' | 'assistant'

export interface ChatData {
  id: string
  title: string
  messages: Message[]
  model: string
  createdAt: string
  updatedAt: string
}