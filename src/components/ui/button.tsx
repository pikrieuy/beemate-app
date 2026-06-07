import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        honey: "bg-gradient-to-br from-[#f5a623] to-[#ffbe4d] text-[#1a0f00] shadow-[0_2px_12px_rgba(245,166,35,0.2)] hover:brightness-105 hover:shadow-[0_6px_22px_rgba(245,166,35,0.35)] hover:-translate-y-[1px]",
        dark: "bg-[#252b40] text-[#f2f4fc] border border-[#2e3450] hover:bg-[#2c3248] hover:border-[#3a4060]",
        ok: "bg-[rgba(45,214,122,0.12)] text-[#2dd67a] border border-[rgba(45,214,122,0.3)] hover:bg-[rgba(34,209,122,0.18)]",
        no: "bg-[rgba(249,107,107,0.12)] text-[#f96b6b] border border-[rgba(249,107,107,0.3)] hover:bg-[rgba(249,107,107,0.18)]",
      },
      size: {
        default: "h-10 px-[18px] py-[8px] text-[13px] rounded-full",
        sm: "px-[13px] py-[6px] text-[12px] rounded-full",
        lg: "px-[22px] py-[10px] text-[14px] rounded-full",
        icon: "h-10 w-10 rounded-full",
        xs: "px-[10px] py-[4px] text-[11px] rounded-full",
        xl: "px-[26px] py-[13px] text-[15px] rounded-full",
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
