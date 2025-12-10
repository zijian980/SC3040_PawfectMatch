export type BookingStatus = "Confirmed" | "Pending"

export interface BookingSummary {
  readonly time: string
  readonly label: string
  readonly status: BookingStatus
}

export interface DashboardSnapshot {
  readonly revenue: {
    readonly amount: number
    readonly currency: string
    readonly changePercentage: number
  }
  readonly bookings: readonly BookingSummary[]
}

const mockSnapshot: DashboardSnapshot = {
  revenue: {
    amount: 0,
    currency: "SGD",
    changePercentage: 0,
  },
  bookings: [
    { time: "Today · 4:00 PM", label: "Full Groom", status: "Confirmed" },
    { time: "Thu · 10:30 AM", label: "Walk (30m)", status: "Pending" },
    { time: "Fri · 2:00 PM", label: "Vet check-in", status: "Confirmed" },
    { time: "Sat · 10:30 AM", label: "Walk (30m)", status: "Pending" },
    { time: "Sun · 2:00 PM", label: "Vet check-in", status: "Confirmed" },
  ],
}

export async function fetchDashboardSnapshot(): Promise<DashboardSnapshot> {
  console.warn("Implement real API call.")
  return mockSnapshot
}
