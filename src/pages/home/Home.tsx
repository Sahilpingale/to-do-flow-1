import { IconMoon, IconSun } from "@tabler/icons-react"
import { useTheme } from "@/hooks/useTheme"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { Hero } from "./components/Hero"
import { ProjectGrid } from "./components/ProjectGrid"
import { simulateTokenExpiration } from "@/lib/api"

const Home = () => {
  const { toggleTheme } = useTheme()
  const { isAuthenticated, signInWithGoogle, signOut, user } = useAuth()

  // Handler for testing token refresh
  const handleTestTokenRefresh = async () => {
    const result = await simulateTokenExpiration()
    if (result) {
      alert("Token invalidated. Make an API request to test refresh flow.")
    } else {
      alert("Failed to invalidate token. Make sure you're logged in.")
    }
  }

  return (
    <div className="h-screen w-full dark:bg-black bg-white text-black dark:text-white">
      <div className="flex px-8 py-4 justify-between">
        <h1 className="bg-gradient-to-r from-purple-500 to-purple-800 bg-clip-text text-transparent font-bold text-2xl">
          To Do Flow
        </h1>

        <div className="flex gap-2 items-center">
          {isAuthenticated ? (
            <>
              <span className="text-sm">{user?.email}</span>
              <span className="text-sm">{user?.uid}</span>

              {/* Test button - only visible in development */}
              {import.meta.env.DEV && (
                <Button
                  variant="outline"
                  onClick={handleTestTokenRefresh}
                  className="text-xs bg-yellow-100 text-yellow-900 border-yellow-300 hover:bg-yellow-200"
                >
                  Test Token Refresh
                </Button>
              )}

              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={signInWithGoogle}>
              Sign In
            </Button>
          )}
          <button
            onClick={toggleTheme}
            className="inline-flex items-center justify-center rounded-md w-9 h-9 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <IconSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <IconMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </button>
        </div>
      </div>

      <Hero />
      {isAuthenticated && <ProjectGrid />}
    </div>
  )
}

export default Home
