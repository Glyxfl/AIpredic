import * as React from "react"
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { ModelInfo } from "@/lib/constants"

interface ModelSelectorProps {
  models: ModelInfo[]
  value: string
  onChange: (id: string) => void
}

export function ModelSelector({ models, value, onChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const selectedModel = models.find(m => m.id === value)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-amber-200 hover:border-amber-400 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
      >
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-slate-800">
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
          <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl border border-amber-100 shadow-lg z-50 py-2">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onChange(model.id)
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full px-4 py-2 text-left hover:bg-amber-50 transition-colors flex items-center justify-between",
                  value === model.id && "bg-amber-50"
                )}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-800">
                    {model.name}
                  </span>
                  <span className="text-xs text-slate-500">{model.badge}</span>
                </div>
                {value === model.id && (
                  <Check className="w-4 h-4 text-amber-600" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}