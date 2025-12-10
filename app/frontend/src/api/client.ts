import axios from "axios"

export const baseURL = import.meta.env.VITE_API_URL as string
const timeout = 10000

export const http = axios.create({
  baseURL: "/api",
  timeout,
  withCredentials: true,
})
