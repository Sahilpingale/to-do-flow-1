import { Configuration, ProjectsToDoFlow } from "../../api"

const configuration = new Configuration({
  basePath: "http://localhost:9000",
})

export const apiClient = new ProjectsToDoFlow(configuration)
