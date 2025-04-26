import "@xyflow/react/dist/style.css"
import { Navigate, Route, Routes } from "react-router-dom"
import Projects from "./pages/projects"
import Home from "./pages/home"
import { useAuth } from "./hooks/useAuth"
import { useEffect } from "react"
import { preloadToken } from "./lib/api"
import Playground from "./pages/playground/Playground"

export default function App() {
  const { isLoading, error, isAuthenticated } = useAuth()

  useEffect(() => {
    // Preload token when app starts if user is authenticated
    if (isAuthenticated) {
      preloadToken().catch((err) => {
        console.error("Failed to preload token:", err)
      })
    }
  }, [isAuthenticated])

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>{error}</div>
  }
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/project/:id" element={<Projects />} />
      <Route path="/playground" element={<Playground />} />
    </Routes>
  )
}
