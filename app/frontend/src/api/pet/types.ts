export type TPetOwner = {
  id: string
  profile: {
    first_name: string
    last_name: string
  }
}

export type TPet = {
  id: number
  owner: TPetOwner
  name: string
  species: string
  breed: string
  age: number
  health: string
  preferences: string
}

export type TPets = TPet[]

export type TAddPetRequest = {
  name: string
  species: string
  breed: string
  age: number
  health: string
  preferences: string
}
