import React, { useCallback, useEffect, useRef, useState } from "react"
import { IconCheck, IconX } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface TextInputWithAcceptRejectProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string
  initialValue: string
  onChange: (value: string) => void
  description?: string
  error?: string | boolean
  placeholder?: string
  asterisk?: boolean
  disabled?: boolean
  leftSection?: React.ReactNode
  rightSection?: React.ReactNode
  onAccept?: (value: string) => void
  onCancel?: () => void
}

export const TextInputWithAcceptReject = React.forwardRef<
  HTMLInputElement,
  TextInputWithAcceptRejectProps
>(
  (
    {
      value,
      initialValue,
      onChange,
      description,
      error,
      placeholder,
      asterisk,
      disabled = false,
      leftSection,
      rightSection,
      onAccept,
      onCancel,
      className,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState(value)
    const [isFocused, setIsFocused] = useState(false)
    const textInputRef = useRef<HTMLDivElement>(null)

    // Update internal state when external value changes
    useEffect(() => {
      setInputValue(value)
    }, [value])

    const handleAccept = useCallback(() => {
      setIsFocused(false)
      onChange(inputValue)
      onAccept?.(inputValue)
    }, [inputValue, onChange, onAccept])

    const handleReject = useCallback(() => {
      setInputValue(initialValue)
      setIsFocused(false)
      onCancel?.()
    }, [initialValue, onCancel])

    // Handle click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          textInputRef.current &&
          !textInputRef.current.contains(event.target as Node) &&
          isFocused
        ) {
          handleAccept()
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [handleAccept, isFocused])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleAccept()
      } else if (e.key === "Escape") {
        handleReject()
      }
    }

    return (
      <div className="flex flex-col w-full gap-1" ref={textInputRef}>
        {/* Label and description */}
        {props.id && props.name && (
          <label
            htmlFor={props.id}
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            {props.name}
            {asterisk && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {description && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {description}
          </p>
        )}

        {/* Input container */}
        <div
          className={cn(
            "flex items-center w-full rounded-md transition-all",
            isFocused && !error
              ? "border border-neutral-300 dark:border-neutral-700"
              : "border border-transparent",
            error ? "border border-red-500 dark:border-red-500" : "",
            disabled
              ? "bg-neutral-100 dark:bg-neutral-800 opacity-60"
              : "hover:border-neutral-300 dark:hover:border-neutral-700",
            className
          )}
        >
          {/* Left section */}
          {leftSection && (
            <div className="flex items-center pl-3">{leftSection}</div>
          )}

          {/* Input */}
          <input
            ref={ref}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            className={cn(
              "w-full py-2 px- bg-transparent outline-none text-neutral-900 dark:text-neutral-100",
              "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
              leftSection && "pl-2",
              rightSection && "pr-2"
            )}
            {...props}
          />

          {/* Button container with fixed width to prevent layout shifts */}
          <div className="w-[70px] flex justify-end">
            {isFocused && !disabled && (
              <div className="flex gap-1 mr-2">
                <button
                  type="button"
                  onClick={handleAccept}
                  className="p-1 rounded-md bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-800/50 transition-colors"
                  aria-label="Accept changes"
                >
                  <IconCheck className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  className="p-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/50 transition-colors"
                  aria-label="Reject changes"
                >
                  <IconX className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          {/* Right section */}
          {rightSection && (
            <div className="flex items-center pr-3">{rightSection}</div>
          )}
        </div>

        {/* Accept/Reject buttons - now positioned absolutely */}

        {/* Error message */}
        {error && typeof error === "string" && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    )
  }
)

TextInputWithAcceptReject.displayName = "TextInputWithAcceptReject"
