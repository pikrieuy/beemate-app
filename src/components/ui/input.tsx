import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-[9px] border border-border bg-[#1e2236] px-[12px] py-[9px] text-[12px] font-medium text-[#f2f4fc] outline-none transition-all duration-150 placeholder:text-[#3a4060] focus:border-[#f5a623] focus:bg-[#232840] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
