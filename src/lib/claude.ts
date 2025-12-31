import Anthropic from '@anthropic-ai/sdk'

export function createAnthropic() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set')
  }
  return new Anthropic({ apiKey })
}

export async function streamClaudeCompletion(
  messages: Array<{ role: string; content: string }>,
  model: string = 'claude-3-5-sonnet-20241022',
  onData: (token: string) => void
) {
  const anthropic = createAnthropic()
  const stream = await anthropic.messages.create({
    model,
    messages: messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    })),
    stream: true,
    max_tokens: 1024,
  })

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      onData(chunk.delta.text)
    }
  }
}