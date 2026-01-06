import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-theme-purple text-white hover:bg-[#6b347e]",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
        outline: "border-2 border-theme-purple/50 bg-transparent hover:bg-theme-purple/10",
        ghost: "hover:bg-theme-purple/10 text-theme-pinkLight",
        /* ==================== 神秘风格变体 ==================== */
        mystical: `
          bg-gradient-to-r from-theme-purple to-theme-pink
          text-white shadow-lg shadow-theme-purple/25
          hover:shadow-xl hover:shadow-theme-purple/40
          hover:scale-[1.02] active:scale-[0.98]
          border-0
        `,
        "ghost-mystical": `
          border border-theme-purple/30
          text-theme-pinkLight hover:bg-theme-purple/10
          hover:border-theme-purple/60 hover:bg-theme-purple/20
          bg-transparent
        `,
        "glass-mystical": `
          bg-[#2d2a3d]/80 border border-white/10
          text-slate-200 hover:bg-[#3d3a4d]/80
          hover:border-theme-purple/50
          backdrop-blur-sm
        `,
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }