import OpenAI from 'openai'

export function createOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set')
  }
  return new OpenAI({ apiKey })
}

export async function streamChatCompletion(
  messages: Array<{ role: string; content: string }>,
  model: string = 'gpt-4o',
  onData: (token: string) => void
) {
  const openai = createOpenAI()
  const stream = await openai.chat.completions.create({
    model,
    messages,
    stream: true,
  })

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content || ''
    if (token) {
      onData(token)
    }
  }
}