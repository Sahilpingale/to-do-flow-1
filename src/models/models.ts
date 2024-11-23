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
  tasks: ITask[]
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
