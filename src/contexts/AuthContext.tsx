import React, { createContext, useState, useEffect } from "react"
import { User } from "firebase/auth"
import { auth, signInWithGoogle } from "@/config/firebase"
import { authClient } from "@/lib/api"

export const CURRENT_USER_DATA = "current_user_data"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  error: string | null
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  error: null,
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          await storeFirebaseUserDataToLocalStorage(firebaseUser)
        } else {
          await handleSignOut()
        }
      } catch (error) {
        console.error("Auth state change error:", error)
        setError("Authentication error")
        await handleSignOut()
      } finally {
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const storeFirebaseUserDataToLocalStorage = async (user: User) => {
    setIsLoading(true)
    try {
      const response = await authClient.authLoginPost({
        uid: user.uid,
        email: user.email ?? "",
        displayName: user.displayName ?? "",
        photoURL: user.photoURL ?? undefined,
        accessToken: await user.getIdToken(),
        refreshToken: user.refreshToken,
      })
      localStorage.setItem(CURRENT_USER_DATA, JSON.stringify(response.data))
      setUser(user)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignInWithGoogle = async () => {
    setIsLoading(true)
    try {
      const result = await signInWithGoogle()
      await storeFirebaseUserDataToLocalStorage(result.user)
    } catch (error) {
      console.error("Google sign in failed:", error)
      setIsLoading(false)
      setError("Authentication error: Google sign in failed")
    }
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await auth.signOut()
      await authClient.authLogoutPost()
      localStorage.removeItem(CURRENT_USER_DATA)
      setUser(null)
    } catch (error) {
      console.error("Sign out failed:", error)
      setError("Authentication error: Sign out failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signInWithGoogle: handleSignInWithGoogle,
        signOut: handleSignOut,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
