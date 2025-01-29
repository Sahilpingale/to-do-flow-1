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
import { v4 as uuidv4 } from "uuid"

import { nodeTypes } from "./nodes"
import { edgeTypes } from "./edges"
import { useTheme } from "@/hooks/useTheme"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon } from "lucide-react"
import {
  IProject,
  TaskEdge,
  TaskNode,
  TaskNodeType,
  TaskStatus,
} from "@/models/models"
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

  const [nodes, setNodes] = useNodesState(getProjectById(id)?.nodes || [])
  const [edges, setEdges] = useEdgesState(getProjectById(id)?.edges || [])

  const saveProjectChanges = useCallback(() => {
    if (!id) return

    const localStorageProjects = localStorage.getItem("projects")
    if (!localStorageProjects) return

    const parsedProjects = JSON.parse(localStorageProjects)
    const currentProject = parsedProjects.find((p: IProject) => p.id === id)

    const nodesToAdd: TaskNode[] = nodes.filter(
      (node) => !currentProject.nodes.some((n: TaskNode) => n.id === node.id)
    )

    const nodesToDelete: TaskNode[] = currentProject.nodes.filter(
      (node: TaskNode) => !nodes.some((n) => n.id === node.id)
    )

    const nodesToChange: TaskNode[] = nodes.filter((node) => {
      const existingNode = currentProject.nodes.find(
        (n: TaskNode) => n.id === node.id
      )
      if (!existingNode) return false

      // Check all properties for changes
      const hasDataChanges =
        node.data.title !== existingNode.data.title ||
        node.data.description !== existingNode.data.description ||
        node.data.status !== existingNode.data.status

      const hasPositionChanges =
        node.position.x !== existingNode.position.x ||
        node.position.y !== existingNode.position.y

      const hasTypeChange = node.type !== existingNode.type

      return hasDataChanges || hasPositionChanges || hasTypeChange
    })

    const edgesToAdd: TaskEdge[] = edges.filter(
      (edge) => !currentProject.edges.some((e: TaskEdge) => e.id === edge.id)
    )

    const edgesToDelete: TaskEdge[] = currentProject.edges.filter(
      (edge: TaskEdge) => !edges.some((e) => e.id === edge.id)
    )

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

    console.log("Nodes to Add:", nodesToAdd)
    console.log(
      "Nodes to Delete:",
      nodesToDelete.map((n) => n.id)
    )
    console.log("Nodes to Change:", nodesToChange)
    console.log("Edges to Add:", edgesToAdd)
    console.log(
      "Edges to Delete:",
      edgesToDelete.map((e) => e.id)
    )

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
      setEdges((eds) => applyEdgeChanges(changes, eds) as TaskEdge[])
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
      id: uuidv4(),
      type: TaskNodeType.TASK,
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
