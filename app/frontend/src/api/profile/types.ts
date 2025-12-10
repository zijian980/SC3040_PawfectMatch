export type TUserRole = "caretaker" | "owner"

export type TUserGender = "male" | "female" | "others"

export type TProfileResponse = {
  first_name: string
  last_name: string
  contact_num: string
  dob: string
  address: string
  gender: TUserGender
  type: TUserRole
  profile_picture?: string
  yoe?: number
}

export type TProfilePictureResponse = {
  profilePicture: string
}

export type TUpdateProfileRequest = {
  first_name: string
  last_name: string
  contact_num: string
  dob: string
  address: string
  gender: TUserGender
  yoe?: number
}
