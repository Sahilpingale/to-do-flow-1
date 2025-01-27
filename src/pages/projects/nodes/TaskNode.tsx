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
import type { TaskNode } from "@/models/models"
import { TaskStatus } from "@/models/models"
import { XIcon } from "lucide-react"

const statusTranslation = {
  [TaskStatus.TODO]: "Todo",
  [TaskStatus.IN_PROGRESS]: "In progress",
  [TaskStatus.DONE]: "Done",
}

type TaskNodeProps = NodeProps<Node<Pick<TaskNode, "data">["data"]>>

export function TaskNodeComponent(props: TaskNodeProps) {
  const { data, id, isConnectable } = props
  const { deleteElements, setNodes } = useReactFlow()

  const handleDeleteNode = (nodeId: string) => {
    deleteElements({ nodes: [{ id: nodeId }] })
  }

  const handleInputChange =
    (field: keyof TaskNode["data"]) =>
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
                {statusTranslation[data.status]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuRadioGroup
                value={data.status}
                onValueChange={(value) =>
                  handleStatusChange(value as TaskStatus)
                }
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
      <Handle
        type="target"
        position={Position.Left}
        // id="b"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        // id="b"
        isConnectable={isConnectable}
      />
    </div>
  )
}

export default TaskNodeComponent
