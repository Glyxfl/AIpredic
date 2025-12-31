import { useState } from 'react'

export function useTyping(initialText: string = '') {
  const [text, setText] = useState(initialText)
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const appendToken = (token: string) => {
    setIsTyping(true)
    setText((prev) => prev + token)
    setError(null)
  }

  const finish = () => {
    setIsTyping(false)
  }

  const updateText = (newText: string) => {
    setText(newText)
  }

  const setErrorText = (errorMessage: string) => {
    setError(errorMessage)
    setIsTyping(false)
  }

  const reset = () => {
    setText('')
    setIsTyping(false)
    setError(null)
  }

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