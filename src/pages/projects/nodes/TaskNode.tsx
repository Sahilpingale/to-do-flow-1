// import { useCallback } from "react"
import {
  //   applyNodeChanges,
  Handle,
  Node,
  NodeProps,
  Position,
  useReactFlow,
} from "@xyflow/react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { TaskStatus } from "@/models/models"
import { useTheme } from "@/hooks/useTheme"
import { XIcon } from "lucide-react"

// add id to the node

export interface TaskNode extends Node<Record<string, unknown>, string> {
  data: {
    title: string
    description: string
    status: TaskStatus
  }
  id: string
}

const statusTranslation = {
  [TaskStatus.TODO]: "Todo",
  [TaskStatus.IN_PROGRESS]: "In progress",
  [TaskStatus.DONE]: "Done",
}

export function TaskNode({ data, id, isConnectable }: NodeProps<TaskNode>) {
  const { theme } = useTheme()
  const { deleteElements } = useReactFlow()

  //   const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
  //     console.log(evt.target.value)
  //   }, [])

  const handleDeleteNode = (nodeId: string) => {
    deleteElements({ nodes: [{ id: nodeId }] })
  }

  return (
    <div className="border rounded-md p-4 node-background">
      {/* <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      /> */}
      <div className="flex justify-end">
        <XIcon
          onClick={() => handleDeleteNode(id)}
          className="h-4 w-4 cursor-pointer hover:text-red-500"
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={data.title}
            onChange={(e) => console.log("onChange", e.target.value)}
            className="node-input"
            placeholder="Add a title"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={data.description}
            onChange={(e) => console.log("onChange", e.target.value)}
            className="node-input"
            placeholder="Add a description"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Status</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {statusTranslation[data.status]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuRadioGroup
                value={data.status}
                onValueChange={(value) => console.log("onValueChange", value)}
              >
                <DropdownMenuRadioItem value={TaskStatus.TODO}>
                  {statusTranslation[TaskStatus.TODO]}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={TaskStatus.IN_PROGRESS}>
                  {statusTranslation[TaskStatus.IN_PROGRESS]}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={TaskStatus.DONE}>
                  {statusTranslation[TaskStatus.DONE]}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={handleStyle}
        isConnectable={isConnectable}
      /> */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
      />
    </div>
  )
}

export default TaskNode
