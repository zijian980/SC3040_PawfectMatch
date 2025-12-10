// src/context/UserContext.jsx
import { createContext, useState, useEffect, useContext } from "react"
import type { ReactNode } from "react"
import { ProfileAPI } from "@/api" // Assuming ProfileAPI is defined
import type { TProfileResponse } from "@/api/profile/types"

type UserContextType = {
  user: TProfileResponse
  setUser: React.Dispatch<React.SetStateAction<TProfileResponse>>
  fetchProfile: () => void
}

const UserContext = createContext<UserContextType>({
  user: {
    first_name: "",
    last_name: "",
    contact_num: "",
    dob: "",
    address: "",
    gender: "male",
    type: "caretaker",
  },
  setUser: () => {},
  fetchProfile: () => {},
})

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TProfileResponse>({
    first_name: "",
    last_name: "",
    contact_num: "",
    dob: "",
    address: "",
    gender: "male",
    type: "caretaker",
  })

  const fetchProfile = async () => {
    await ProfileAPI.fetchProfile().then((data) => setUser(data))
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, fetchProfile }}>{children}</UserContext.Provider>
  )
}
