import { http } from "../client"
import { API } from "../endpoints"
import type { TAddBookingRequest, TBooking, TBookings } from "./types"

export const fetchBookings = async (): Promise<TBookings> => {
  try {
    const res = await http.get<TBookings>(API.BOOKING.BASE)
    console.log("GET bookings: ", res)
    return res.data
  } catch (err) {
    console.log(`GET bookings: ${err}`)
    throw new Error("Failed to fetch bookings")
  }
}

export const fetchBookingDetails = async (id: number): Promise<TBooking> => {
  try {
    const res = await http.get<TBooking>(`${API.BOOKING.BASE}/${id}`)
    console.log("GET booking details: ", res)
    return res.data
  } catch (err) {
    console.log(`GET booking details: ${err}`)
    throw new Error("Failed to fetch booking details")
  }
}

export const addBooking = async (data: TAddBookingRequest): Promise<{ booking_id: string }> => {
  try {
    const res = await http.post<{ booking_id: string }>(API.BOOKING.BASE, data)
    console.log("POST add booking: ", res)
    return res.data
  } catch (err) {
    console.log(`POST add booking: ${err}`)
    throw new Error("Failed to create booking")
  }
}

export const acceptBooking = async (id: number): Promise<void> => {
  try {
    const res = await http.post<void>(`${API.BOOKING.BASE}/${id}${API.BOOKING.ACCEPT}`)
    console.log("POST accept booking: ", res)
    return res.data
  } catch (err) {
    console.log(`POST accept booking: ${err}`)
    throw new Error("Failed to accept booking")
  }
}

export const declineBooking = async (id: number): Promise<void> => {
  try {
    const res = await http.post<void>(`${API.BOOKING.BASE}/${id}${API.BOOKING.DECLINE}`)
    console.log("POST decline booking: ", res)
    return res.data
  } catch (err) {
    console.log(`POST decline booking: ${err}`)
    throw new Error("Failed to decline booking")
  }
}

export const cancelBooking = async (id: number): Promise<void> => {
  try {
    const res = await http.post<void>(`${API.BOOKING.BASE}/${id}${API.BOOKING.CANCEL}`)
    console.log("POST cancel booking: ", res)
    return res.data
  } catch (err) {
    console.log(`POST cancel booking: ${err}`)
    throw new Error("Failed to cancel booking")
  }
}

export const completeBooking = async (id: number): Promise<void> => {
  try {
    const res = await http.post<void>(`${API.BOOKING.BASE}/${id}${API.BOOKING.COMPLETE}`)
    console.log("POST complete booking: ", res)
    return res.data
  } catch (err) {
    console.log(`POST complete booking: ${err}`)
    throw new Error("Failed to complete booking")
  }
}

export const payBooking = async (id: number): Promise<void> => {
  try {
    const res = await http.post<void>(`${API.BOOKING.BASE}/${id}${API.BOOKING.PAY}`)
    console.log("POST pay booking: ", res)
    return res.data
  } catch (err) {
    console.log(`POST pay booking: ${err}`)
    throw new Error("Failed to pay for booking")
  }
}
