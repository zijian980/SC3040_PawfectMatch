import type { TOnboardingForm } from "@/pages/Onboarding"
import { useFormContext } from "react-hook-form"
import Layout from "./Layout"
import { ErrorText, Label } from "../form"
import { PET_SPECIES } from "@/constants/pet"
import { INPUT_BASE } from "@/constants/form"

type TPetProfileProps = {
  onContinue: () => void
  onBack: () => void
}

const PetProfile = ({ onContinue, onBack }: TPetProfileProps) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<TOnboardingForm>()
  const selectedSpecies = watch("petProfile.species")

  return (
    <Layout
      step={{
        name: "Pet Profile",
        value: 3,
      }}
      banner={{
        title: "Final Step!",
        description:
          "Tell us about your furry friend so we can match you with the perfect care providers.",
      }}
      content={{
        title: "Tell us about your pet",
        description: "Help us provide the best care for your furry friend",
        children: (
          <div className="max-w-[620px] w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <Label htmlFor="name" text="Pet Name" />
              <input
                id="name"
                type="text"
                className={INPUT_BASE}
                aria-invalid={!!errors.petProfile?.name}
                {...register("petProfile.name", { required: "Pet name is required" })}
              />
              <ErrorText error={errors.petProfile?.name} />
            </div>

            <div className="col-span-1">
              <Label htmlFor="species" text="Species" />
              <select
                id="species"
                className={INPUT_BASE}
                aria-invalid={!!errors.petProfile?.species}
                {...register("petProfile.species", { required: "Species is required" })}
              >
                <option value="" disabled>
                  {" "}
                  Select…
                </option>
                {PET_SPECIES.map((species) => (
                  <option key={species.value} value={species.value}>
                    {species.label}
                  </option>
                ))}
              </select>
              <ErrorText error={errors.petProfile?.species} />
            </div>

            <div className="col-span-1">
              <Label htmlFor="breed" text="Breed" />
              <select
                id="breed"
                className={INPUT_BASE}
                aria-invalid={!!errors.petProfile?.breed}
                disabled={!selectedSpecies}
                {...register("petProfile.breed", { required: "Breed is required" })}
              >
                <option value="" disabled>
                  {" "}
                  Select…
                </option>
                {PET_SPECIES.find((species) => species.value === selectedSpecies)?.breeds.map(
                  (breed) => (
                    <option key={breed.value} value={breed.value}>
                      {breed.label}
                    </option>
                  ),
                )}
              </select>
              <ErrorText error={errors.petProfile?.breed} />
            </div>

            <div className="col-span-1">
              <Label htmlFor="age" text="Age" />
              <input
                id="age"
                type="number"
                className={INPUT_BASE}
                aria-invalid={!!errors.petProfile?.age}
                {...register("petProfile.age", {
                  required: "Age is required",
                })}
              />
              <ErrorText error={errors.petProfile?.age} />
            </div>

            <div className="col-span-1 md:col-span-2">
              <Label htmlFor="healthCondition" text="Health Condition" />
              <textarea
                id="healthCondition"
                className={INPUT_BASE}
                aria-invalid={!!errors.petProfile?.healthCondition}
                placeholder="Any health conditions, allergies, or special requirements..."
                {...register("petProfile.healthCondition")}
              />
              <ErrorText error={errors.petProfile?.healthCondition} />
            </div>

            <div className="col-span-1 md:col-span-2">
              <Label htmlFor="preferences" text="Preferences" />
              <textarea
                id="preferences"
                className={INPUT_BASE}
                aria-invalid={!!errors.petProfile?.preferences}
                placeholder="Any special care instructions, behavioural notes, or preferences..."
                {...register("petProfile.preferences")}
              />
              <ErrorText error={errors.petProfile?.preferences} />
            </div>
          </div>
        ),
      }}
      onContinue={() => onContinue()}
      onBack={() => onBack()}
    />
  )
}

export default PetProfile
