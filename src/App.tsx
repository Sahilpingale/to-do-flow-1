import "@xyflow/react/dist/style.css"
import { Navigate, Route, Routes } from "react-router-dom"
import Projects from "./pages/projects"
import Home from "./pages/home"
import { useAuth } from "./hooks/useAuth"
import Playground from "./pages/playground/Playground"
import { LoadingScreen } from "./components/ui/loading-screen"
import { ErrorScreen } from "./components/ui/error-screen"

export default function App() {
  const { isLoading, error } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (error) {
    return <ErrorScreen message={error} />
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
