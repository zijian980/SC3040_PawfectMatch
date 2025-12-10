import { Link } from "react-router-dom"
import AppLogo from "@/components/AppLogo"

const Home = () => {
  const features = [
    {
      title: "Professional Pet Care",
      description: "Connect with certified and experienced pet care professionals in your area",
      icon: "🐕",
    },
    {
      title: "Trusted Reviews",
      description: "Read genuine reviews from pet owners to make informed decisions",
      icon: "⭐",
    },
    {
      title: "Easy Booking",
      description: "Book services seamlessly with our user-friendly platform",
      icon: "📅",
    },
    {
      title: "Secure Payments",
      description: "Safe and secure payment processing for peace of mind",
      icon: "💳",
    },
  ]

  const services = [
    { name: "Dog Walking", icon: "🚶", description: "Daily walks for your furry friends" },
    { name: "Pet Sitting", icon: "🏠", description: "In-home care when you're away" },
    { name: "Pet Grooming", icon: "✂️", description: "Professional grooming services" },
    { name: "Dog Training", icon: "🎾", description: "Professional training programs" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="w-full shadow-md flex items-center justify-between px-8 py-5">
        <AppLogo />
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to <span className="text-yellow-300">PawfectMatch</span>
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with trusted pet care professionals in your area. From dog walking to
              grooming, find the perfect match for your furry family members.
            </p>
            <div className="space-x-4">
              <Link
                to="/services"
                className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors inline-block"
              >
                Browse Services
              </Link>
              <Link
                to="/signup"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors inline-block"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose PawfectMatch?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make it easy to find reliable, loving care for your pets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Preview Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the most requested pet care services in your area
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="text-3xl mb-3">{service.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/services"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
            >
              View All Services
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of pet owners who trust PawfectMatch for their pet care needs
          </p>
          <div className="space-x-4">
            <Link
              to="/signup"
              className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors inline-block"
            >
              Sign Up Now
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors inline-block"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
