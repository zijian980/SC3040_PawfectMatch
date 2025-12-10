import {
  Bookings,
  Dashboard,
  Home,
  Login,
  NewBooking,
  Onboarding,
  Payment,
  Profile,
  ServiceBrowsing,
  ServiceDetail,
  SignUp,
} from "@/pages"
import { createBrowserRouter } from "react-router-dom"

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/onboarding", element: <Onboarding /> },
  { path: "/profile", element: <Profile /> },
  { path: "/services", element: <ServiceBrowsing /> },
  { path: "/service/:id", element: <ServiceDetail /> },
  { path: "/booking/:id", element: <NewBooking /> },
  { path: "/bookings", element: <Bookings /> },
  { path: "/booking/new", element: <NewBooking /> },
  { path: "/booking/payment", element: <Payment /> },
])
