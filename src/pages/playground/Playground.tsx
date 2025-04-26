import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { simulateTokenExpiration } from "@/lib/api"

const Playground = () => {
  const { isAuthenticated } = useAuth()

  // Handler for testing token refresh
  const handleTestTokenRefresh = async () => {
    if (!isAuthenticated) {
      alert("Please sign in first to test token refresh.")
      return
    }
    const result = await simulateTokenExpiration()
    if (result) {
      alert(
        "Token invalidated. Make another authenticated API request (e.g., fetch projects) to test the refresh flow."
      )
    } else {
      alert("Failed to invalidate token. Check console for errors.")
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Developer Playground</h1>
      <p className="mb-4">
        This page contains tools for testing during development.
      </p>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Authentication</h2>
        <Button
          variant="outline"
          onClick={handleTestTokenRefresh}
          className="text-xs bg-yellow-100 text-yellow-900 border-yellow-300 hover:bg-yellow-200"
          disabled={!isAuthenticated} // Disable if not logged in
        >
          Test Token Refresh
        </Button>
        {!isAuthenticated && (
          <p className="text-sm text-muted-foreground">
            Sign in to enable token testing.
          </p>
        )}
      </div>
      {/* Add other development/testing tools here */}
    </div>
  )
}

export default Playground
