export async function streamMoonshotCompletion(
  messages: Array<{ role: string; content: string }>,
  model: string = "kimi-k2-turbo-preview",
  onData: (token: string) => void
) {
  const apiKey = process.env.MOONSHOT_API_KEY
  if (!apiKey) {
    throw new Error('MOONSHOT_API_KEY is not set')
  }

  // Moonshot AI 使用兼容 OpenAI 的接口
  const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      temperature: 0.6,
      max_tokens: 1024,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Moonshot API error: ${response.status} ${response.statusText} - ${errorText}`)
  }

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) {
    throw new Error('No response body')
  }

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split('\n')

    for (const line of lines) {
      if (line.trim().startsWith('data: ')) {
        const data = line.trim().slice(6)
        if (data === '[DONE]') continue

        try {
          const parsed = JSON.parse(data)
          const token = parsed.choices?.[0]?.delta?.content || ''
          if (token) {
            onData(token)
          }
        } catch (e) {
          // Skip invalid JSON
          console.warn('Failed to parse SSE data:', e)
        }
      }
    }
  }
}