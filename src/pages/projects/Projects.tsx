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
} from "@xyflow/react"

// import "@xyflow/react/dist/style.css"
import "@xyflow/react/dist/base.css"

import { initialNodes, nodeTypes } from "./nodes"
import { initialEdges, edgeTypes } from "./edges"
import { useTheme } from "@/contexts/ThemeProvider"

export default function Projects() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  )
  const { theme } = useTheme() // Add this line

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
