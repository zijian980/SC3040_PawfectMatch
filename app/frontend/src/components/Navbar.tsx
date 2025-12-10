import { Link, useNavigate } from "react-router-dom"
import AppLogo from "./AppLogo"
import { userPlaceholderUrl } from "@/assets"
import { useUser } from "@/context/UserContext"
import { AuthAPI } from "@/api"
import { useEffect } from "react"

const Navbar = () => {
  const navigate = useNavigate()
  const {
    user: { profile_picture, type },
  } = useUser()

  const handleLogout = () => {
    AuthAPI.logout().then(() => navigate("/login", { replace: true }))
  }

  useEffect(() => {
    AuthAPI.isAuthenticated().then(({ authenticated }) => {
      console.log("Authenticated: ", authenticated)
      if (!authenticated) navigate("/login", { replace: true })
    })
  }, [])

  return (
    <nav className="w-full shadow-md flex items-center justify-between px-8 py-5">
      <AppLogo />

      <div className="flex items-center gap-10">
        <Link to="/dashboard" className="font-medium hover:underline">
          Dashboard
        </Link>
        {type === "owner" && (
          <Link to="/services" className="font-medium hover:underline">
            Browse Services
          </Link>
        )}
        <Link to="/bookings" className="font-medium hover:underline">
          Bookings
        </Link>

        <div className="relative group">
          <button className="h-10 w-10 hover:cursor-pointer" aria-label="User profile">
            <img
              src={profile_picture || userPlaceholderUrl}
              alt="Profile"
              className="h-full w-full object-cover rounded-full"
            />
          </button>

          <div className="absolute right-0 z-10 hidden bg-grey-200 group-hover:block bg-white shadow-2xl min-w-[150px] rounded-md border border-gray-100">
            <ul>
              <li>
                <Link
                  to="/profile"
                  className="block w-full px-5 py-3 rounded-md hover:bg-gray-100 hover:cursor-pointer"
                >
                  Profile
                </Link>
              </li>
              <li
                className="px-5 py-3 rounded-md hover:bg-gray-100 hover:cursor-pointer"
                onClick={() => handleLogout()}
              >
                <button className="hover:cursor-pointer">Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
