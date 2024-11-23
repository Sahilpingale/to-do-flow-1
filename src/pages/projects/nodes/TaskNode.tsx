import { useCallback } from "react"
import {
  applyNodeChanges,
  Handle,
  Node,
  NodeProps,
  Position,
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

export interface TaskNode extends Node<Record<string, unknown>, string> {
  data: {
    title: string
    description: string
    status: TaskStatus
  }
}

export function TaskNode({ data, isConnectable }: NodeProps<TaskNode>) {
  const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    console.log(evt.target.value)
  }, [])

  return (
    <div className="text-updater-node border border-neutral-200 dark:border-neutral-800 rounded-md p-4 bg-slate-50 dark:bg-gray-600">
      {/* <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      /> */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={data.title}
            onChange={(e) => console.log("onChange", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={data.description}
            onChange={(e) => console.log("onChange", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Status</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{TaskStatus[data.status]}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuRadioGroup
                value={data.status}
                onValueChange={(value) => console.log("onValueChange", value)}
              >
                <DropdownMenuRadioItem value={TaskStatus.TODO}>
                  Todo
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={TaskStatus.IN_PROGRESS}>
                  In Progress
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={TaskStatus.DONE}>
                  Done
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
