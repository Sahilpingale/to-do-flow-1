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
} from "@xyflow/react"

// import "@xyflow/react/dist/style.css"
import "@xyflow/react/dist/base.css"

import { initialNodes, nodeTypes } from "./nodes"
import { initialEdges, edgeTypes } from "./edges"
import { useTheme } from "@/contexts/ThemeProvider"
import { AppNode } from "./nodes/types"

export default function Projects() {
  const [nodes, setNodes] = useNodesState(initialNodes)
  const [edges, setEdges] = useEdgesState(initialEdges)
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  )

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // console.log(changes, "onNodesChange")
      setNodes((nds) => applyNodeChanges(changes, nds) as AppNode[])
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
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  )
}
