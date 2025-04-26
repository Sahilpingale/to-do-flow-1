import { useCallback, useEffect, useState } from "react"
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
  Project,
  TaskEdge,
  TaskNode,
  NodeType,
  TaskStatus,
  UpdateProjectRequest,
} from "api/api"
import { useParams } from "react-router-dom"
import { useDebounce } from "@/hooks/useDebounce"
import { FlowTaskNode, FlowTaskEdge } from "@/types/flow"
import { todoFlowClient } from "@/lib/api"

export default function Projects() {
  const { id } = useParams()
  const { toggleTheme, theme } = useTheme()
  const [project, setProject] = useState<Project>()

  const [nodes, setNodes] = useNodesState<FlowTaskNode>(
    (project?.nodes as FlowTaskNode[]) || []
  )
  const [edges, setEdges] = useEdgesState<FlowTaskEdge>(
    (project?.edges as FlowTaskEdge[]) || []
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true)
      try {
        const response = await todoFlowClient.projectsIdGet(id!)
        setProject(response.data)
        setNodes((response.data.nodes as FlowTaskNode[]) || [])
        setEdges((response.data.edges as FlowTaskEdge[]) || [])
      } catch (error) {
        console.error("Failed to fetch project:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProject()
  }, [id, setNodes, setEdges])

  const saveProjectChanges = useCallback(async () => {
    if (!id) return

    const nodesToAdd: TaskNode[] = nodes.filter(
      (node) => !project?.nodes?.some((n: TaskNode) => n.id === node.id)
    )

    const nodesToDelete: TaskNode[] =
      project?.nodes?.filter(
        (node: TaskNode) => !nodes.some((n) => n.id === node.id)
      ) || []

    const nodesToChange: TaskNode[] = nodes.filter((node) => {
      const existingNode = project?.nodes?.find(
        (n: TaskNode) => n.id === node.id
      )
      if (!existingNode) return false

      // Check all properties for changes
      const hasDataChanges =
        node.data?.title !== existingNode.data?.title ||
        node.data?.description !== existingNode.data?.description ||
        node.data?.status !== existingNode.data?.status

      const hasPositionChanges =
        node.position?.x !== existingNode.position?.x ||
        node.position?.y !== existingNode.position?.y

      const hasTypeChange = node.type !== existingNode.type

      return hasDataChanges || hasPositionChanges || hasTypeChange
    })

    const edgesToAdd: TaskEdge[] = edges.filter(
      (edge) => !project?.edges?.some((e: TaskEdge) => e.id === edge.id)
    )

    const edgesToDelete: TaskEdge[] =
      project?.edges?.filter(
        (edge: TaskEdge) => !edges.some((e) => e.id === edge.id)
      ) || []

    const request: UpdateProjectRequest = {
      edgesToAdd: edgesToAdd,
      edgesToRemove: edgesToDelete,
      nodesToRemove: nodesToDelete,
      nodesToUpdate: nodesToChange,
      nodesToAdd: nodesToAdd,
    }

    await todoFlowClient.projectsIdPatch(id, request)
  }, [id, nodes, edges, project])

  useDebounce({ nodes, edges }, () => saveProjectChanges(), 1000)

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds) as FlowTaskNode[])
    },
    [setNodes]
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds) as FlowTaskEdge[])
    },
    [setEdges]
  )

  const onConnect: OnConnect = useCallback(
    (connection) => {
      setEdges((edges) => addEdge(connection, edges))
    },
    [setEdges]
  )

  const handleAddNode = () => {
    const newNode: FlowTaskNode = {
      id: uuidv4(),
      type: NodeType.Task,
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        title: "",
        description: "",
        status: TaskStatus.Todo,
      },
    }
    setNodes((nds) => [...nds, newNode])
  }

  if (isLoading) {
    return
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
            {theme === "dark" ? <MoonIcon /> : <SunIcon />}
          </ControlButton>
        </Controls>

        <Panel position="bottom-right" className="p-4">
          <Button size="lg" variant="outline" onClick={handleAddNode}>
            Add Task
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  )
}
