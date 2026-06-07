import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-[8px] py-[3px] text-[10px] font-bold tracking-[0.4px] uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-mono gap-[3px]",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        honey: "border-transparent bg-[rgba(245,166,35,0.12)] text-[#f5a623]",
        blue: "border-transparent bg-[rgba(91,156,246,0.12)] text-[#5b9cf6]",
        green: "border-transparent bg-[rgba(45,214,122,0.12)] text-[#2dd67a]",
        red: "border-transparent bg-[rgba(249,107,107,0.12)] text-[#f96b6b]",
        purple: "border-transparent bg-[rgba(167,139,250,0.12)] text-[#a78bfa]",
        orange: "border-transparent bg-[rgba(251,146,60,0.12)] text-[#fb923c]",
        chip: "bg-[#1e2236] text-[#a8b0d0] border-[#2e3450] hover:border-[#3a4060] hover:text-[#f2f4fc] capitalize tracking-normal cursor-pointer select-none px-[9px] py-[4px] text-[11px] font-semibold",
        "chip-on": "bg-[rgba(245,166,35,0.12)] text-[#f5a623] border-[rgba(245,166,35,0.3)] capitalize tracking-normal cursor-pointer select-none px-[9px] py-[4px] text-[11px] font-semibold",
        statusOpen: "border-transparent bg-[rgba(45,214,122,0.12)] text-[#2dd67a] before:content-[''] before:w-[5px] before:h-[5px] before:rounded-full before:bg-[#2dd67a] before:shrink-0 px-[9px] capitalize tracking-normal",
        statusBusy: "border-transparent bg-[rgba(249,107,107,0.12)] text-[#f96b6b] before:content-[''] before:w-[5px] before:h-[5px] before:rounded-full before:bg-[#f96b6b] before:shrink-0 px-[9px] capitalize tracking-normal",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
