import { Configuration, ProjectsToDoFlow } from "../../api"

const configuration = new Configuration({
  basePath: import.meta.env.VITE_API_URL,
})

export const apiClient = new ProjectsToDoFlow(configuration)
