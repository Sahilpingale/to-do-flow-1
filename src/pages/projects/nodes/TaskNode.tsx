import { Handle, NodeProps, Position, useReactFlow, Node } from "@xyflow/react"
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
import { TaskNodeData, TaskStatus } from "api"
import { XIcon } from "lucide-react"

const statusTranslation = {
  [TaskStatus.Todo]: "Todo",
  [TaskStatus.InProgress]: "In progress",
  [TaskStatus.Done]: "Done",
}

type TaskNodeProps = NodeProps<
  Node<Pick<TaskNodeData, "title" | "description" | "status">>
>

export function TaskNodeComponent(props: TaskNodeProps) {
  const { data, id, isConnectable } = props
  const { deleteElements, setNodes } = useReactFlow()

  const handleDeleteNode = (nodeId: string) => {
    deleteElements({ nodes: [{ id: nodeId }] })
  }

  const handleInputChange =
    (field: keyof TaskNodeData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                [field]: event.target.value,
              },
            }
          }
          return node
        })
      )
    }

  const handleStatusChange = (value: TaskStatus) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              status: value,
            },
          }
        }
        return node
      })
    )
  }

  return (
    <div className="border rounded-md p-4 node-background">
      <div className="flex justify-end">
        <XIcon
          onClick={() => handleDeleteNode(id)}
          className="h-4 w-4 cursor-pointer "
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={data.title}
            onChange={handleInputChange("title")}
            className="node-input"
            placeholder="Add a title"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={data.description}
            onChange={handleInputChange("description")}
            className="node-input"
            placeholder="Add a description"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Status</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {statusTranslation[data.status || TaskStatus.Todo]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuRadioGroup
                value={data.status}
                onValueChange={(value) =>
                  handleStatusChange(value as TaskStatus)
                }
              >
                <DropdownMenuRadioItem value={TaskStatus.Todo}>
                  {statusTranslation[TaskStatus.Todo]}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={TaskStatus.InProgress}>
                  {statusTranslation[TaskStatus.InProgress]}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={TaskStatus.Done}>
                  {statusTranslation[TaskStatus.Done]}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </div>
  )
}

export default TaskNodeComponent
