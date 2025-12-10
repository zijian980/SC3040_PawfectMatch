import { useState } from "react"
import Layout from "./Layout"
import { petOwnerUrl, serviceProviderUrl } from "@/assets"
import type { TUserRole } from "@/api/profile/types"

type TRoleCardProps = {
  icon: string
  title: string
  description: string
  selected: boolean
  onClick: () => void
}

type TRoleSelectionProps = {
  userRole?: TUserRole
  onContinue: (role: TUserRole) => void
}

const RoleCard = ({ icon, title, description, selected, onClick }: TRoleCardProps) => (
  <div
    className={`border-1 border-gray-300 rounded-lg p-7 text-center flex flex-col justify-center items-center hover:cursor-pointer hover:shadow-lg ${selected && "ring-2 ring-black"}`}
    onClick={() => onClick()}
  >
    <img
      src={icon}
      className="w-full xl:max-w-[50%] lg:max-w-[75%] mb-5 flex items-center justify-center"
    />
    <h3 className="text-3xl font-bold mb-3">{title}</h3>
    <p>{description}</p>
  </div>
)

export default function RoleSelection({ userRole, onContinue }: TRoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<TUserRole | undefined>(userRole)

  return (
    <Layout
      step={{
        name: "Choose Your Role",
        value: 1,
      }}
      banner={{
        title: "Welcome to PawfectMatch!",
        description: "Select a role that you wish to sign up with",
      }}
      content={{
        title: "Select your role",
        description: "Choose how you would like to use our platform",
        children: (
          <div className="grid grid-cols-2 gap-8 w-full h-full">
            <RoleCard
              icon={petOwnerUrl}
              title="Pet Owner"
              description="Find trusted pet care services, book appointments, and connect with professional pet care providers in your area."
              selected={selectedRole === "owner"}
              onClick={() => setSelectedRole("owner")}
            />
            <RoleCard
              icon={serviceProviderUrl}
              title="Service Provider"
              description="Offer your pet care services, manage bookings, and build your client base with pet owners in your community."
              selected={selectedRole === "caretaker"}
              onClick={() => setSelectedRole("caretaker")}
            />
          </div>
        ),
      }}
      onContinue={() => onContinue(selectedRole!)}
      continueDisabled={!selectedRole}
    />
  )
}
