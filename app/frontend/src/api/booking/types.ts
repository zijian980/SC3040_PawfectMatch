import type { TService } from "../service/types"

export type TBookingStatus =
  | "pending"
  | "cancelled"
  | "accepted"
  | "declined"
  | "pendingpayment"
  | "completed"

type TBookingOfferedService = {
  id: number
  caretaker_id: string
  service: TService
}

type TBookingPet = {
  id: number
  name: string
  species: string
  breed: string
  age: number
  health: string
  preferences: string
  owner_id: string
}

export type TBooking = {
  id: number
  status: TBookingStatus
  date: string
  offered_service: TBookingOfferedService
  pet: TBookingPet
}

export type TBookings = TBooking[]

export type TAddBookingRequest = {
  date: string
  offered_service_id: number
  pet_id: number
}
