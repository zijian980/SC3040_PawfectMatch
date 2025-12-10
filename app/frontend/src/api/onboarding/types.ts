import type { TUserRole } from "../profile/types"

export type TOnboardingStatus = {
  onboarded: boolean
}

export type TProfileOnboardRequest = {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  phone: string
  address: string
  type: TUserRole
  yearsOfExperience?: number
}

export type TPetOnboardRequest = {
  name: string
  species: string
  breed: string
  age: number
  health: string
  preferences: string
}

export type TServiceOnboardRequest = {
  serviceId: number
  rate: number
  day: number[]
  locations: number[]
}[]
