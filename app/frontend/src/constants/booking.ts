import type { TBookingStatus } from "@/api/booking/types"

export const BOOKING_STATUS: { [key in TBookingStatus]: string } = {
  pending: "Pending",
  cancelled: "Cancelled",
  accepted: "Accepted",
  declined: "Declined",
  pendingpayment: "PendingPayment",
  completed: "Completed",
}
