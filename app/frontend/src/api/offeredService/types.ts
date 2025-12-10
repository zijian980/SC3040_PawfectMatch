import type { TLocations } from "../location/types"
import type { TService } from "../service/types"

export type TServiceProvider = {
  id: string
  yoe: number
  profile: {
    first_name: string
    last_name: string
  }
}

export type TOfferedService = {
  id: number
  service: TService
  petcaretaker: TServiceProvider
  locations: TLocations
  day: number[]
  rate: number
}

export type TOfferedServices = TOfferedService[]

export type TAddOfferedServiceRequest = {
  service_id: number
  rate: number
  day: number[]
  locations: number[]
}

export type TUpdateOfferedServiceRequest = {
  id: number
  rate: number
  day: number[]
  locations: number[]
}
