import { Node, Edge } from "@xyflow/react"
import { TaskNode as ApiTaskNode, TaskEdge as ApiTaskEdge } from "api/api"

export type FlowTaskNode = Node & ApiTaskNode
export type FlowTaskEdge = Edge & ApiTaskEdge
