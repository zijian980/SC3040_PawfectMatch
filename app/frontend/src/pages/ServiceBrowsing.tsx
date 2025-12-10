import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { OfferedServiceAPI, LocationAPI } from "@/api"
import type { TOfferedServices } from "@/api/offeredService/types"
import type { TLocations } from "@/api/location/types"
import { DAYS_OF_WEEK } from "@/constants/petService"
import Navbar from "@/components/Navbar"

// Service category icons and colors
const serviceIcons: { [key: string]: { icon: string; color: string; bgColor: string } } = {
  "dog walking": { icon: "🐕‍🦺", color: "text-green-600", bgColor: "bg-green-100" },
  "pet sitting": { icon: "🏠", color: "text-blue-600", bgColor: "bg-blue-100" },
  "pet grooming": { icon: "✂️", color: "text-purple-600", bgColor: "bg-purple-100" },
  "dog training": { icon: "🎾", color: "text-orange-600", bgColor: "bg-orange-100" },
  "pet boarding": { icon: "🏨", color: "text-indigo-600", bgColor: "bg-indigo-100" },
  "pet photography": { icon: "📸", color: "text-pink-600", bgColor: "bg-pink-100" },
  default: { icon: "🐾", color: "text-gray-600", bgColor: "bg-gray-100" },
}

