import * as React from "react"
import { cn } from "@/lib/utils"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClass = {
      sm: "h-4 w-4 border-2",
      md: "h-8 w-8 border-3",
      lg: "h-12 w-12 border-4",
    }[size]

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        {/* Primary spinner with gradient */}
        <div
          className={cn(
            "animate-spin rounded-full",
            "border-solid border-transparent",
            "bg-gradient-to-r from-transparent via-purple-500 to-purple-800 bg-clip-border",
            sizeClass
          )}
          style={{ animationDuration: "0.8s" }}
        />

        {/* Secondary spinner (offset and slower) */}
        <div
          className={cn(
            "absolute inset-0 animate-spin rounded-full",
            "border-solid border-r-purple-300 dark:border-r-purple-700 border-transparent",
            sizeClass
          )}
          style={{
            animationDuration: "1.2s",
            animationDirection: "reverse",
          }}
        />
      </div>
    )
  }
)

Spinner.displayName = "Spinner"
