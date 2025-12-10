import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { OfferedServiceAPI } from "@/api"
import type { TOfferedService } from "@/api/offeredService/types"
import Navbar from "@/components/Navbar"

const Booking = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [duration, setDuration] = useState("1")
  const [notes, setNotes] = useState("")
  const [service, setService] = useState<TOfferedService | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadService = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        const allServices = await OfferedServiceAPI.fetchOfferedServices()
        const foundService = allServices.find((s) => s.id === parseInt(id))
        setService(foundService || null)
      } catch (err) {
        console.error("Failed to load service:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadService()
  }, [id])

  // Default availability times - you can make this dynamic based on service data
  const defaultAvailability = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate || !selectedTime || !service) {
      alert("Please select both date and time")
      return
    }

    // Mock booking submission
    alert(
      `Booking confirmed!\n\nService: ${service.service.name}\nProvider: ${service.petcaretaker.profile.first_name} ${service.petcaretaker.profile.last_name}\nDate: ${selectedDate}\nTime: ${selectedTime}\nDuration: ${duration} hour(s)\nTotal: $${service.rate * parseInt(duration)}`,
    )

    navigate("/profile")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading service details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Service not found</h3>
            <button
              onClick={() => navigate("/services")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Services
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
          >
            ← Back to Service Details
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Book Service</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Details</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Choose a time</option>
                  {defaultAvailability.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (hours)
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="0.5">30 minutes</option>
                  <option value="1">1 hour</option>
                  <option value="1.5">1.5 hours</option>
                  <option value="2">2 hours</option>
                  <option value="3">3 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any special requirements or notes for the service provider..."
                />
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>

          {/* Service Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Summary</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">{service.service.name}</h4>
                <p className="text-gray-600">
                  by {service.petcaretaker.profile.first_name}{" "}
                  {service.petcaretaker.profile.last_name}
                </p>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rate per hour:</span>
                  <span className="font-medium">${service.rate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{duration} hour(s)</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span>${service.rate * parseFloat(duration)}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">
                  📍 {service.locations.map((loc) => loc.name).join(", ")}
                </p>
              </div>

              {selectedDate && selectedTime && (
                <div className="border-t pt-4 bg-blue-50 p-3 rounded">
                  <p className="text-sm font-medium text-blue-900">Selected Time:</p>
                  <p className="text-sm text-blue-800">
                    {new Date(selectedDate).toLocaleDateString()} at {selectedTime}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Booking
