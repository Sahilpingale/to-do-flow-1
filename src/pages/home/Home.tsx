import React, { useState } from "react"
import { IProject } from "../../models/models"
import { useNavigate } from "react-router"
import { IconTrash, IconSun, IconMoon } from "@tabler/icons-react"
import { FlipWords } from "../../components/ui/flip-words"
import { useTheme } from "../../contexts/ThemeProvider"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"

const getStoredProjects = (): IProject[] => {
  const stored = localStorage.getItem("projects")
  if (!stored) return []

  const projects = JSON.parse(stored)
  return projects.map((project: IProject) => ({
    ...project,
    createdAt: new Date(project.createdAt),
    updatedAt: new Date(project.updatedAt),
  }))
}

const Home = () => {
  const [projects, setProjects] = useState<IProject[]>(getStoredProjects())
  const navigate = useNavigate()
  const { toggleTheme } = useTheme()

  const handleCreateProject = () => {
    const newProject: IProject = {
      id: crypto.randomUUID(),
      name: `Project ${projects.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      tasks: [],
    }

    const updatedProjects = [...projects, newProject]
    setProjects(updatedProjects)
    localStorage.setItem("projects", JSON.stringify(updatedProjects))
  }

  const handleDeleteProject = (id: string) => {
    const updatedProjects = projects.filter((project) => project.id !== id)
    setProjects(updatedProjects)
    localStorage.setItem("projects", JSON.stringify(updatedProjects))
  }

  return (
    <>
      <div className="h-screen w-full dark:bg-black bg-white text-black dark:text-white">
        <div className="flex px-8 py-4 justify-between">
          <h1 className="bg-gradient-to-r from-purple-500 to-purple-800 bg-clip-text text-transparent font-bold text-2xl">
            To do flow
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

        <section className="h-[50vh] w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
          {/* Radial gradient for the container to give a faded look */}
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <div className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
            {/* Flip words */}
            <div className="h-48 w-full flex justify-center items-center px-2 sm:px-4">
              <div className="text-2xl sm:text-3xl md:text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400 w-full max-w-md">
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
          </div>
        </section>

        {/* Replace the existing table section with this */}
        <div className="py-4 px-8 ">
          <div className="flex justify-between items-center mb-4">
            <h2 className="sm:text-2xl md:text-3xl font-semibold">Projects</h2>
            <button
              onClick={handleCreateProject}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
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
                        if (
                          !(e.target as HTMLElement).closest(".delete-cell")
                        ) {
                          navigate(`/project/${project.id}`)
                        }
                      }}
                    >
                      <TableCell className="font-medium">
                        {project.name}
                      </TableCell>
                      <TableCell>
                        {project.createdAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {project.updatedAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="delete-cell">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteProject(project.id)
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
    </>
  )
}

export default Home
