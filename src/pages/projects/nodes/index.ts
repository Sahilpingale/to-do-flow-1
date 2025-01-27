import type { NodeTypes } from "@xyflow/react"

import { PositionLoggerNode } from "./PositionLoggerNode"
import { type TaskNode } from "@/models/models"
import { TaskNodeComponent } from "./TaskNode"

export const initialNodes: TaskNode[] = []

export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  task: TaskNodeComponent,
} satisfies NodeTypes
