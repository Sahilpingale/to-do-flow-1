import type { NodeTypes } from "@xyflow/react"

import { PositionLoggerNode } from "./PositionLoggerNode"
import { TaskNode } from "./TaskNode"
import { TaskStatus } from "@/models/models"
// import { AppNode } from "./types"

export const initialNodes: TaskNode[] = [
  {
    id: "1",
    type: "task",
    data: {
      description: "description 1",
      title: "title 1",
      status: TaskStatus.TODO,
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "2",
    type: "task",
    data: {
      description: "description 2",
      title: "title 2",
      status: TaskStatus.TODO,
    },
    position: { x: 250, y: 100 },
  },
]

export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  task: TaskNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes
