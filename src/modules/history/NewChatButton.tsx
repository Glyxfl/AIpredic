import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NewChatButton() {
  const router = useRouter()

  const handleClick = () => {
    router.push("/chat/new")
  }

  return (
    <Button
      onClick={handleClick}
      variant="ghost-mystical"
      className="w-full justify-start gap-2"
    >
      <Plus className="w-4 h-4" />
      新对话
    </Button>
  )
}