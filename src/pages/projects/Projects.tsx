import { useCallback } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  EdgeChange,
  NodeChange,
  Panel,
  ControlButton,
} from "@xyflow/react"
import "@xyflow/react/dist/base.css"

import { nodeTypes } from "./nodes"
import { edgeTypes } from "./edges"
import { TaskNode } from "./nodes/TaskNode"
import { useTheme } from "@/hooks/useTheme"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon } from "lucide-react"
import { IProject, TaskStatus } from "@/models/models"
import { useParams } from "react-router-dom"
import { useDebounce } from "@/hooks/useDebounce"

const getProjectById = (id?: string): IProject | undefined => {
  if (!id) return undefined
  const localStorageProjects = localStorage.getItem("projects")
  if (!localStorageProjects) return undefined

  const parsedProjects = JSON.parse(localStorageProjects)
  const project = parsedProjects.find((project: IProject) => project.id === id)

  if (project) {
    return {
      ...project,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
    }
  }
  return undefined
}

export default function Projects() {
  const { id } = useParams()
  const { toggleTheme, theme } = useTheme()

  // const [project, setProject] = useState<IProject | undefined>(
  //   getProjectById(id)
  // )

  // Initialize nodes and edges from project or use defaults
  const [nodes, setNodes] = useNodesState(getProjectById(id)?.nodes || [])
  const [edges, setEdges] = useEdgesState(getProjectById(id)?.edges || [])

  // Function to save project changes
  const saveProjectChanges = useCallback(() => {
    if (!id) return

    const localStorageProjects = localStorage.getItem("projects")
    if (!localStorageProjects) return

    const parsedProjects = JSON.parse(localStorageProjects)
    const updatedProjects = parsedProjects.map((p: IProject) => {
      if (p.id === id) {
        return {
          ...p,
          nodes,
          edges,
          updatedAt: new Date(),
        }
      }
      return p
    })

    localStorage.setItem("projects", JSON.stringify(updatedProjects))
  }, [id, nodes, edges])

  // Use debounce hook for saving changes
  useDebounce(
    { nodes, edges },
    () => saveProjectChanges(),
    1000 // 1 second delay
  )

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds) as TaskNode[])
    },
    [setNodes]
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds))
    },
    [setEdges]
  )

  const onConnect: OnConnect = useCallback(
    (connection) => {
      setEdges((edges) => addEdge(connection, edges))
    },
    [setEdges]
  )

  // Add new function to handle node creation
  const handleAddNode = () => {
    const newNode: TaskNode = {
      id: `task-${nodes.length + 1}`,
      type: "task",
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        title: "",
        description: "",
        status: TaskStatus.TODO,
      },
    }
    setNodes((nds) => [...nds, newNode])
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        colorMode={theme === "dark" ? "dark" : "light"}
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        edges={edges}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <MiniMap position="bottom-left" />
        <Controls position="top-right">
          <ControlButton onClick={toggleTheme}>
            {/* if theme is dark, show sun icon, otherwise show moon icon */}
            {theme === "dark" ? <MoonIcon /> : <SunIcon />}
          </ControlButton>
        </Controls>

        {/* Use Panel component instead of div for floating elements */}
        <Panel position="bottom-right" className="p-4">
          <Button size="lg" variant="outline" onClick={handleAddNode}>
            Add Task
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  )
}
