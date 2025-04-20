import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Notification } from "@/contexts/NotificationProvider"

interface NotificationToastProps {
  notification: Notification
  onDismiss: () => void
}

export const NotificationToast = ({
  notification,
  onDismiss,
}: NotificationToastProps) => {
  const [progress, setProgress] = useState(100)
  const [visible, setVisible] = useState(true)
  // Default duration is 3 seconds
  const duration = notification.duration || 3000

  useEffect(() => {
    // Use the createdAt timestamp to determine how much time has passed
    // since the notification was created, ensuring proper timing across page navigations

    // Calculate the initial progress based on elapsed time
    const initialElapsed = Date.now() - notification.createdAt
    const initialRemaining = Math.max(0, duration - initialElapsed)
    const initialProgress = (initialRemaining / duration) * 100

    // If the notification should already be expired, dismiss it consistently
    if (initialProgress <= 0) {
      setProgress(0)
      // Add delay to ensure progress bar is visible at zero
      setTimeout(() => {
        setVisible(false)
        setTimeout(() => {
          onDismiss()
        }, 300) // Wait for fade out animation
      }, 200)
      return // Skip setting up interval if already expired
    }

    // Set initial progress
    setProgress(initialProgress)

    const timer = setInterval(() => {
      const now = Date.now()
      const elapsed = now - notification.createdAt
      const remaining = Math.max(0, duration - elapsed)
      const calculatedProgress = Math.max(0, (remaining / duration) * 100)

      setProgress(calculatedProgress)

      // Only dismiss when progress is actually 0
      if (calculatedProgress <= 0) {
        // First ensure progress is set to exactly 0
        setProgress(0)
        clearInterval(timer)

        // Add a longer delay to ensure progress bar visibly reaches zero
        setTimeout(() => {
          setVisible(false)
          setTimeout(() => {
            onDismiss()
          }, 300) // Wait for fade out animation
        }, 200) // Increased delay to ensure progress bar is seen at zero
      }
    }, 10)

    return () => {
      clearInterval(timer)
    }
  }, [duration, notification.createdAt, onDismiss])

  // Type-specific styling
  const getTypeStyles = () => {
    switch (notification.type) {
      case "success":
        return "bg-green-100/80 dark:bg-green-900/80 border-green-500 text-green-900 dark:text-green-100"
      case "error":
        return "bg-red-100/80 dark:bg-red-900/80 border-red-500 text-red-900 dark:text-red-100"
      case "info":
        return "bg-blue-100/80 dark:bg-blue-900/80 border-blue-500 text-blue-900 dark:text-blue-100"
      default:
        return "bg-neutral-100/80 dark:bg-neutral-900/80 border-neutral-500 text-neutral-900 dark:text-neutral-100"
    }
  }

  // Get icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return (
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 3L4.5 8.5L2 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )
      case "error":
        return (
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 3L3 9M3 3L9 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )
      case "info":
        return (
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 4V8M6 2.5V2.51"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        "relative pointer-events-auto overflow-hidden rounded-md border p-4 shadow-md transition-all backdrop-blur-sm",
        "ring-1 ring-black/5 dark:ring-white/10",
        getTypeStyles(),
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {getIcon()}

        <div className="flex-1 mr-2">
          <p className="text-sm font-medium">{notification.message}</p>
        </div>

        <button
          onClick={() => {
            setVisible(false)
            setTimeout(() => {
              onDismiss()
            }, 300)
          }}
          className="flex-shrink-0 rounded-full h-5 w-5 inline-flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
          aria-label="Close notification"
        >
          <X className="h-3 w-3" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-neutral-200/50 dark:bg-neutral-700/50 w-full">
        <div
          className={cn(
            "h-full transition-all",
            notification.type === "success" && "bg-green-500",
            notification.type === "error" && "bg-red-500",
            notification.type === "info" && "bg-blue-500"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
