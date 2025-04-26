import * as React from "react"
import { Spinner } from "./spinner"
import { cn } from "@/lib/utils"

interface LoadingScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string
  size?: "sm" | "md" | "lg"
}

export const LoadingScreen = React.forwardRef<
  HTMLDivElement,
  LoadingScreenProps
>(({ className, message = "Loading...", size = "md", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex min-h-[50vh] w-full flex-col items-center justify-center gap-4",
        className
      )}
      {...props}
    >
      <Spinner size={size} />
      {message && (
        <p className="text-neutral-600 dark:text-neutral-400 text-sm animate-pulse">
          {message}
        </p>
      )}
    </div>
  )
})

LoadingScreen.displayName = "LoadingScreen"
