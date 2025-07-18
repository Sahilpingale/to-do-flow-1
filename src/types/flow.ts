import { Node, Edge } from "@xyflow/react"
import { ITaskNode, ITaskEdge } from "api/api"

export type FlowTaskNode = Node & ITaskNode
export type FlowTaskEdge = Edge & ITaskEdge
