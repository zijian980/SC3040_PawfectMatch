import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { CalendarDays, Sparkles, Tag } from "lucide-react"

import "./NewBooking.css"
import type { TOfferedService } from "@/api/offeredService/types"
import { BookingAPI, OfferedServiceAPI, PetAPI } from "@/api"
import { DAYS_OF_WEEK } from "@/constants/petService"
import Navbar from "@/components/Navbar"

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value)

const NewBooking = () => {
  const { id } = useParams()
  const [offeredService, setOfferedService] = useState<TOfferedService | null>(null)
  const [petId, setPetId] = useState<number>()

  const navigate = useNavigate()
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [promoCode, setPromoCode] = useState("")

  const hasSelections = Boolean(date && time)
  const formattedDate = date
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        weekday: "short",
      }).format(new Date(date))
    : "No date"

  const handleConfirm = () => {
    if (!hasSelections) return

    BookingAPI.addBooking({
      date: `${date}T${time}`,
      offered_service_id: Number(id),
      pet_id: Number(petId),
    }).then(() => {
      navigate("/bookings")
    })
  }

  const [availabilityDays, setAvailabilityDays] = useState<string[]>([])

  useEffect(() => {
    const loadService = async () => {
      if (!id) {
        return
      }

      try {
        // Fetch all offered services and find the one with matching ID
        const allOfferedServices = await OfferedServiceAPI.fetchOfferedServices()
        const serviceData = allOfferedServices.find((service) => service.id === parseInt(id))

        if (!serviceData) {
          return
        }

        setOfferedService(serviceData)

        setAvailabilityDays(getAvailabilityDays(serviceData.day) as string[])
      } catch (err) {
        console.error("Failed to load service:", err)
      }
    }

    loadService()

    PetAPI.fetchPetsByOwner().then((data) => setPetId(data[0].id))
  }, [id])

  const getAvailabilityDays = (days: number[]) => {
    return days.map((day) => DAYS_OF_WEEK.find((d) => d.value === day)?.label).filter(Boolean)
  }

  return (
    <main id="bookingPage">
      <Navbar />

      <div className="bookingPage">
        <div className="bookingLayout" role="presentation">
          <section className="mainColumn">
            <article className="panel">
              {offeredService && (
                <>
                  <div className="">
                    <div className="max-w-7xl mx-auto px-4 sm:px-4 py-6">
                      <button
                        onClick={() => navigate("/services")}
                        className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        Back to Services
                      </button>

                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <h1 className="text-3xl font-bold text-gray-900">
                            {offeredService.service.name}
                          </h1>
                          <p className="mt-2 text-gray-600">Professional pet care service</p>
                        </div>
                        <div className="mt-4 lg:mt-0">
                          <span className="text-3xl font-bold text-blue-600">
                            ${offeredService.rate}/hr
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="max-w-7xl mx-auto px-4 sm:px-4 py-8">
                    {/* Service Overview */}
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Overview</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Service Type */}
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">Service Type</h3>
                          <p className="text-gray-600">{offeredService.service.name}</p>
                        </div>

                        {/* Rate */}
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">Hourly Rate</h3>
                          <p className="text-gray-600 font-semibold text-lg">
                            ${offeredService.rate} per hour
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Provider Information */}
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        About the Provider
                      </h2>
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xl font-bold text-blue-600">
                            {offeredService.petcaretaker.profile.first_name.charAt(0)}
                            {offeredService.petcaretaker.profile.last_name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {offeredService.petcaretaker.profile.first_name}{" "}
                            {offeredService.petcaretaker.profile.last_name}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {offeredService.petcaretaker.yoe} years of experience in pet care
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            Professional Pet Caretaker
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Service Areas */}
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Areas</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {offeredService.locations.map((location) => (
                          <div
                            key={location.id}
                            className="flex items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <svg
                              className="w-5 h-5 text-gray-400 mr-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span className="text-gray-700 font-medium">{location.name}</span>
                          </div>
                        ))}
                      </div>
                      {offeredService.locations.length === 0 && (
                        <p className="text-gray-500 italic">No specific service areas listed</p>
                      )}
                    </div>

                    {/* Availability Schedule */}
                    <div className="rounded-lg p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                        {DAYS_OF_WEEK.map((day) => {
                          const isAvailable = offeredService.day.includes(day.value)
                          return (
                            <div
                              key={day.value}
                              className={`text-center p-3 rounded-lg border-2 ${
                                isAvailable
                                  ? "bg-green-50 border-green-200 text-green-800"
                                  : "bg-gray-50 border-gray-200 text-gray-400"
                              }`}
                            >
                              <div className="font-medium text-sm">{day.label.substring(0, 3)}</div>
                              <div className="mt-1 text-xs">
                                {isAvailable ? "Available" : "Not Available"}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {availabilityDays?.length > 0 && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">Available on:</span>{" "}
                            {availabilityDays.join(", ")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </article>

            <article className="panel">
              <header className="panelHeader">
                <h2>
                  <CalendarDays aria-hidden="true" strokeWidth={1.6} /> Date &amp; Time
                </h2>
                <p>Select a date and a convenient timeslot.</p>
              </header>

              <div className="scheduleSection">
                <label className="dateField" htmlFor="booking-date">
                  <span>Date</span>
                  <input
                    id="booking-date"
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                  />
                </label>

                <div className="timeField">
                  <span>Timeslot</span>
                  <div className="timeGrid" role="radiogroup" aria-label="Choose a timeslot">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = slot === time
                      return (
                        <button
                          key={slot}
                          type="button"
                          className={`timeCell ${isSelected ? "isSelected" : ""}`}
                          onClick={() => setTime(slot)}
                          aria-pressed={isSelected}
                        >
                          {slot}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </article>
          </section>

          <aside className="summaryColumn" aria-label="Booking summary">
            <div className="summaryCard">
              <header className="panelHeader">
                <h2>Summary</h2>
                <p>Review your selection before confirming.</p>
              </header>

              <div className="summaryBlock">
                <div className="summaryLine">
                  <CalendarDays aria-hidden="true" strokeWidth={1.6} />
                  <div>
                    <span>{formattedDate}</span>
                    <span className="summarySub">{time || "No timeslot selected"}</span>
                  </div>
                </div>
                <div className="summaryLine">
                  <Sparkles aria-hidden="true" strokeWidth={1.6} />
                  <div>
                    <span>{offeredService?.service.name}</span>
                  </div>
                </div>
              </div>

              {offeredService && (
                <dl className="totals">
                  <div>
                    <dt>Base price</dt>
                    <dd>{formatCurrency(offeredService.rate)}</dd>
                  </div>
                  <div>
                    <dt>Add-ons</dt>
                    <dd>None</dd>
                  </div>
                  <div className="promoRow">
                    <dt>Subtotal</dt>
                    <dd>{formatCurrency(offeredService.rate)}</dd>
                  </div>
                  <div className="promoInput">
                    <Tag aria-hidden="true" strokeWidth={1.6} />
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(event) => setPromoCode(event.target.value)}
                    />
                  </div>
                  <div>
                    <dt>Total</dt>
                    <dd>{formatCurrency(offeredService.rate)}</dd>
                  </div>
                </dl>
              )}

              <button
                type="button"
                className="summaryButton"
                disabled={!hasSelections}
                onClick={handleConfirm}
              >
                Confirm booking
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default NewBooking
