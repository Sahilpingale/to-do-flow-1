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
import { ITaskNodeData, ITaskStatus } from "api"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const statusTranslation = {
  [ITaskStatus.Todo]: "Todo",
  [ITaskStatus.InProgress]: "In progress",
  [ITaskStatus.Done]: "Done",
}

type TaskNodeProps = NodeProps<
  Node<
    Pick<ITaskNodeData, "title" | "description" | "status"> & {
      isSelected?: boolean
    }
  >
>

export function TaskNodeComponent(props: TaskNodeProps) {
  const { data, id, isConnectable } = props
  const { deleteElements, setNodes } = useReactFlow()

  const handleDeleteNode = (nodeId: string) => {
    deleteElements({ nodes: [{ id: nodeId }] })
  }

  const handleInputChange =
    (field: keyof ITaskNodeData) =>
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

  const handleStatusChange = (value: ITaskStatus) => {
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
    <div
      className={cn(
        "border rounded-md p-4 node-background transition-all duration-300",
        data.isSelected && "border-violet-400 dark:border-violet-500 shadow-lg",
        data.isSelected && "animate-pulse-glow"
      )}
    >
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
                {statusTranslation[data.status || ITaskStatus.Todo]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuRadioGroup
                value={data.status}
                onValueChange={(value) =>
                  handleStatusChange(value as ITaskStatus)
                }
              >
                <DropdownMenuRadioItem value={ITaskStatus.Todo}>
                  {statusTranslation[ITaskStatus.Todo]}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={ITaskStatus.InProgress}>
                  {statusTranslation[ITaskStatus.InProgress]}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={ITaskStatus.Done}>
                  {statusTranslation[ITaskStatus.Done]}
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
