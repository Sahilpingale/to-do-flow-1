import type { EdgeTypes } from "@xyflow/react"
import { TaskEdge } from "../nodes/TaskNode"

export const initialEdges: TaskEdge[] = [
  {
    id: "1-2",
    source: "1",
    target: "2",
    type: "task",
    animated: false,
    deletable: true,
    reconnectable: true,
  },
]

export const edgeTypes = {
  // Add your custom edge types here!
} satisfies EdgeTypes
