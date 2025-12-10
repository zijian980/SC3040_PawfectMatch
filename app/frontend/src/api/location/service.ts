import { http } from "../client"
import { API } from "../endpoints"
import type { TLocations } from "./types"

export const fetchLocations = async (): Promise<TLocations> => {
  try {
    const res = await http.get<TLocations>(API.LOCATION.GET)
    console.log("GET locations: ", res)
    return res.data
  } catch (err) {
    console.log(`GET locations: ${err}`)
    throw new Error("Failed to fetch locations")
  }
}
