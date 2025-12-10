import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "@/components/Navbar"
import type { TBooking, TBookings, TBookingStatus } from "@/api/booking/types"
import { BookingAPI } from "@/api"
import { useUser } from "@/context/UserContext"
import { BOOKING_STATUS } from "@/constants/booking"
import Modal, { type TModalHandle } from "@/components/ui/Modal"
import { formatDateTime } from "@/utils/formatDateTime"

const Bookings = () => {
  const {
    user: { type },
  } = useUser()

  const bookingModalRef = useRef<TModalHandle>(null)
  const [activeTab, setActiveTab] = useState<"all" | TBookingStatus>("all")
  const [bookings, setBookings] = useState<TBookings>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [booking, setBooking] = useState<TBooking>()

  const fetchBookings = async () => {
    setLoading(true)
    await BookingAPI.fetchBookings()
      .then((data) => setBookings(data))
      .catch((err) => {
        console.error("Error fetching bookings: ", err)
        setError("Failed to load bookings. Please try again later.")
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "all") return true
    return booking.status === activeTab
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      // Confirmed/Active Statuses (Ready to proceed)
      case "accepted":
      case "confirmed":
      case "upcoming":
        return "bg-cyan-100 text-cyan-800"

      // Action/Waiting Statuses (Needs a step to proceed)
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "pendingpayment":
        return "bg-orange-100 text-orange-800"

      // Positive/Final Statuses (Service rendered/paid)
      case "completed":
        return "bg-green-100 text-green-800"

      // Negative/Terminal Statuses (No longer active)
      case "cancelled":
      case "declined":
        return "bg-red-100 text-red-800"

      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTabCount = (status: TBookingStatus) => {
    return bookings.filter((booking) => booking.status === status).length
  }

  const handleViewBooking = (booking: TBooking) => {
    setBooking(booking)
    bookingModalRef.current?.openModal()
  }

  const handleAcceptBooking = async (id: number) => {
    await BookingAPI.acceptBooking(id)
      .then(() => fetchBookings())
      .catch((err) => alert(err.message))
  }

  const handleDeclineBooking = async (id: number) => {
    await BookingAPI.declineBooking(id)
      .then(() => fetchBookings())
      .catch((err) => alert(err.message))
  }

  const handleCancelBooking = async (id: number) => {
    await BookingAPI.cancelBooking(id)
      .then(() => fetchBookings())
      .catch((err) => alert(err.message))
  }

  const handleCompleteBooking = async (id: number) => {
    await BookingAPI.completeBooking(id)
      .then(() => fetchBookings())
      .catch((err) => alert(err.message))
  }

  const navigate = useNavigate()
  const handlePayBooking = (id: number, booking: TBooking) => {
    navigate("/booking/payment", {
      state: {
        bookingId: id,
        offeredServiceId: booking.offered_service.id,
        date: booking.date,
      },
    })
  }

  return (
    <>
      {loading && (
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">My Bookings</h1>
            <div className="text-gray-500 mt-12">Loading bookings...</div>
          </div>
        </div>
      )}
      {error && (
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">My Bookings</h1>
            <div className="text-red-600 mt-12 font-medium">{error}</div>
          </div>
        </div>
      )}
      {!loading && !error && (
        <div className="min-h-screen bg-gray-50">
          <Navbar />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">My Bookings</h1>
              <p className="text-gray-600">Manage and view your pet care service bookings</p>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    key={"all"}
                    onClick={() => setActiveTab("all")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                      activeTab === "all"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    All ({bookings.length})
                  </button>
                  {Object.entries(BOOKING_STATUS).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key as TBookingStatus)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                        activeTab === key
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {value} ({getTabCount(key as TBookingStatus)})
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="mx-auto h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m-6 0h6"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                  <p className="text-gray-500 mb-4">
                    You don't have any {activeTab === "all" ? "" : activeTab} bookings yet.
                  </p>
                  <Link
                    to="/services"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                  >
                    Browse Services
                  </Link>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Service / Pet
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date / {type === "owner" ? "Provider" : "Pet Owner"}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.offered_service.service.name}
                          </div>
                          <div className="text-sm text-gray-500">For: {booking.pet.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(booking.date).toLocaleDateString()}
                          </div>
                          {type === "owner" ? (
                            <div className="text-sm text-gray-500">
                              By: {booking.offered_service.caretaker_id}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">By: {booking.pet.owner_id}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusColor(booking.status)}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleViewBooking(booking)}
                            className="text-gray-500 hover:text-gray-700 text-sm mr-3"
                          >
                            View
                          </button>
                          {(type === "owner" &&
                            (booking.status === "pending" ||
                              booking.status === "pendingpayment" ||
                              booking.status === "accepted")) ||
                            (type === "caretaker" && booking.status === "accepted" && (
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium mr-3"
                              >
                                Cancel
                              </button>
                            ))}
                          {type === "caretaker" && booking.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleAcceptBooking(booking.id)}
                                className="text-green-600 hover:text-green-800 text-sm font-medium mr-3"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleDeclineBooking(booking.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium mr-3"
                              >
                                Decline
                              </button>
                            </>
                          )}
                          {type === "caretaker" && booking.status === "accepted" && (
                            <button
                              onClick={() => handleCompleteBooking(booking.id)} // Assuming "Confirm" means "Mark as Complete" post-service
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3"
                            >
                              Confirm
                            </button>
                          )}
                          {type === "owner" && booking.status === "pendingpayment" && (
                            <button
                              onClick={() => handlePayBooking(booking.id, booking)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3"
                            >
                              Pay
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {booking && (
        <Modal
          ref={bookingModalRef}
          header={`Details for Booking #${booking.id}`}
          actionButtons={[
            {
              label: "Close",
              onClick: () => bookingModalRef.current?.closeModal(),
              variant: "secondary",
            },
          ]}
        >
          <div className="space-y-4 text-sm text-gray-700">
            <h3 className="font-semibold text-gray-900 border-b pb-1">Service & Status</h3>
            <div className="grid grid-cols-2 gap-y-2">
              <div>
                <span className="font-medium">Service:</span> {booking.offered_service.service.name}
              </div>
              <div>
                <span className="font-medium">Provider ID:</span>{" "}
                {booking.offered_service.caretaker_id}
              </div>
              <div>
                <span className="font-medium">Date:</span> {formatDateTime(booking.date)}
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <span className="ml-2 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize bg-blue-100 text-blue-800">
                  {booking.status.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            <h3 className="font-semibold text-gray-900 border-b pb-1 pt-2">Pet Details</h3>
            <div className="grid grid-cols-2 gap-y-2">
              <div>
                <span className="font-medium">Pet Name:</span> {booking.pet.name}
              </div>
              <div>
                <span className="font-medium">Species:</span> {booking.pet.species}
              </div>
              <div>
                <span className="font-medium">Breed:</span> {booking.pet.breed}
              </div>
              <div>
                <span className="font-medium">Age:</span> {booking.pet.age} years
              </div>
            </div>

            <div className="pt-2">
              <p>
                <span className="font-medium">Health:</span> {booking.pet.health || "N/A"}
              </p>
              <p>
                <span className="font-medium">Preferences:</span> {booking.pet.preferences || "N/A"}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default Bookings
