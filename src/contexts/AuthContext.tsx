import React, { createContext, useState, useEffect } from "react"
import Cookies from "js-cookie"
import { User } from "firebase/auth"
import { auth, signInWithGoogle } from "@/config/firebase"

// Cookie configuration
const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  expires: 7, // 7 days
}

// Token storage keys
const ACCESS_TOKEN_KEY = "auth_access_token"
const REFRESH_TOKEN_KEY = "auth_refresh_token"
const USER_KEY = "auth_user"

interface AuthContextType {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY)
    const storedToken = Cookies.get(ACCESS_TOKEN_KEY)

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setAccessToken(storedToken)
    }

    // Set up Firebase auth state listener
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const token = await firebaseUser.getIdToken()
        const refreshToken = firebaseUser.refreshToken

        // Store tokens and user
        setUser(firebaseUser)
        setAccessToken(token)
        storeAuthData(firebaseUser, token, refreshToken)
      } else {
        // User is signed out
        clearAuthData()
        setUser(null)
        setAccessToken(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Store auth data in localStorage and cookies
  const storeAuthData = (user: User, token: string, refreshToken: string) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    Cookies.set(ACCESS_TOKEN_KEY, token, COOKIE_OPTIONS)
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, COOKIE_OPTIONS)
  }

  // Clear auth data from localStorage and cookies
  const clearAuthData = () => {
    localStorage.removeItem(USER_KEY)
    Cookies.remove(ACCESS_TOKEN_KEY)
    Cookies.remove(REFRESH_TOKEN_KEY)
  }

  // Enhanced sign in with Google
  const handleSignInWithGoogle = async () => {
    try {
      const result = await signInWithGoogle()
      const token = await result.user.getIdToken()
      const refreshToken = result.user.refreshToken

      setUser(result.user)
      setAccessToken(token)
      storeAuthData(result.user, token, refreshToken)
    } catch (error) {
      console.error("Google sign in failed:", error)
      throw error
    }
  }

  // Sign out
  const handleSignOut = async () => {
    try {
      await auth.signOut()
      clearAuthData()
      setUser(null)
      setAccessToken(null)
    } catch (error) {
      console.error("Sign out failed:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user,
        isLoading,
        signInWithGoogle: handleSignInWithGoogle,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
