import { useCallback, useEffect, useState, useMemo } from "react"
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
import { MoonIcon, SunIcon, ArrowUpIcon, SquareIcon, XIcon } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"

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
  const [isProcessing, setIsProcessing] = useState(false)
  const [queryInput, setQueryInput] = useState<string>("")
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set())

  // Memoize selected nodes data to prevent unnecessary re-computations
  // const selectedNodesData = useMemo(() => {
  //   return nodes.filter((node) => selectedNodeIds.has(node.id))
  // }, [selectedNodeIds, nodes])

  // Memoize the nodes with selection state to prevent unnecessary re-renders
  const nodesWithSelection = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        isSelected: selectedNodeIds.has(node.id),
      },
    }))
  }, [nodes, selectedNodeIds])

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

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: FlowTaskNode) => {
      event.stopPropagation()
      setSelectedNodeIds((prev) => {
        const newSelected = new Set(prev)
        if (newSelected.has(node.id)) {
          newSelected.delete(node.id) // Deselect if already selected
        } else {
          newSelected.add(node.id) // Select if not selected
        }
        return newSelected
      })
    },
    []
  )

  const handleClearSelection = useCallback(() => {
    setSelectedNodeIds(new Set())
  }, [])

  const handleAIQuery = useCallback(async () => {
    if (!id) return
    if (!queryInput.trim()) return

    setIsProcessing(true)
    try {
      setQueryInput("")
    } catch (error) {
      console.error("Failed to process AI query:", error)
    } finally {
      setIsProcessing(false)
    }
  }, [id, queryInput])

  if (isLoading) {
    return
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        colorMode={theme === "dark" ? "dark" : "light"}
        nodes={nodesWithSelection}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeDoubleClick={handleNodeClick}
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

        {/* Floating Clear Selection Button */}
        {selectedNodeIds.size > 0 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <Button
              size="sm"
              variant="outline"
              onClick={handleClearSelection}
              className="bg-background/90 backdrop-blur-sm border-2 hover:bg-background shadow-lg"
            >
              <XIcon className="w-4 h-4 mr-2" />
              Clear Selection ({selectedNodeIds.size})
            </Button>
          </div>
        )}

        <Panel position="bottom-right" className="p-4">
          <div className="flex gap-5">
            {/* AI Query component */}
            <div className="max-w-[700px] min-w-[70vw] space-y-2">
              <div className="relative">
                <Textarea
                  placeholder="Describe tasks you want to generate..."
                  value={queryInput}
                  autosize
                  minRows={1}
                  maxRows={10}
                  onChange={(e) => setQueryInput(e.target.value)}
                  className="h-12 flex-1 pr-12 rounded-xl border-2 focus:border-violet-400 dark:focus:border-violet-500 transition-all duration-200 bg-background/80 backdrop-blur-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.shiftKey) {
                      // Allow Shift+Enter for new lines
                      return
                    }
                    if (
                      e.key === "Enter" &&
                      !isProcessing &&
                      queryInput.trim()
                    ) {
                      e.preventDefault()
                      handleAIQuery()
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={handleAIQuery}
                  disabled={!queryInput.trim() || isProcessing}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full p-0 bg-violet-500 hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-700 disabled:bg-gray-400 transition-all duration-200"
                >
                  {isProcessing ? (
                    <SquareIcon className="w-4 h-4 text-white" />
                  ) : (
                    <ArrowUpIcon className="w-4 h-4 text-white" />
                  )}
                </Button>
              </div>
              <p className="select-none text-xs text-muted-foreground text-center px-2">
                {selectedNodeIds.size > 0
                  ? `${selectedNodeIds.size} node${
                      selectedNodeIds.size > 1 ? "s" : ""
                    } selected • Enter query to generate relevant tasks`
                  : "Select nodes and enter query to generate new but relevant tasks"}
              </p>
            </div>
            <Button
              className="h-12 flex-shrink-0"
              size="lg"
              variant="outline"
              onClick={handleAddNode}
            >
              Add Task
            </Button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}
