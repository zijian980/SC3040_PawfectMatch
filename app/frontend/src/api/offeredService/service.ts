import { http } from "../client"
import { API } from "../endpoints"
import type {
  TAddOfferedServiceRequest,
  TOfferedServices,
  TUpdateOfferedServiceRequest,
} from "./types"

export const fetchOfferedServices = async (): Promise<TOfferedServices> => {
  try {
    const res = await http.get<TOfferedServices>(API.OFFERED_SERVICE.BASE)
    console.log("GET offered services: ", res)
    return res.data
  } catch (err) {
    console.log(`GET offered services: ${err}`)
    throw new Error("Failed to fetch offered services")
  }
}

export const fetchOfferedServiceByUserId = async (userId: string): Promise<TOfferedServices> => {
  try {
    const res = await http.get<TOfferedServices>(`${API.OFFERED_SERVICE.BASE}/${userId}`)
    console.log("GET offered services by user id: ", res)
    return res.data
  } catch (err) {
    console.log(`GET offered services by user id: ${err}`)
    throw new Error("Failed to fetch offered services by user id")
  }
}

export const addOfferedService = async (data: TAddOfferedServiceRequest): Promise<void> => {
  try {
    const res = await http.post<void>(API.OFFERED_SERVICE.BASE, data)
    console.log("POST add offered service: ", res)
    return res.data
  } catch (err) {
    console.log(`POST add offered service: ${err}`)
    throw new Error("Failed to add offered service")
  }
}

export const updateOfferedService = async ({
  id,
  ...data
}: TUpdateOfferedServiceRequest): Promise<void> => {
  try {
    const res = await http.patch<void>(`${API.OFFERED_SERVICE.BASE}/${id}`, { ...data })
    console.log("PATCH update offered service: ", res)
    return res.data
  } catch (err) {
    console.log(`PATCH update offered service: ${err}`)
    throw new Error("Failed to update offered service")
  }
}

export const deleteOfferedService = async (id: number): Promise<void> => {
  try {
    const res = await http.delete<void>(`${API.OFFERED_SERVICE.BASE}/${id}`)
    console.log("DELETE offered service: ", res)
    return res.data
  } catch (err) {
    console.log(`DELETE offered service: ${err}`)
    throw new Error("Failed to delete offered service")
  }
}
