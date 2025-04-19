import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { TextInputWithAcceptReject } from "@/components/ui/TextInputWithAcceptReject"
import { apiClient } from "@/lib/api"
import { IconPencil, IconTrash } from "@tabler/icons-react"
import { Project } from "api/api"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Project 1",
    createdAt: "2021-01-01",
  },
  {
    id: "2",
    name: "Project 2",
    createdAt: "2021-01-02",
  },
  {
    id: "3",
    name: "Project 3",
    createdAt: "2021-01-03",
  },
]

export const ProjectGrid = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const textInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const fetchProjects = async () => {
    try {
      const response = await apiClient.projectsGet()
      const fetchedProjects = response.data.map((project) => ({
        ...project,
        createdAt: project.createdAt ?? "",
        updatedAt: project.updatedAt ?? "",
      }))
      setProjects(fetchedProjects)
    } catch (error) {
      console.error("Failed to fetch projects:", error)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleCreateProject = async () => {
    try {
      const response = await apiClient.projectsPost({
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
      await apiClient.projectsIdDelete(id)
      setProjects((prev) => prev.filter((project) => project.id !== id))
    } catch (error) {
      console.error("Failed to delete project:", error)
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
              {projects.map((project) => (
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
                      onChange={(value) => {
                        setProjects((prev) =>
                          prev.map((p) =>
                            p.id === project.id ? { ...p, name: value } : p
                          )
                        )
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
