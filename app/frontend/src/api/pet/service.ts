import { http } from "../client"
import { API } from "../endpoints"
import type { TAddPetRequest, TPets } from "./types"

export const fetchPetsByOwner = async (): Promise<TPets> => {
  try {
    const res = await http.get(API.PET)
    console.log("GET pets by owner id: ", res)
    return res.data
  } catch (err) {
    console.log(`GET pets by owner id: ${err}`)
    throw new Error("Failed to fetch owned pets")
  }
}

export const addPet = async (pet: TAddPetRequest): Promise<void> => {
  try {
    const res = await http.post(API.PET, pet)
    console.log("POST add pet: ", res)
    return res.data
  } catch (err) {
    console.log(`POST add pet: ${err}`)
    throw new Error("Failed to add pet")
  }
}

export const deletePet = async (petId: number): Promise<void> => {
  try {
    const res = await http.delete(`${API.PET}/${petId}`)
    console.log("DELETE pet: ", res)
    return res.data
  } catch (err) {
    console.log(`DELETE pet: ${err}`)
    throw new Error("Failed to delete pet")
  }
}
