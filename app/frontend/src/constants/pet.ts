export interface IPetBreed {
  value: string
  label: string
}

export interface IPetSpecies {
  value: string
  label: string
  breeds: IPetBreed[]
}

export const PET_SPECIES: IPetSpecies[] = [
  {
    value: "dog",
    label: "Dog",
    breeds: [
      { value: "labrador", label: "Labrador Retriever" },
      { value: "german-shepherd", label: "German Shepherd" },
      { value: "golden-retriever", label: "Golden Retriever" },
      { value: "poodle", label: "Poodle (Standard/Miniature)" },
      { value: "bulldog", label: "Bulldog" },
      { value: "beagle", label: "Beagle" },
      { value: "mixed-dog", label: "Mixed Breed" },
    ],
  },
  {
    value: "cat",
    label: "Cat",
    breeds: [
      { value: "domestic-shorthair", label: "Domestic Shorthair" },
      { value: "maine-coon", label: "Maine Coon" },
      { value: "ragdoll", label: "Ragdoll" },
      { value: "siamese", label: "Siamese" },
      { value: "bengal", label: "Bengal" },
      { value: "sphynx", label: "Sphynx" },
      { value: "mixed-cat", label: "Mixed Breed" },
    ],
  },
  {
    value: "bird",
    label: "Bird",
    breeds: [
      { value: "cockatiel", label: "Cockatiel" },
      { value: "parrot", label: "Parrot (African Grey, Amazon, etc.)" },
      { value: "canary", label: "Canary" },
      { value: "finch", label: "Finch" },
      { value: "not-applicable", label: "Not Applicable" },
    ],
  },
]
