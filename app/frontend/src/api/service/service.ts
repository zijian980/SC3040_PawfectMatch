import { http } from "../client"
import { API } from "../endpoints"
import type { TServiceList } from "./types"

export const fetchServiceList = async (): Promise<TServiceList> => {
  try {
    const res = await http.get<TServiceList>(API.SERVICE.GET)
    console.log("GET service list: ", res)
    return res.data
  } catch (err) {
    console.log(`GET service list: ${err}`)
    throw new Error("Failed to fetch list of services")
  }
}
