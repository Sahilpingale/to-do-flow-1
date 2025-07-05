import {
  AuthenticationToDoFlow,
  Configuration,
  ProjectsToDoFlow,
} from "../../api"
import axios, { InternalAxiosRequestConfig } from "axios"
import { auth } from "@/config/firebase"
import { CURRENT_USER_DATA } from "@/contexts/AuthContext"

// Create axios instance with interceptors
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Extend Axios request config interface to include _retry property
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

// Function to subscribe to token refresh
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback)
}

// Function to notify subscribers about new token
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

// Function to get the access token from localStorage
const getAccessTokenFromStorage = (): string | null => {
  try {
    const currentUser = localStorage.getItem(CURRENT_USER_DATA)
    if (currentUser) {
      const userData = JSON.parse(currentUser)
      return userData.accessToken || null
    }
  } catch (error) {
    console.error("Error retrieving access token:", error)
  }
  return null
}

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  async (config: ExtendedAxiosRequestConfig) => {
    try {
      // Get access token directly from localStorage
      const accessToken = getAccessTokenFromStorage()

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`

        // Mark this request as not a retry to allow token refresh if needed
        if (!config._retry) {
          config._retry = false
        }
      } else {
        // If no access token in localStorage but user is logged in Firebase, try to get one
        const currentUser = auth.currentUser
        if (currentUser) {
          try {
            const firebaseToken = await currentUser.getIdToken(false)
            config.headers.Authorization = `Bearer ${firebaseToken}`
          } catch (tokenError) {
            console.error("Error getting Firebase token:", tokenError)
          }
        }
      }
    } catch (error) {
      console.error("Error setting auth header:", error)
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig

    // If error is 401 (Unauthorized) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If we're already refreshing, wait for the new token
      if (isRefreshing) {
        try {
          // Return a new promise that resolves when the token is refreshed
          return new Promise((resolve) => {
            subscribeTokenRefresh((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(axiosInstance(originalRequest))
            })
          })
        } catch (subError) {
          console.error("❌ Error in refresh subscription:", subError)
          return Promise.reject(subError)
        }
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Call the refresh token endpoint - the HTTP-only cookie will be sent automatically
        const refreshResponse = await authClient.authRefreshTokenPost()

        // Get the new access token from the response and ensure it's not undefined
        const newToken = refreshResponse.data.accessToken

        if (!newToken) {
          console.error("❌ Refresh response missing access token")
          throw new Error(
            "Refresh token response did not include an access token"
          )
        }

        // Update token in localStorage
        try {
          const currentUserData = localStorage.getItem("current_user_data")
          if (currentUserData) {
            const userData = JSON.parse(currentUserData)
            userData.accessToken = newToken
            // If the response includes a new refresh token, update it too
            if (refreshResponse.data.refreshToken) {
              userData.refreshToken = refreshResponse.data.refreshToken
            }
            localStorage.setItem(CURRENT_USER_DATA, JSON.stringify(userData))
          }
        } catch (storageError) {
          console.error(
            "❌ Error updating token in localStorage:",
            storageError
          )
        }

        // Notify all subscribers about the new token
        onTokenRefreshed(newToken)
        isRefreshing = false

        // Update header and retry request
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError)
        // Clear token cache on refresh failure
        isRefreshing = false

        // You might want to trigger a sign-out or redirect to login here
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

const configuration = new Configuration({
  basePath: import.meta.env.VITE_API_URL,
})

export const todoFlowClient = new ProjectsToDoFlow(
  configuration,
  undefined,
  axiosInstance
)

export const authClient = new AuthenticationToDoFlow(
  configuration,
  undefined,
  axiosInstance
)

// FOR TESTING ONLY: Simulates token expiration to test refresh flow
export const simulateTokenExpiration = async (): Promise<boolean> => {
  try {
    // Get current user data
    const currentUserData = localStorage.getItem("current_user_data")
    if (!currentUserData) {
      console.error("No user data found in localStorage")
      return false
    }

    const userData = JSON.parse(currentUserData)

    // Modify the token to make it invalid (by changing a few characters)
    if (userData.accessToken) {
      // This will make the token invalid but keep its general structure
      userData.accessToken = userData.accessToken
        .replace(/a/g, "x")
        .replace(/e/g, "y")

      // Save back to localStorage
      localStorage.setItem(CURRENT_USER_DATA, JSON.stringify(userData))
      return true
    }

    return false
  } catch (error) {
    console.error("Error simulating token expiration:", error)
    return false
  }
}
