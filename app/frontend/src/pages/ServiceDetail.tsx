import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { OfferedServiceAPI } from "@/api"
import type { TOfferedService } from "@/api/offeredService/types"
import { DAYS_OF_WEEK } from "@/constants/petService"
import Navbar from "@/components/Navbar"

const ServiceDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [offeredService, setOfferedService] = useState<TOfferedService | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadService = async () => {
      if (!id) {
        setError("Service ID is required")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch all offered services and find the one with matching ID
        const allOfferedServices = await OfferedServiceAPI.fetchOfferedServices()
        const serviceData = allOfferedServices.find(service => service.id === parseInt(id))
        
        if (!serviceData) {
          setError("Service not found")
          return
        }

        setOfferedService(serviceData)
      } catch (err) {
        console.error("Failed to load service:", err)
        setError("Failed to load service details")
      } finally {
        setIsLoading(false)
      }
    }

    loadService()
  }, [id])

  const getAvailabilityDays = (days: number[]) => {
    return days
      .map(day => DAYS_OF_WEEK.find(d => d.value === day)?.label)
      .filter(Boolean)
  }

  const handleBookService = () => {
    if (offeredService?.id) {
      navigate(`/booking/${offeredService.id}`)
    }
  }

  const handleContactProvider = () => {
    // Navigate to contact page or show contact modal
    console.log("Contact provider:", offeredService?.petcaretaker.id)
    // You can implement contact logic here
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

  if (error || !offeredService) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{error || "Service not found"}</h3>
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

  const availabilityDays = getAvailabilityDays(offeredService.day)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate("/services")}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Services
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{offeredService.service.name}</h1>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Service Overview */}
            <div className="bg-white rounded-lg shadow p-6">
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
                  <p className="text-gray-600 font-semibold text-lg text-blue-600">
                    ${offeredService.rate} per hour
                  </p>
                </div>
              </div>
            </div>

            {/* Provider Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Provider</h2>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600">
                    {offeredService.petcaretaker.profile.first_name.charAt(0)}
                    {offeredService.petcaretaker.profile.last_name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {offeredService.petcaretaker.profile.first_name} {offeredService.petcaretaker.profile.last_name}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {offeredService.petcaretaker.yoe} years of experience in pet care
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Professional Pet Caretaker
                  </div>
                </div>
              </div>
            </div>

            {/* Service Areas */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Areas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {offeredService.locations.map((location) => (
                  <div
                    key={location.id}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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
            <div className="bg-white rounded-lg shadow p-6">
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
                      <div className="font-medium text-sm">
                        {day.label.substring(0, 3)}
                      </div>
                      <div className="mt-1 text-xs">
                        {isAvailable ? "Available" : "Not Available"}
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {availabilityDays.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Available on:</span> {availabilityDays.join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book This Service</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Hourly Rate:</span>
                  <span className="font-semibold text-gray-900">${offeredService.rate}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Experience:</span>
                  <span className="font-semibold text-gray-900">
                    {offeredService.petcaretaker.yoe} years
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Service Areas:</span>
                  <span className="font-semibold text-gray-900">
                    {offeredService.locations.length} location{offeredService.locations.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleBookService}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Book Now
                </button>
                
                <button
                  onClick={handleContactProvider}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Contact Provider
                </button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Trusted provider
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure booking
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Your pets will love it
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceDetail