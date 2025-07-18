import * as React from "react"

import { cn } from "@/lib/utils"

interface TextareaProps extends React.ComponentProps<"textarea"> {
  autosize?: boolean
  minRows?: number
  maxRows?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autosize = false, minRows = 1, maxRows, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    const initialHeightRef = React.useRef<number | null>(null)

    // Combine refs
    React.useImperativeHandle(ref, () => textareaRef.current!, [])

    const calculateHeight = React.useCallback(() => {
      const textarea = textareaRef.current
      if (!textarea || !autosize) return

      const computedStyles = window.getComputedStyle(textarea)
      const lineHeight = parseInt(computedStyles.lineHeight, 10) || 20

      // Store initial height on first calculation
      if (initialHeightRef.current === null) {
        initialHeightRef.current = parseInt(computedStyles.height, 10)
      }

      // Calculate minimum height based on initial CSS height or minRows
      const minHeightFromRows = (minRows || 1) * lineHeight
      const minHeight = Math.max(
        initialHeightRef.current || 0,
        minHeightFromRows
      )

      // Create a temporary element to measure text height
      const tempDiv = document.createElement("div")

      // Copy relevant styles to temp div
      tempDiv.style.position = "absolute"
      tempDiv.style.visibility = "hidden"
      tempDiv.style.height = "auto"
      tempDiv.style.width = textarea.clientWidth + "px"
      tempDiv.style.fontSize = computedStyles.fontSize
      tempDiv.style.fontFamily = computedStyles.fontFamily
      tempDiv.style.fontWeight = computedStyles.fontWeight
      tempDiv.style.lineHeight = computedStyles.lineHeight
      tempDiv.style.letterSpacing = computedStyles.letterSpacing
      tempDiv.style.padding = computedStyles.padding
      tempDiv.style.border = computedStyles.border
      tempDiv.style.boxSizing = computedStyles.boxSizing
      tempDiv.style.whiteSpace = "pre-wrap"
      tempDiv.style.wordWrap = "break-word"

      // Set content
      tempDiv.textContent = textarea.value || textarea.placeholder || ""

      // Add to DOM temporarily
      document.body.appendChild(tempDiv)

      const scrollHeight = tempDiv.scrollHeight

      // Clean up
      document.body.removeChild(tempDiv)

      // Use the larger of content height or minimum height
      let finalHeight = Math.max(scrollHeight, minHeight)

      // Apply max constraint
      if (maxRows) {
        const maxHeight = maxRows * lineHeight
        finalHeight = Math.min(finalHeight, maxHeight)
      }

      textarea.style.height = `${finalHeight}px`
    }, [autosize, minRows, maxRows])

    // Calculate height on content change
    React.useLayoutEffect(() => {
      if (autosize) {
        calculateHeight()
      }
    }, [props.value, calculateHeight, autosize])

    // Set initial height
    React.useEffect(() => {
      if (autosize && textareaRef.current) {
        calculateHeight()
      }
    }, [autosize, calculateHeight])

    return (
      <textarea
        className={cn(
          "flex w-full rounded-md border border-input px-3 py-2 text-sm",
          "shadow-sm transition-colors placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50 resize-none",
          autosize ? "overflow-hidden" : "min-h-[60px]",
          className
        )}
        ref={textareaRef}
        rows={autosize ? undefined : props.rows}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
