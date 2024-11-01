import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-white text-slate-1000 border-slate-300 border-2 border-b-4 active:border-b-2 hover:border-slate-200 hover:text-slate-900",
        primary:
          "bg-gradient-to-r from-sky-400 to-sky-500 text-primary-foreground hover:from-sky-400 hover:to-sky-500 border-sky-600 border-b-4 active:border-b-0",
        primaryOutline:
          "bg-white text-sky-500 border-2 border-sky-400 active:border-b-4 hover:bg-slate-100",
        secondary:
          "bg-green-500 text-primary-foreground hover:bg-sky-500/900 border-green-600 border-b-4 active:border-b-0",
        secondaryOutline:
          "bg-white text-green-500 border-2 border-green-400 active:border-b-4 hover:bg-slate-100",
        destructive:
          "bg-rose-500 text-primary-foreground hover:bg-rose-500/900 border-rose-600 border-b-4 active:border-b-0",
        destructiveOutline:
          "bg-white text-rose-500 border-2 border-rose-400 active:border-b-4 hover:bg-slate-100",
        premium:
          "bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-amber-900 font-semibold hover:from-amber-400 hover:via-yellow-500 hover:to-amber-600 border-amber-600 border-b-4 active:border-b-0 shadow-inner shadow-white/25",
        premiumOutline:
          "bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-200 text-amber-800 border-2 border-amber-500 active:border-b-4 hover:from-amber-200 hover:via-yellow-200 hover:to-amber-300 shadow-inner shadow-white/50",
        ghost: "bg-transparent text-slate-500 border:transparent border-0",
        // sidebar: "bg-transparent text-slate-500 border-slate-300 border-2 hover:border-slate-200 transition-none",
        // sidebar: "bg-gradient-to-r from-sky-100 via-blue-100 to-sky-200 text-sky-700 border-2 border-sky-300 hover:from-sky-200 hover:via-blue-200 hover:to-sky-300 hover:border-sky-400 transition-all duration-300 shadow-inner shadow-white/50",
        sidebar: "bg-gradient-to-r from-sky-100 via-blue-100 to-sky-200 text-sky-700 border-2 border-sky-300 hover:from-sky-200 hover:via-blue-200 hover:to-sky-300 hover:border-sky-400 transition-all duration-300 shadow-inner shadow-white/50 relative overflow-hidden group [&>*]:relative [&>*]:z-10 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-b before:from-white/30 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        sidebarOutline: "bg-transparent text-slate-500 border-2 border-transparent active:border-b-4 hover:bg-sky-100 transition-none relative overflow-hidden group",
        link: "text-sky-500 underline-offset-4 hover:underline",
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
