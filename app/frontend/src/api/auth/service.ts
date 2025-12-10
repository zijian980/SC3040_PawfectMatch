import { baseURL, http } from "../client"
import { API } from "../endpoints"
import type { TAuthenticatedResponse, TLoginProps, TSignUpProps, TSignUpResponse } from "./types"

export const isAuthenticated = async (): Promise<TAuthenticatedResponse> => {
  try {
    const res = await http.get(API.PROFILE.GET)
    if (res.status === 200) {
      return { authenticated: true }
    } else {
      return { authenticated: false }
    }
  } catch (err) {
    console.error(`isAuthenticated: ${err}`)
    return { authenticated: false }
  }
}

export const login = async (data: TLoginProps): Promise<void> => {
  try {
    const res = await http.post<void>(API.AUTH.LOGIN, data)
    console.log("POST login: ", res)
    return res.data
  } catch (err) {
    console.log(`POST login: ${err}`)
    throw new Error("Invalid credentials")
  }
}

export const signup = async (data: TSignUpProps): Promise<TSignUpResponse> => {
  const res = await http.post<TSignUpResponse>(API.AUTH.SIGNUP, data)
  if (res.status === 201) return res.data

  console.log(`signup: ${res}`)
  console.log("Full error:", res.data) // Better debugging

  // Handle different types of signup errors
  if (res.status === 409) {
    throw new Error("An account with this email already exists")
  }
  if (res.status === 400) {
    // Extract specific validation errors from backend
    const errorMessage = res.data?.detail || "Invalid input data. Please check your information."
    throw new Error(errorMessage)
  }
  if (res.status === 422) {
    // Validation errors from Pydantic
    const errors = res.data?.detail
    if (Array.isArray(errors) && errors.length > 0) {
      const firstError = errors[0]
      throw new Error(`${firstError.loc?.[1] || "Field"}: ${firstError.msg}`)
    }
    throw new Error("Validation error. Please check your input.")
  }

  // Network connection errors
  if (!res) {
    throw new Error("Cannot connect to server. Please check if the backend is running.")
  }

  throw new Error("Failed to create account. Please try again.")
}

export const loginGoogle = () => {
  const url = `${baseURL}${API.AUTH.GOOGLE_LOGIN}`
  window.location.href = url
}

export const logout = async (): Promise<void> => {
  try {
    const res = await http.post<void>(API.AUTH.LOGOUT)
    console.log("POST logout: ", res)
    return res.data
  } catch (err) {
    console.log(`POST logout: ${err}`)
    throw new Error("Logout failed")
  }
}
