import { SWRResponse } from "swr"
import useSWR from "swr"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("Failed to fetch")
  }
  return res.json()
}

export interface ChatPreview {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

export function useUserChats() {
  const { data, error, isValidating, mutate } = useSWR<ChatPreview[]>("/api/chats", fetcher)
   
  return {
    data,
    error,
    isLoading: !error && !data,
    isValidating,
    mutate,
  }
}