import type { TUserGender } from "../profile/types"

export type TAuthenticatedResponse = {
  authenticated: boolean
}

export type TLoginProps = {
  email: string
  password: string
}

export type TSignUpProps = {
  first_name: string
  email: string
  password: string
  dob: string // Will be filled with placeholder values for now
  gender: TUserGender
}

export type TSignUpResponse = {
  // Backend returns 201 status with no body for register endpoint
  detail?: string
}
