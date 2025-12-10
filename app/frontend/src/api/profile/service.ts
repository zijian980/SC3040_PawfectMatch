import { http } from "../client"
import { API } from "../endpoints"
import type { TProfilePictureResponse, TProfileResponse, TUpdateProfileRequest } from "./types"

export const fetchProfile = async (): Promise<TProfileResponse> => {
  try {
    const res = await http.get<TProfileResponse>(API.PROFILE.GET)
    console.log("GET profile: ", res)
    return {
      ...res.data,
      profile_picture: res.data.profile_picture ? `/api${res.data.profile_picture}` : "",
    }
  } catch (err) {
    console.log(`GET profile: ${err}`)
    throw new Error("Failed to fetch profile")
  }
}

export const fetchProfilePicture = async (): Promise<TProfilePictureResponse> => {
  try {
    const res = await http.get<TProfileResponse>(API.PROFILE.GET)
    console.log("GET profile: ", res)
    return { profilePicture: res.data.profile_picture ? `/api${res.data.profile_picture}` : "" }
  } catch (err) {
    console.log(`GET profile: ${err}`)
    throw new Error("Failed to fetch profile")
  }
}

export const fetchProfileById = async (userId: string) => {
  try {
    const res = await http.get(`/profile/${userId}`)
    console.log("GET profile by ID: ", res)
    return res.data
  } catch (err) {
    console.log(`GET profile by ID: ${err}`)
    throw new Error("Failed to fetch profile by ID")
  }
}

export const updateProfile = async (data: TUpdateProfileRequest): Promise<void> => {
  try {
    const res = await http.put<void>(API.PROFILE.UPDATE, data)
    console.log("PUT update profile: ", res)
    return res.data
  } catch (err) {
    console.log(`PUT update profile: ${err}`)
    throw new Error("Failed to update profile")
  }
}

export const updateProfilePicture = async (file: File): Promise<void> => {
  try {
    const formData = new FormData()
    formData.append("image", file)
    const res = await http.patch<void>(API.PROFILE.PICTURE, formData)
    console.log("PATCH update profile picture: ", res)
    return res.data
  } catch (err) {
    console.log(`PATCH update profile picture: ${err}`)
    throw new Error("Failed to update profile picture")
  }
}
