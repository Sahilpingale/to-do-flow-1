export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export interface IProject {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  nodes: TaskNode[]
  edges: TaskEdge[]
}

export interface TaskNode {
  id: string
  data: {
    title: string
    description: string
    status: TaskStatus
  }
  position: {
    x: number
    y: number
  }
  type: TaskNodeType
}

export enum TaskNodeType {
  TASK = "task",
}

export interface TaskEdge {
  id: string
  source: string
  target: string
  type: TaskNodeType
  animated: boolean
  deletable: boolean
  reconnectable: boolean
}

export interface ITask {
  id: string
  name: string
  description: string
  subTasks: ITask[]
  status: TaskStatus
  createdAt: Date
  updatedAt: Date
}
