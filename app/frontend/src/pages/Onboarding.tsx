import { OnboardingAPI } from "@/api"
import type { TUserGender, TUserRole } from "@/api/profile/types"
import { UserProfile, RoleSelection, PetProfile, PetService } from "@/components/onboarding"
import { useUser } from "@/context/UserContext"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

type TOnboardingSteps = "role" | "user-profile" | "pet-profile" | "pet-service"
export type TOnboardingForm = {
  userProfile: {
    firstName: string
    lastName: string
    dateOfBirth: string
    gender: TUserGender | ""
    phone: string
    address: string
    yearsOfExperience?: number
  }
  petProfile?: {
    name: string
    species: string
    breed: string
    age: number
    healthCondition?: string
    preferences?: string
  }
  petService?: {
    serviceId: number
    rate: number
    day: number[]
    locations: number[]
  }[]
}

const Onboarding = () => {
  const navigate = useNavigate()
  const { fetchProfile } = useUser()
  const [currentStep, setCurrentStep] = useState<TOnboardingSteps>("role")
  const [userRole, setUserRole] = useState<TUserRole>()

  const onboardingForm = useForm<TOnboardingForm>({
    defaultValues: {
      userProfile: {
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        phone: "",
        address: "",
      },
      petProfile: {
        name: "",
        species: "",
        breed: "",
        age: 0,
        healthCondition: "",
        preferences: "",
      },
      petService: [],
    },
    mode: "onBlur",
  })
  const { handleSubmit, trigger } = onboardingForm

  const handleSelectRole = (role: TUserRole) => {
    setUserRole(role)
    setCurrentStep("user-profile")
  }

  const handleUserProfile = async () => {
    const valid = await trigger("userProfile")
    if (valid) setCurrentStep(userRole === "owner" ? "pet-profile" : "pet-service")
  }

  const handlePetProfile = async () => {
    const valid = await trigger("petProfile")
    if (valid) handleSubmit(onSubmit)()
  }

  const handlePetService = async () => {
    const valid = await trigger("petService")
    if (valid) handleSubmit(onSubmit)()
  }

  const onSubmit = async ({ userProfile, petProfile, petService }: TOnboardingForm) => {
    await OnboardingAPI.onboardProfile({
      ...userProfile,
      type: userRole!,
    })
      .then(async () => {
        if (userRole === "owner") {
          await OnboardingAPI.onboardPet({
            ...petProfile!,
            health: petProfile?.healthCondition ?? "",
            preferences: petProfile?.preferences ?? "",
          }).then(
            async () =>
              await OnboardingAPI.onboardComplete().then(() => {
                fetchProfile()
                navigate("/dashboard", { replace: true })
              }),
          )
        } else {
          await OnboardingAPI.onboardService(petService!).then(
            async () =>
              await OnboardingAPI.onboardComplete().then(() => {
                fetchProfile()
                navigate("/dashboard", { replace: true })
              }),
          )
        }
      })
      .catch((err) => alert(err.message))
  }

  useEffect(() => {
    OnboardingAPI.fetchOnboardingStatus()
      .then(({ onboarded }) => {
        if (onboarded) navigate("/dashboard", { replace: true })
      })
      .catch((err) => alert(err.message))
  }, [])

  return (
    <FormProvider {...onboardingForm}>
      <form onSubmit={handleSubmit((data) => console.log(data))}>
        {currentStep === "role" && (
          <RoleSelection userRole={userRole} onContinue={handleSelectRole} />
        )}
        {currentStep === "user-profile" && (
          <UserProfile
            onContinue={() => handleUserProfile()}
            onBack={() => setCurrentStep("role")}
          />
        )}
        {currentStep === "pet-profile" && (
          <PetProfile
            onContinue={() => handlePetProfile()}
            onBack={() => setCurrentStep("user-profile")}
          />
        )}
        {currentStep === "pet-service" && (
          <PetService
            onContinue={() => handlePetService()}
            onBack={() => setCurrentStep("user-profile")}
          />
        )}
      </form>
    </FormProvider>
  )
}

export default Onboarding
