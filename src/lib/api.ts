import { Configuration, ProjectsToDoFlow } from "../../api"
// import axios from "axios"
// import Cookies from "js-cookie"
// import { auth } from "@/config/firebase"

// // Create axios instance with interceptors
// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
// })

// // Add request interceptor to include auth token
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = Cookies.get("auth_access_token")
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => Promise.reject(error)
// )

// // Add response interceptor to handle token refresh
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config

//     // If error is 401 (Unauthorized) and we haven't tried to refresh yet
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true

//       try {
//         // Get current user from Firebase
//         const currentUser = auth.currentUser
//         if (currentUser) {
//           // Force token refresh
//           const newToken = await currentUser.getIdToken(true)

//           // Update token in cookies
//           Cookies.set("auth_access_token", newToken, {
//             secure: process.env.NODE_ENV === "production",
//             sameSite: "strict",
//             expires: 7,
//           })

//           // Update header and retry request
//           originalRequest.headers.Authorization = `Bearer ${newToken}`
//           return axiosInstance(originalRequest)
//         }
//       } catch (refreshError) {
//         console.error("Token refresh failed:", refreshError)
//         // Could add logic to redirect to login page here
//       }
//     }

//     return Promise.reject(error)
//   }
// )

const configuration = new Configuration({
  basePath: import.meta.env.VITE_API_URL,
})

export const apiClient = new ProjectsToDoFlow(
  configuration,
  undefined
  // axiosInstance
)