const ServiceBrowsing = () => {
  const [offeredServices, setOfferedServices] = useState<TOfferedServices>([])
  const [locations, setLocations] = useState<TLocations>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [maxPrice, setMaxPrice] = useState(1000)
  const [sortBy, setSortBy] = useState("rating")
  const [showFilters, setShowFilters] = useState(false)
  const navigate = useNavigate()

  const categories = [
    "all",
    "walking",
    "sitting",
    "grooming",
    "training",
    "veterinary",
    "transportation",
  ]
  const sortOptions = [
    { value: "rating", label: "Highest Rated" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "reviews", label: "Most Reviewed" },
    { value: "name", label: "Name A-Z" },
  ]

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [servicesData, locationsData] = await Promise.all([
          OfferedServiceAPI.fetchOfferedServices(),
          LocationAPI.fetchLocations(),
        ])
        setOfferedServices(servicesData)
        setLocations(locationsData)
      } catch (err) {
        console.error("Failed to load services:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Filter and sort services
  const filteredServices = offeredServices
    .filter((service) => {
      const matchesSearch =
        service.service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${service.petcaretaker.profile.first_name} ${service.petcaretaker.profile.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())

      const matchesCategory =
        selectedCategory === "all" ||
        service.service.name.toLowerCase().includes(selectedCategory.toLowerCase())

      const matchesLocation =
        selectedLocation === "all" ||
        service.locations.some((loc) => loc.id.toString() === selectedLocation)

      const matchesPrice = service.rate <= maxPrice

      return matchesSearch && matchesCategory && matchesLocation && matchesPrice
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.rate - b.rate
        case "price-high":
          return b.rate - a.rate
        case "name":
          return a.service.name.localeCompare(b.service.name)
        default:
          return 0 // Default sort by rating would need rating data
      }
    })

  const getAvailabilityText = (days: number[]) => {
    if (days.length === 7) return "Available every day"
    if (days.length === 0) return "No availability set"

    const dayNames = days
      .map((day) => DAYS_OF_WEEK.find((d) => d.value === day)?.label)
      .filter(Boolean)
      .join(", ")
    return dayNames
  }

  const getLocationText = (serviceLocations: TLocations) => {
    if (serviceLocations.length === 0) return "Location not specified"
    if (serviceLocations.length === 1) return serviceLocations[0].name
    return `${serviceLocations[0].name} (+${serviceLocations.length - 1} more)`
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
            <div className="mt-6 space-y-2">
              <p className="text-xl font-semibold text-gray-700">Finding amazing pet services...</p>
              <p className="text-gray-500">
                🐾 Just a moment while we fetch the best care for your furry friends!
              </p>
            </div>
          </div>
        </div>
      </>
    )
  }

  const getServiceIcon = (serviceName: string) => {
    const name = serviceName.toLowerCase()
    for (const [key, value] of Object.entries(serviceIcons)) {
      if (name.includes(key)) return value
    }
    return serviceIcons.default
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navbar />

      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <span className="text-5xl">🐾</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Amazing Pet Care Services
            </h1>
            <p className="text-lg md:text-xl text-purple-100 mb-6 max-w-2xl mx-auto">
              Find trusted, loving pet care services in your area ✨
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                🏆 Trusted Providers
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                💝 Loving Care
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                ⭐ Top Rated
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-16 right-10 w-24 h-24 bg-pink-300 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute bottom-8 left-1/4 w-20 h-20 bg-blue-300 rounded-full opacity-20 animate-pulse"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg border border-purple-100 p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
                  <span className="mr-2">🔍</span>
                  Filters
                </h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden px-4 py-2 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  {showFilters ? "Hide" : "Show"}
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
                {/* Search */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="mr-2">🔎</span>
                    Search Services
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search services or providers..."
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm placeholder-gray-400 transition-all duration-200"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400">
                      🔍
                    </div>
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="mr-2">🏷️</span>
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gradient-to-r from-white to-blue-50 appearance-none cursor-pointer transition-all duration-200"
                    >
                      <option value="all">🌟 All Categories</option>
                      {categories.slice(1).map((category) => (
                        <option key={category} value={category}>
                          {getServiceIcon(category).icon}{" "}
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 pointer-events-none">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="mr-2">📍</span>
                    Location
                  </label>
                  <div className="relative">
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gradient-to-r from-white to-green-50 appearance-none cursor-pointer transition-all duration-200"
                    >
                      <option value="all">🌍 All Locations</option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.id.toString()}>
                          📍 {location.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 pointer-events-none">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center justify-between">
                    <span className="flex items-center">
                      <span className="mr-2">💰</span>
                      Max Price
                    </span>
                    <span className="text-lg font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                      ${maxPrice}
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full h-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #fbbf24 0%, #f59e0b ${(maxPrice / 500) * 100}%, #fef3c7 ${(maxPrice / 500) * 100}%, #fef3c7 100%)`,
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>$0</span>
                      <span>$250</span>
                      <span>$500</span>
                    </div>
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="mr-2">📊</span>
                    Sort By
                  </label>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gradient-to-r from-white to-indigo-50 appearance-none cursor-pointer transition-all duration-200"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400 pointer-events-none">
                      ▼
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="lg:w-3/4">
            <div className="mb-8 flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {filteredServices.length}
                </div>
                <p className="text-lg font-semibold text-gray-700">
                  Amazing service{filteredServices.length !== 1 ? "s" : ""} found! ✨
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>🎯</span>
                <span>Perfect matches</span>
              </div>
            </div>

            {filteredServices.length === 0 ? (
              <div className="text-center py-20 bg-gradient-to-br from-white to-purple-50 rounded-3xl border-2 border-purple-100">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No services found</h3>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                  We couldn't find any services matching your criteria. Try adjusting your filters!
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm">
                    🎯 Adjust filters
                  </span>
                  <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm">
                    🔄 Try different search
                  </span>
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm">
                    📍 Change location
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredServices.map((service) => {
                  const serviceIcon = getServiceIcon(service.service.name)
                  return (
                    <div
                      key={service.id}
                      onClick={() => navigate(`/booking/${service.id}`)}
                      className="group bg-gradient-to-br from-white via-white to-gray-50 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-purple-200 transform hover:-translate-y-2"
                    >
                      {/* Colorful Header */}
                      <div
                        className={`p-6 bg-gradient-to-br ${serviceIcon.bgColor.replace("bg-", "from-")} to-white relative overflow-hidden`}
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full -translate-y-8 translate-x-8"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-4 -translate-x-4"></div>

                        <div className="relative flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`text-3xl p-3 ${serviceIcon.bgColor} ${serviceIcon.color} rounded-2xl`}
                            >
                              {serviceIcon.icon}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-800 leading-tight group-hover:text-gray-900">
                                {service.service.name}
                              </h3>
                              <div className="flex items-center mt-1">
                                <span className="text-sm text-gray-600">⭐ Premium Service</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                              ${service.rate}/hr
                            </div>
                          </div>
                        </div>

                        {/* Provider Info */}
                        <div className="flex items-center space-x-3 relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-lg font-bold text-white">
                              {service.petcaretaker.profile.first_name.charAt(0)}
                              {service.petcaretaker.profile.last_name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">
                              {service.petcaretaker.profile.first_name}{" "}
                              {service.petcaretaker.profile.last_name}
                            </p>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-purple-600">
                                🎓 {service.petcaretaker.yoe} years experience
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Service Details */}
                      <div className="p-6 space-y-4">
                        {/* Location */}
                        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                          <div className="bg-green-500 text-white p-2 rounded-xl">📍</div>
                          <div>
                            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                              Location
                            </p>
                            <p className="text-sm font-bold text-gray-800">
                              {getLocationText(service.locations)}
                            </p>
                          </div>
                        </div>

                        {/* Availability */}
                        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                          <div className="bg-blue-500 text-white p-2 rounded-xl">🕒</div>
                          <div>
                            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                              Availability
                            </p>
                            <p className="text-sm font-bold text-gray-800">
                              {getAvailabilityText(service.day)}
                            </p>
                          </div>
                        </div>

                        {/* View Details Button */}
                        <div className="pt-4">
                          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-2xl text-center font-bold transition-all duration-200 group-hover:shadow-lg group-hover:scale-105">
                            <span className="flex items-center justify-center space-x-2">
                              <span>✨ View Details</span>
                              <span className="transform group-hover:translate-x-1 transition-transform">
                                →
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceBrowsing
