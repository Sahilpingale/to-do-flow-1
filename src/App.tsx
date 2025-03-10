import "@xyflow/react/dist/style.css"
import { Navigate, Route, Routes } from "react-router-dom"
import Projects from "./pages/projects"
import Home from "./pages/home"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/project/:id" element={<Projects />} />
    </Routes>
  )
}
