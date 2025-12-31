export async function streamYiCompletion(
  messages: Array<{ role: string; content: string }>,
  model: string = "yi-34b-chat",
  onData: (token: string) => void
) {
  const apiKey = process.env.YI_API_KEY
  if (!apiKey) {
    throw new Error('YI_API_KEY is not set')
  }

  // YI 模型使用兼容 OpenAI 的接口
  const response = await fetch('https://api.lingyiwanwu.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      max_tokens: 1024,
    }),
  })

  if (!response.ok) {
    throw new Error(`YI API error: ${response.statusText}`)
  }

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) {
    throw new Error('No response body')
  }

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n')

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        if (data === '[DONE]') continue

        try {
          const parsed = JSON.parse(data)
          const token = parsed.choices?.[0]?.delta?.content || ''
          if (token) {
            onData(token)
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
  }
}