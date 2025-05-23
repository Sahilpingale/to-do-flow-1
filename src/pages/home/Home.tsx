import { IconMoon, IconSun } from "@tabler/icons-react"
import { useTheme } from "@/hooks/useTheme"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { Hero } from "./components/Hero"
import { ProjectGrid } from "./components/ProjectGrid"

const Home = () => {
  const { toggleTheme } = useTheme()
  const { isAuthenticated, signInWithGoogle, signOut, user } = useAuth()

  const currentHour = new Date().getHours()
  let greeting
  if (currentHour < 12) {
    greeting = "Good morning"
  } else if (currentHour < 18) {
    greeting = "Good afternoon"
  } else {
    greeting = "Good evening"
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

      {!isAuthenticated ? (
        <Hero />
      ) : (
        <div>
          <div className="mt-16 px-4 md:px-8 lg:px-16">
            <h1 className="text-2xl md:text-3xl font-semibold mb-2">
              <span className="bg-gradient-to-r from-purple-500 to-purple-800 bg-clip-text text-transparent">
                {greeting}
              </span>
              {user?.displayName ? `, ${user.displayName}` : ""}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Welcome to your personalized task management dashboard.
            </p>
          </div>
          <ProjectGrid />
        </div>
      )}
    </div>
  )
}

export default Home
