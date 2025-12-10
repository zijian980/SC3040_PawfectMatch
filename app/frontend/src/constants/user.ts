import type { TUserGender, TUserRole } from "@/api/profile/types"

export const USER_ROLE: { [key in TUserRole]: string } = {
  caretaker: "Service Provider",
  owner: "Pet Owner",
}

export const USER_GENDER: { [key in TUserGender]: string } = {
  male: "Male",
  female: "Female",
  others: "Prefer not to say",
}
