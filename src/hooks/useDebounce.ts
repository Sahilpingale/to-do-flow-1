import { useEffect, useRef } from "react"

export function useDebounce<T>(
  value: T,
  callback: (value: T) => void,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      callback(value)
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, callback, delay])
}
