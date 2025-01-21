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

// import "@xyflow/react/dist/style.css"
import "@xyflow/react/dist/base.css"

import { initialNodes, nodeTypes } from "./nodes"
import { initialEdges, edgeTypes } from "./edges"
// import { AppNode } from "./nodes/types"
import { TaskNode } from "./nodes/TaskNode"
import { useTheme } from "@/hooks/useTheme"
import { Button } from "@/components/ui/button"
import { EyeIcon, MoonIcon, SunIcon } from "lucide-react"
import { TaskStatus } from "@/models/models"

export default function Projects() {
  const { toggleTheme } = useTheme()

  const [nodes, setNodes] = useNodesState(initialNodes)
  const [edges, setEdges] = useEdgesState(initialEdges)

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  )

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // console.log(changes, "onNodesChange")
      setNodes((nds) => applyNodeChanges(changes, nds) as TaskNode[])
    },
    [setNodes]
  )
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      // console.log(changes, "onEdgesChange")
      setEdges((eds) => applyEdgeChanges(changes, eds))
    },
    [setEdges]
  )
  const { theme } = useTheme()

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
        deleteKeyCode={null} // Disable default delete behavior
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
