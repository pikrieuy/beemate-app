import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "sec" | "proj" | "person" | "comp" | "team" | "testi" | "stat" }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(30,34,56,0.75)] shadow-sm",
    sec: "rounded-lg border border-border bg-[#141720] shadow-sm p-[18px] mb-[10px] transition-all duration-200 hover:border-[rgba(245,166,35,0.4)] hover:shadow-md hover:-translate-y-[2px]",
    proj: "rounded-[14px] border border-border bg-[#141720] p-[17px] flex flex-col transition-all duration-200 hover:border-[rgba(245,166,35,0.4)] hover:shadow-md hover:-translate-y-[5px] cursor-pointer",
    person: "rounded-[14px] border border-border bg-[#141720] p-[17px_13px] text-center transition-all duration-200 hover:border-[rgba(245,166,35,0.4)] hover:shadow-md hover:-translate-y-[5px] cursor-pointer group",
    comp: "rounded-[14px] border border-border bg-[#141720] p-[16px] flex gap-[14px] items-center transition-all duration-200 hover:border-[rgba(245,166,35,0.4)] hover:shadow-md hover:-translate-y-[5px] cursor-pointer",
    team: "rounded-[14px] border border-border bg-[#141720] p-[17px] transition-all duration-200 hover:border-[rgba(245,166,35,0.4)] hover:shadow-md hover:-translate-y-[5px] cursor-pointer",
    testi: "rounded-[16px] border border-[rgba(255,255,255,0.1)] bg-[rgba(26,30,52,0.85)] p-[20px] transition-all duration-250 hover:border-[rgba(245,166,35,0.22)] hover:shadow-lg hover:-translate-y-[3px]",
    stat: "rounded-[13px] border border-[rgba(255,255,255,0.1)] bg-[rgba(30,34,55,0.9)] p-[13px_16px] flex items-center gap-[13px] transition-all duration-250 hover:border-[rgba(245,166,35,0.3)] hover:shadow-md hover:translate-x-[5px] cursor-default",
  };

  return (
    <div
      ref={ref}
      className={cn(
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
