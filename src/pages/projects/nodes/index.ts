import type { NodeTypes } from "@xyflow/react"

import { PositionLoggerNode } from "./PositionLoggerNode"
import { INodeType, ITaskNode } from "api"
import { TaskNodeComponent } from "./TaskNode"

export const initialNodes: ITaskNode[] = []

export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  [INodeType.Task]: TaskNodeComponent,
} satisfies NodeTypes
