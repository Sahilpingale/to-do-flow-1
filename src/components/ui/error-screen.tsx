import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface ErrorScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string
}

export const ErrorScreen = React.forwardRef<HTMLDivElement, ErrorScreenProps>(
  ({ className, message = "An error occurred", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex min-h-[50vh] w-full flex-col items-center justify-center gap-4 px-4 text-center",
          className
        )}
        {...props}
      >
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/10 dark:bg-red-900/20 flex items-center justify-center text-red-500 dark:text-red-400">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
            Something went wrong
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm max-w-md">
            {message}
          </p>
        </div>
        <Button onClick={() => (window.location.href = "/home")}>
          Go to Home
        </Button>
      </div>
    )
  }
)

ErrorScreen.displayName = "ErrorScreen"
