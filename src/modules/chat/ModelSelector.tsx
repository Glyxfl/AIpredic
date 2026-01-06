import * as React from "react"
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { ModelInfo } from "@/lib/constants"

interface ModelSelectorProps {
  models: ModelInfo[]
  value: string
  onChange: (id: string) => void
  className?: string
}

export function ModelSelector({ models, value, onChange, className }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const selectedModel = models.find(m => m.id === value)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // 点击外部关闭下拉菜单
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl",
          "bg-[#2d2a3d]/80 border border-white/10",
          "hover:border-theme-purple/50 hover:bg-[#3d3a4d]/80",
          "transition-all duration-300 focus:outline-none",
          "text-slate-200"
        )}
      >
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-slate-200">
            {selectedModel?.name || '选择模型'}
          </span>
          <span className="text-xs text-slate-500">{selectedModel?.badge || ''}</span>
        </div>
        <ChevronsUpDown className="w-4 h-4 text-slate-400 ml-2" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="
            absolute top-full right-0 mt-2 w-56 
            bg-[#1e1b2e]/95 backdrop-blur-xl 
            rounded-xl border border-white/10 shadow-xl 
            z-50 py-2 overflow-hidden
          ">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onChange(model.id)
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full px-4 py-3 text-left transition-all duration-200",
                  "flex items-center justify-between",
                  value === model.id
                    ? "bg-theme-purple/20 text-theme-pinkLight"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {model.name}
                  </span>
                  <span className="text-xs text-slate-500">{model.badge}</span>
                </div>
                {value === model.id && (
                  <Check className="w-4 h-4 text-theme-purple" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}