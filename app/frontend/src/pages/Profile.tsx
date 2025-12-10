import { ProfileAPI } from "@/api"
import type { TUserGender } from "@/api/profile/types"
import Navbar from "@/components/Navbar"
import About from "@/components/profile/About"
import { userPlaceholderUrl } from "@/assets"
import ServiceContent from "@/components/profile/ServiceContent"
import PetContent from "@/components/profile/PetContent"
import { useUser } from "@/context/UserContext"

export type TUserForm = {
  profilePicture?: FileList
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: TUserGender
  phone: string
  address: string
  yoe?: number
}

const Profile = () => {
  const { user, fetchProfile } = useUser()

  const handleUpdateProfile = async ({
    firstName,
    lastName,
    dateOfBirth,
    gender,
    phone,
    address,
    yoe,
    profilePicture,
  }: TUserForm) => {
    await ProfileAPI.updateProfile({
      first_name: firstName,
      last_name: lastName,
      dob: dateOfBirth,
      gender: gender,
      contact_num: phone,
      address: address,
      yoe: yoe,
    })
      .then(async () => {
        if (profilePicture?.item(0)) await ProfileAPI.updateProfilePicture(profilePicture.item(0)!)
      })
      .catch((err) => alert(err.message))
      .finally(async () => fetchProfile())
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="relative h-50 bg-gradient-to-r from-purple-400 via-green-300 to-yellow-300">
        <div className="absolute -bottom-10 left-[5%] lg:left-[20%] md:left-[12.5%] flex items-center gap-5">
          <div className="h-36 w-36 ">
            <img
              src={user?.profile_picture || userPlaceholderUrl}
              alt="Profile"
              className="h-full w-full object-cover rounded-full"
            />
          </div>
          <div className="text-4xl font-bold">
            {user?.first_name} {user?.last_name}
          </div>
        </div>
      </div>

      {user && (
        <div className="container mx-auto w-[90%] lg:w-[60%] md:w-[75%] pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
            <About
              role={user.type}
              firstName={user.first_name}
              lastName={user.last_name}
              address={user.address}
              phoneNo={user.contact_num}
              gender={user.gender}
              dateOfBirth={user.dob}
              yearsOfExperience={user.yoe}
              handleUpdateProfile={handleUpdateProfile}
            />

            {user.type === "caretaker" && <ServiceContent />}
            {user.type === "owner" && <PetContent />}
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
