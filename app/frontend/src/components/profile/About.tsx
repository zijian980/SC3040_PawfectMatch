import type { TUserGender, TUserRole } from "@/api/profile/types"
import { USER_GENDER, USER_ROLE } from "@/constants/user"
import { formatDate, formatDateForInput } from "@/utils/formatDateTime"
import { BriefcaseBusiness, Cake, MapPin, PersonStanding, Phone, Star } from "lucide-react"
import { useRef, type ReactNode } from "react"
import Modal, { type TModalHandle } from "../ui/Modal"
import { useForm } from "react-hook-form"
import { ErrorText, Label } from "../form"
import { INPUT_BASE } from "@/constants/form"
import { userPlaceholderUrl } from "@/assets"
import type { TUserForm } from "@/pages/Profile"

type TAboutProps = {
  role: TUserRole
  firstName: string
  lastName: string
  address: string
  phoneNo: string
  gender: TUserGender
  dateOfBirth: string
  yearsOfExperience?: number
  handleUpdateProfile: (data: TUserForm & { file?: File }) => void
}

type TAboutItemProps = {
  icon: ReactNode
  label: string
}

const AboutItem = ({ icon, label }: TAboutItemProps) => {
  return (
    <div className="flex gap-5 items-center">
      <div className="w-6 h-6">{icon}</div>
      <div>{label || "-"}</div>
    </div>
  )
}

const About = ({
  role,
  firstName,
  lastName,
  address,
  phoneNo,
  gender,
  dateOfBirth,
  yearsOfExperience,
  handleUpdateProfile,
}: TAboutProps) => {
  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<TUserForm>()
  const profilePicture = watch("profilePicture")

  const userModalRef = useRef<TModalHandle>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const onUpdateProfile = () => {
    reset({
      firstName,
      lastName,
      dateOfBirth: formatDateForInput(dateOfBirth),
      gender,
      phone: phoneNo,
      address,
      yoe: yearsOfExperience,
      profilePicture: undefined,
    })
    userModalRef.current?.openModal()
  }

  const submitForm = () => formRef.current?.requestSubmit()

  return (
    <>
      <div className="mt-15">
        <div className="font-bold mb-3">About</div>
        <div className="border border-gray-300 rounded-md flex flex-col gap-5 px-5 py-7">
          <AboutItem icon={<BriefcaseBusiness />} label={USER_ROLE[role]} />
          <AboutItem icon={<MapPin />} label={address} />
          <AboutItem icon={<Phone />} label={`+65 ${phoneNo}`} />
          <AboutItem icon={<PersonStanding />} label={USER_GENDER[gender]} />
          <AboutItem icon={<Cake />} label={formatDate(dateOfBirth)} />
          {role === "caretaker" && yearsOfExperience && (
            <AboutItem icon={<Star />} label={`${yearsOfExperience} Years of Experience`} />
          )}
        </div>
        <button
          className="bg-black text-white py-2 px-4 rounded-md w-full mt-3 transition-colors font-medium disabled:opacity-60 enabled:hover:bg-gray-800 enabled:hover:cursor-pointer"
          onClick={() => onUpdateProfile()}
        >
          Update Profile
        </button>
      </div>

      <Modal
        ref={userModalRef}
        header="Update Profile"
        actionButtons={[
          {
            label: "Cancel",
            onClick: () => userModalRef.current?.closeModal(),
            variant: "secondary",
          },
          {
            label: "Save",
            onClick: submitForm,
          },
        ]}
      >
        <form
          ref={formRef}
          onSubmit={handleSubmit((data) => {
            handleUpdateProfile(data)
            userModalRef.current?.closeModal()
          })}
          className="space-y-4"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
              <img
                src={
                  profilePicture && profilePicture.item(0)
                    ? URL.createObjectURL(profilePicture.item(0)!)
                    : userPlaceholderUrl
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <label htmlFor="profilePicture" className="cursor-pointer">
              {profilePicture && (
                <div className="text-sm text-gray-500 truncate mb-2">
                  {profilePicture && profilePicture.item(0)
                    ? profilePicture.item(0)?.name
                    : "Current Photo"}
                </div>
              )}
              <div className="bg-gray-100 text-black border border-gray-300 py-2 px-4 rounded-md text-sm font-medium w-fit hover:bg-gray-200 transition-colors">
                {profilePicture ? "Change Photo" : "Upload Photo"}
              </div>
              <input
                id="profilePicture"
                type="file"
                accept="image/*"
                className="hidden"
                {...register("profilePicture")}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <Label htmlFor="firstName" text="First Name" />
              <input
                id="firstName"
                type="text"
                className={INPUT_BASE}
                aria-invalid={!!errors.firstName}
                {...register("firstName", { required: "First name is required" })}
              />
              <ErrorText error={errors.firstName} />
            </div>

            <div className="col-span-1">
              <Label htmlFor="lastName" text="Last Name" />
              <input
                id="lastName"
                type="text"
                className={INPUT_BASE}
                aria-invalid={!!errors.lastName}
                {...register("lastName", { required: "Last name is required" })}
              />
              <ErrorText error={errors.lastName} />
            </div>

            <div className="col-span-1">
              <Label htmlFor="dateOfBirth" text="Date of Birth" />
              <input
                id="dateOfBirth"
                type="date"
                className={INPUT_BASE}
                aria-invalid={!!errors.dateOfBirth}
                {...register("dateOfBirth", {
                  required: "Date of birth is required",
                })}
              />
              <ErrorText error={errors.dateOfBirth} />
            </div>

            <div className="col-span-1">
              <Label htmlFor="gender" text="Gender" />
              <select
                id="gender"
                className={INPUT_BASE}
                aria-invalid={!!errors.gender}
                {...register("gender", { required: "Please select a gender" })}
              >
                <option value="" disabled>
                  Select…
                </option>
                {Object.entries(USER_GENDER).map(([value, label]) => (
                  <option value={value}>{label}</option>
                ))}
              </select>
              <ErrorText error={errors.gender} />
            </div>

            <div className="col-span-1 md:col-span-2">
              <Label htmlFor="phone" text="Phone Number" />
              <div className="flex">
                <div className="flex items-center justify-center px-4 bg-gray-200 text-gray-800 rounded-l-md border border-gray-300">
                  +65
                </div>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="81234567"
                  className="flex-1 px-3 py-3 border border-l-0 rounded-r-md focus:outline-none focus:border-black border-gray-300"
                  aria-invalid={!!errors.phone}
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\d{8}$/,
                      message: "Enter an 8-digit number",
                    },
                  })}
                />
              </div>
              <ErrorText error={errors.phone} />
            </div>

            <div className="col-span-1 md:col-span-2">
              <Label htmlFor="address" text="Address" />
              <input
                id="address"
                type="text"
                className={INPUT_BASE}
                aria-invalid={!!errors.address}
                placeholder="Block / Street / Unit / Postal Code"
                {...register("address", { required: "Address is required" })}
              />
              <ErrorText error={errors.address} />
            </div>

            {yearsOfExperience && (
              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="yoe" text="Years of Experience" />
                <input
                  id="yoe"
                  type="number"
                  className={INPUT_BASE}
                  aria-invalid={!!errors.yoe}
                  {...register(
                    "yoe",
                    yearsOfExperience ? { required: "Years of Experience is required" } : {},
                  )}
                />
                <ErrorText error={errors.yoe} />
              </div>
            )}
          </div>
        </form>
      </Modal>
    </>
  )
}

export default About
