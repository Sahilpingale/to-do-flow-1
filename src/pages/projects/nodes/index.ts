import type { NodeTypes } from "@xyflow/react"

import { PositionLoggerNode } from "./PositionLoggerNode"
import { NodeType, TaskNode } from "api"
import { TaskNodeComponent } from "./TaskNode"

export const initialNodes: TaskNode[] = []

export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  [NodeType.Task]: TaskNodeComponent,
} satisfies NodeTypes
