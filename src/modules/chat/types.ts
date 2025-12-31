export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
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