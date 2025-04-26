import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { TextInputWithAcceptReject } from "@/components/ui/TextInputWithAcceptReject"
import { useAuth } from "@/hooks/useAuth"
import { useNotification } from "@/hooks/useNotification"
import { todoFlowClient } from "@/lib/api"
import { IconPencil, IconTrash } from "@tabler/icons-react"
import { Project } from "api/api"
import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

export const ProjectGrid = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const textInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addSuccessNotification, addErrorNotification } = useNotification()
  const fetchProjects = useCallback(async () => {
    try {
      const response = await todoFlowClient.projectsGet()
      const fetchedProjects = response.data.map((project: Project) => ({
        ...project,
        createdAt: project.createdAt ?? "",
        updatedAt: project.updatedAt ?? "",
      }))
      setProjects(fetchedProjects)
    } catch (error) {
      console.error("Failed to fetch projects:", error)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [user?.uid, fetchProjects])

  const handleCreateProject = async () => {
    try {
      const response = await todoFlowClient.projectsPost({
        name: `Project ${projects.length + 1}`,
      })

      const newProject = {
        ...response.data,
        createdAt: response.data.createdAt ?? "",
        updatedAt: response.data.updatedAt ?? "",
      }

      setProjects((prev) => [...prev, newProject as Project])
    } catch (error) {
      console.error("Failed to create project:", error)
    }
  }

  const handleDeleteProject = async (id: string) => {
    try {
      await todoFlowClient.projectsIdDelete(id)
      setProjects((prev) => prev.filter((project) => project.id !== id))
    } catch (error) {
      console.error("Failed to delete project:", error)
    }
  }

  const handleUpdateProject = async (id: string, value: string) => {
    try {
      const response = await todoFlowClient.projectsIdPatch(id, { name: value })
      setProjects((prev) => prev.map((p) => (p.id === id ? response.data : p)))
      addSuccessNotification("Project updated successfully")
    } catch (error) {
      addErrorNotification("Failed to update project")
    }
  }

  return (
    <div className="p-4 md:p-8 lg:p-16">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl md:text-3xl font-semibold">Projects</h2>
        <button
          onClick={handleCreateProject}
          className="px-4 py-2 text-sm md:text-base bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
        >
          New Project
        </button>
      </div>

      <div className="border rounded-lg mt-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center py-6">
                      <p className="text-neutral-400 dark:text-neutral-500 text-sm mt-1">
                        Click the <span className="font-bold">New Project</span>{" "}
                        button to get started
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow
                    key={project.id}
                    className="cursor-pointer  hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                    onClick={(e) => {
                      const target = e.target as HTMLElement
                      const targetId =
                        target.id || target.closest("[id]")?.id || ""

                      const isNameField = targetId.startsWith("project-name-")
                      const isDeleteAction =
                        targetId.startsWith("project-delete-")

                      if (!isNameField && !isDeleteAction) {
                        navigate(`/project/${project.id}`)
                      }
                    }}
                  >
                    <TableCell
                      id={`project-name-${project.id}`}
                      className="font-medium"
                    >
                      <TextInputWithAcceptReject
                        leftSection={<IconPencil className="h-4 w-4" />}
                        value={project.name ?? ""}
                        initialValue={project.name ?? ""}
                        onChange={async (value) => {
                          handleUpdateProject(project.id!, value)
                        }}
                        ref={textInputRef}
                      />
                    </TableCell>

                    <TableCell
                      id={`project-created-at-${project.id}`}
                      className="font-medium"
                    >
                      {project.createdAt
                        ? new Date(project.createdAt).toLocaleDateString()
                        : ""}
                    </TableCell>
                    <TableCell
                      id={`project-updated-at-${project.id}`}
                      className="font-medium"
                    >
                      {project.updatedAt
                        ? new Date(project.updatedAt).toLocaleDateString()
                        : ""}
                    </TableCell>
                    <TableCell
                      id={`project-delete-${project.id}`}
                      className="delete-cell"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteProject(project.id!)
                        }}
                        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                      >
                        <IconTrash className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
