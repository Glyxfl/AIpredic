import { useState, useCallback } from 'react'

export function useTyping(initialText: string = '') {
  const [text, setText] = useState(initialText)
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const appendToken = useCallback((token: string) => {
    setIsTyping(true)
    setText((prev) => prev + token)
    setError(null)
  }, [])

  const finish = useCallback(() => {
    setIsTyping(false)
    // 不再清空 text，保留最终内容供渲染使用
    // 调用者负责决定何时重置或如何处理最终文本
  }, [])

  const updateText = useCallback((newText: string) => {
    setText(newText)
  }, [])

  const setErrorText = useCallback((errorMessage: string) => {
    setError(errorMessage)
    setIsTyping(false)
  }, [])

  const reset = useCallback(() => {
    setText('')
    setIsTyping(false)
    setError(null)
  }, [])

  return {
    text,
    isTyping,
    error,
    appendToken,
    finish,
    updateText,
    setErrorText,
    reset,
  }
}