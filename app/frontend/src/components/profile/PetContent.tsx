import { useEffect, useRef, useState } from "react"
import Modal, { type TModalHandle } from "../ui/Modal"
import ContentLayout from "./ContentLayout"
import PetCard from "./PetCard"
import { INPUT_BASE } from "@/constants/form"
import { ErrorText, Label } from "../form"
import { PET_SPECIES } from "@/constants/pet"
import { useForm } from "react-hook-form"
import type { TPet, TPets } from "@/api/pet/types"
import { PetAPI } from "@/api"
import DeleteModal from "../ui/DeleteModal"

type TPetForm = {
  name: string
  species: string
  breed: string
  age: number
  healthCondition?: string
  preferences?: string
}

const defaultPet: TPetForm = {
  name: "",
  species: "",
  breed: "",
  age: 0,
  healthCondition: "",
  preferences: "",
}

const PetContent = () => {
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<TPetForm>()
  const selectedSpecies = watch("species")

  const petModalRef = useRef<TModalHandle>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const deleteModalRef = useRef<TModalHandle>(null)
  const [selectedPet, setSelectedPet] = useState<number>()
  const [pets, setPets] = useState<TPets>([])

  const onAdd = () => {
    setSelectedPet(undefined)
    reset(defaultPet)
    petModalRef.current?.openModal()
  }

  const onEdit = ({ id, name, species, breed, age, health, preferences }: TPet) => {
    setSelectedPet(id)
    reset({ name, species, breed, age, healthCondition: health, preferences })
    petModalRef.current?.openModal()
  }

  const onDelete = (petId: number) => {
    setSelectedPet(petId)
    deleteModalRef.current?.openModal()
  }

  const handleAddPet = async (data: TPetForm) => {
    await PetAPI.addPet({
      ...data,
      health: data.healthCondition || "",
      preferences: data.preferences || "",
    })
      .then(() => {
        PetAPI.fetchPetsByOwner().then((data) => setPets(data))
      })
      .catch((err) => alert(err.message))
      .finally(() => petModalRef.current?.closeModal())
  }

  const handleEditPet = async (data: TPetForm) => {
    console.log(`Editing Pet: ${data}`)
    petModalRef.current?.closeModal()
  }

  const handleDeletePet = async (petId: number) => {
    await PetAPI.deletePet(petId)
      .then(() => PetAPI.fetchPetsByOwner().then((data) => setPets(data)))
      .catch((err) => alert(err.message))
      .finally(() => deleteModalRef.current?.closeModal())
  }

  const submitForm = () => formRef.current?.requestSubmit()

  useEffect(() => {
    PetAPI.fetchPetsByOwner().then((data) => setPets(data))
  }, [])

  return (
    <>
      <ContentLayout
        title="Pet(s) Owned"
        action={{
          label: "+ Add Pet",
          onClick: () => onAdd(),
        }}
        children={pets.map((pet) => {
          const { id, name, species, breed, age, health, preferences } = pet
          return (
            <PetCard
              pet={{ id, name, species, breed, age, health, preferences }}
              onEdit={() => onEdit(pet)}
              onDelete={() => onDelete(id)}
            />
          )
        })}
      />
      <Modal
        ref={petModalRef}
        header={`${selectedPet ? "Edit" : "Add"} Pet`}
        actionButtons={[
          {
            label: "Cancel",
            onClick: () => petModalRef.current?.closeModal(),
            variant: "secondary",
          },
          {
            label: selectedPet ? "Save" : "Add",
            onClick: submitForm,
          },
        ]}
      >
        <form
          ref={formRef}
          onSubmit={handleSubmit((data) =>
            selectedPet ? handleEditPet(data) : handleAddPet(data),
          )}
          className="max-w-[620px] w-full grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="col-span-1">
            <Label htmlFor="name" text="Pet Name" />
            <input
              id="name"
              type="text"
              className={INPUT_BASE}
              aria-invalid={!!errors.name}
              {...register("name", { required: "Pet name is required" })}
            />
            <ErrorText error={errors.name} />
          </div>

          <div className="col-span-1">
            <Label htmlFor="species" text="Species" />
            <select
              id="species"
              className={INPUT_BASE}
              aria-invalid={!!errors.species}
              {...register("species", { required: "Species is required" })}
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
            <ErrorText error={errors.species} />
          </div>

          <div className="col-span-1">
            <Label htmlFor="breed" text="Breed" />
            <select
              id="breed"
              className={INPUT_BASE}
              aria-invalid={!!errors.breed}
              disabled={!selectedSpecies}
              {...register("breed", { required: "Breed is required" })}
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
            <ErrorText error={errors.breed} />
          </div>

          <div className="col-span-1">
            <Label htmlFor="age" text="Age" />
            <input
              id="age"
              type="number"
              className={INPUT_BASE}
              aria-invalid={!!errors.age}
              {...register("age", {
                required: "Age is required",
              })}
            />
            <ErrorText error={errors.age} />
          </div>

          <div className="col-span-1 md:col-span-2">
            <Label htmlFor="healthCondition" text="Health Condition" />
            <textarea
              id="healthCondition"
              className={INPUT_BASE}
              aria-invalid={!!errors.healthCondition}
              placeholder="Any health conditions, allergies, or special requirements..."
              {...register("healthCondition")}
            />
            <ErrorText error={errors.healthCondition} />
          </div>

          <div className="col-span-1 md:col-span-2">
            <Label htmlFor="preferences" text="Preferences" />
            <textarea
              id="preferences"
              className={INPUT_BASE}
              aria-invalid={!!errors.preferences}
              placeholder="Any special care instructions, behavioural notes, or preferences..."
              {...register("preferences")}
            />
            <ErrorText error={errors.preferences} />
          </div>
        </form>
      </Modal>

      <DeleteModal
        ref={deleteModalRef}
        onConfirm={() => handleDeletePet(selectedPet!)}
        onCancel={() => deleteModalRef.current?.closeModal()}
      />
    </>
  )
}

export default PetContent
