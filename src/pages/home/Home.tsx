import { useEffect, useState } from "react"

import { useNavigate } from "react-router"
import { IconTrash, IconSun, IconMoon } from "@tabler/icons-react"
import { FlipWords } from "../../components/ui/flip-words"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"
import { useTheme } from "@/hooks/useTheme"
import { apiClient } from "@/lib/api"
import { Project } from "api/api"

const Home = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const navigate = useNavigate()
  const { toggleTheme } = useTheme()

  useEffect(() => {
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
    <div className="h-screen w-full dark:bg-black bg-white text-black dark:text-white">
      <div className="flex px-8 py-4 justify-between">
        <h1 className="bg-gradient-to-r from-purple-500 to-purple-800 bg-clip-text text-transparent font-bold text-2xl">
          To Do Flow
        </h1>
        <button
          onClick={toggleTheme}
          className="inline-flex items-center justify-center rounded-md w-9 h-9 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <IconSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <IconMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </button>
      </div>

      <section className="w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
        {/* Flip words */}
        <div className="h-48 w-full flex justify-center items-center px-2 sm:px-4">
          <div className="text-2xl sm:text-3xl md:text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400 w-full max-w-fit md:max-w-md">
            Manage tasks
            <FlipWords
              words={["effortlessly", "efficiently", "seamlessly"]}
            />{" "}
            <br />
            <span>with </span>
            <span className="bg-gradient-to-r from-purple-500 to-purple-800 bg-clip-text text-transparent font-bold">
              To Do Flow
            </span>
          </div>
        </div>
      </section>

      {/* Table */}
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

        <div className="border rounded-lg">
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
                    className="cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                    onClick={(e) => {
                      // Only navigate if the click wasn't on the delete button cell
                      if (!(e.target as HTMLElement).closest(".delete-cell")) {
                        navigate(`/project/${project.id}`)
                      }
                    }}
                  >
                    <TableCell className="font-medium">
                      {project.name}
                    </TableCell>
                    <TableCell>
                      {project.createdAt
                        ? new Date(project.createdAt).toLocaleDateString()
                        : ""}
                    </TableCell>
                    <TableCell>
                      {project.updatedAt
                        ? new Date(project.updatedAt).toLocaleDateString()
                        : ""}
                    </TableCell>
                    <TableCell className="delete-cell">
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
    </div>
  )
}

export default Home
