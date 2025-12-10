import { useFormContext } from "react-hook-form"
import Layout from "./Layout"
import type { TOnboardingForm } from "@/pages/Onboarding"
import { ErrorText, Label } from "@/components/form"
import { INPUT_BASE } from "@/constants/form"
import { USER_GENDER } from "@/constants/user"

type TUserProfileProps = {
  onContinue: () => void
  onBack: () => void
}

export default function UserProfile({ onContinue, onBack }: TUserProfileProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<TOnboardingForm>()

  return (
    <Layout
      step={{
        name: "Your Profile",
        value: 2,
      }}
      banner={{
        title: "Almost There!",
        description:
          "Let's set up your profile so we can connect you with the best pet care services in your area.",
      }}
      content={{
        title: "Set up your profile",
        description: "Tell us about yourself so we can provide better service",
        children: (
          <div className="max-w-[620px] w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <Label htmlFor="firstName" text="First Name" />
              <input
                id="firstName"
                type="text"
                className={INPUT_BASE}
                aria-invalid={!!errors.userProfile?.firstName}
                {...register("userProfile.firstName", { required: "First name is required" })}
              />
              <ErrorText error={errors.userProfile?.firstName} />
            </div>

            <div className="col-span-1">
              <Label htmlFor="lastName" text="Last Name" />
              <input
                id="lastName"
                type="text"
                className={INPUT_BASE}
                aria-invalid={!!errors.userProfile?.lastName}
                {...register("userProfile.lastName", { required: "Last name is required" })}
              />
              <ErrorText error={errors.userProfile?.lastName} />
            </div>

            <div className="col-span-1">
              <Label htmlFor="dateOfBirth" text="Date of Birth" />
              <input
                id="dateOfBirth"
                type="date"
                className={INPUT_BASE}
                aria-invalid={!!errors.userProfile?.dateOfBirth}
                {...register("userProfile.dateOfBirth", {
                  required: "Date of birth is required",
                })}
              />
              <ErrorText error={errors.userProfile?.dateOfBirth} />
            </div>

            <div className="col-span-1">
              <Label htmlFor="gender" text="Gender" />
              <select
                id="gender"
                className={INPUT_BASE}
                aria-invalid={!!errors.userProfile?.gender}
                {...register("userProfile.gender", { required: "Please select a gender" })}
              >
                <option value="" disabled>
                  Select…
                </option>
                {Object.entries(USER_GENDER).map(([value, label]) => (
                  <option value={value}>{label}</option>
                ))}
              </select>
              <ErrorText error={errors.userProfile?.gender} />
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
                  aria-invalid={!!errors.userProfile?.phone}
                  {...register("userProfile.phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\d{8}$/,
                      message: "Enter an 8-digit number",
                    },
                  })}
                />
              </div>
              <ErrorText error={errors.userProfile?.phone} />
            </div>

            <div className="col-span-1 md:col-span-2">
              <Label htmlFor="address" text="Address" />
              <input
                id="address"
                type="text"
                className={INPUT_BASE}
                aria-invalid={!!errors.userProfile?.address}
                placeholder="Block / Street / Unit / Postal Code"
                {...register("userProfile.address", { required: "Address is required" })}
              />
              <ErrorText error={errors.userProfile?.address} />
            </div>
          </div>
        ),
      }}
      onContinue={() => onContinue()}
      onBack={() => onBack()}
    />
  )
}
