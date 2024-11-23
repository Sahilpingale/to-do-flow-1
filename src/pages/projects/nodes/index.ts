import type { NodeTypes } from "@xyflow/react"

import { PositionLoggerNode } from "./PositionLoggerNode"
import { TaskNode } from "./TaskNode"
import { AppNode } from "./types"
import { TaskStatus } from "@/models/models"

export const initialNodes: TaskNode[] = [
  // { id: "a", type: "input", position: { x: 0, y: 0 }, data: { label: "wire" } },
  // {
  //   id: "b",
  //   type: "position-logger",
  //   position: { x: -100, y: 100 },
  //   data: { label: "drag me!" },
  // },
  // { id: "c", position: { x: 100, y: 100 }, data: { label: "your ideas" } },
  // {
  //   id: "d",
  //   type: "output",
  //   position: { x: 0, y: 200 },
  //   data: { label: "with React Flow" },
  // },
  {
    id: "e",
    type: "task",
    position: { x: 1000, y: 200 },
    data: {
      title: "Task 123",
      description: "Description 1",
      status: TaskStatus.TODO,
    },
  },
  {
    id: "f",
    type: "task",
    position: { x: 0, y: 400 },
    data: {
      title: "Test Task 123",
      description: "Description 1",
      status: TaskStatus.TODO,
    },
  },
]

export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  task: TaskNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes
