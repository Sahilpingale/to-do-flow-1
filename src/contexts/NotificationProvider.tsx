import { createContext, useCallback, useReducer, ReactNode } from "react"
import { v4 as uuidv4 } from "uuid"
import { NotificationToast } from "@/components/ui/notification-toast"

export type NotificationType = "success" | "error" | "info"

export interface Notification {
  id: string
  type: NotificationType
  message: string
  duration?: number
  createdAt: number
}

// Actions for the reducer
type NotificationAction =
  | {
      type: "ADD_NOTIFICATION"
      payload: Omit<Notification, "id" | "createdAt">
    }
  | { type: "REMOVE_NOTIFICATION"; payload: { id: string } }

// Context type
interface NotificationContextType {
  notifications: Notification[]
  addSuccessNotification: (message: string, duration?: number) => void
  addErrorNotification: (message: string, duration?: number) => void
  addInfoNotification: (message: string, duration?: number) => void
}

// Create context with default values
export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addSuccessNotification: () => {},
  addErrorNotification: () => {},
  addInfoNotification: () => {},
})

// Reducer function to manage notifications
const notificationReducer = (
  state: Notification[],
  action: NotificationAction
): Notification[] => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return [
        ...state,
        {
          ...action.payload,
          id: uuidv4(),
          createdAt: Date.now(),
        },
      ]
    case "REMOVE_NOTIFICATION":
      return state.filter(
        (notification) => notification.id !== action.payload.id
      )
    default:
      return state
  }
}

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const [notifications, dispatch] = useReducer(notificationReducer, [])

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "createdAt">) => {
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: notification,
      })
    },
    []
  )

  const removeNotification = useCallback((id: string) => {
    dispatch({
      type: "REMOVE_NOTIFICATION",
      payload: { id },
    })
  }, [])

  const addSuccessNotification = useCallback(
    (message: string, duration?: number) => {
      addNotification({
        type: "success",
        message,
        duration,
      })
    },
    [addNotification]
  )

  const addErrorNotification = useCallback(
    (message: string, duration?: number) => {
      addNotification({
        type: "error",
        message,
        duration,
      })
    },
    [addNotification]
  )

  const addInfoNotification = useCallback(
    (message: string, duration?: number) => {
      addNotification({
        type: "info",
        message,
        duration,
      })
    },
    [addNotification]
  )

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addSuccessNotification,
        addErrorNotification,
        addInfoNotification,
      }}
    >
      {children}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-4 max-w-md w-full pointer-events-none">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onDismiss={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}
