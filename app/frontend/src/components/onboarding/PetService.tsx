import type { TOnboardingForm } from "@/pages/Onboarding"
import { useFieldArray, useFormContext, type FieldError } from "react-hook-form"
import Layout from "./Layout"
import { ErrorText, Label } from "../form"
import { useEffect, useState } from "react"
import type { TServiceList } from "@/api/service/types"
import { LocationAPI, ServiceAPI } from "@/api"
import { DAYS_OF_WEEK } from "@/constants/petService"
import { INPUT_BASE } from "@/constants/form"
import type { TLocations } from "@/api/location/types"

type TPetServiceProps = {
  onContinue: () => void
  onBack: () => void
}

const defaultService = {
  serviceId: 0,
  rate: 0,
  day: [],
  locations: [],
}

const PetService = ({ onContinue, onBack }: TPetServiceProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<TOnboardingForm>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "petService",
  })

  const [services, setServices] = useState<TServiceList>([])
  const [locations, setLocations] = useState<TLocations>([])

  const cardBase = "p-4 border border-gray-200 rounded-lg shadow-sm mb-4 w-full"

  useEffect(() => {
    ServiceAPI.fetchServiceList().then((data) => setServices(data))
    LocationAPI.fetchLocations().then((data) => setLocations(data))
  }, [])

  return (
    <Layout
      step={{
        name: "Your Services",
        value: 3,
      }}
      banner={{
        title: "Final Step!",
        description:
          "Add the services you offer so pet owners can find exactly what they need for their furry friends.",
      }}
      content={{
        title: "Add your services",
        description: "Tell pet owners what services you provide",
        children: (
          <div className="max-w-[800px] w-full flex flex-col gap-2">
            <div>
              <Label htmlFor="yearsOfExperience" text="Years of Experience" />
              <input
                id="yearsOfExperience"
                type="number"
                className={INPUT_BASE}
                aria-invalid={!!errors.userProfile?.yearsOfExperience}
                {...register("userProfile.yearsOfExperience", {
                  required: "Years of experience is required",
                })}
              />
              <ErrorText error={errors.userProfile?.yearsOfExperience} />
            </div>

            <div>
              <Label htmlFor="services" text="Services" />
              {fields.map((field, index) => (
                <div key={field.id} className={cardBase}>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-lg font-semibold">Service #{index + 1}</div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 text-sm font-medium disabled:opacity-50 hover:cursor-pointer"
                      disabled={fields.length === 1}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1">
                      <Label htmlFor={`petService.${index}.serviceId`} text="Service Type" />
                      <select
                        id={`petService.${index}.serviceId`}
                        className={INPUT_BASE}
                        aria-invalid={!!errors.petService?.[index]?.serviceId}
                        {...register(`petService.${index}.serviceId` as const, {
                          required: "Service type is required",
                          valueAsNumber: true,
                          validate: (value) => value !== 0 || "Please select a service",
                        })}
                        defaultValue={field.serviceId || 0}
                      >
                        <option value={0} disabled>
                          Select a service…
                        </option>
                        {services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.name}
                          </option>
                        ))}
                      </select>
                      <ErrorText error={errors.petService?.[index]?.serviceId} />
                    </div>

                    <div className="col-span-1">
                      <Label htmlFor={`petService.${index}.rate`} text="Hourly/Daily Rate ($)" />
                      <input
                        id={`petService.${index}.rate`}
                        type="number"
                        placeholder="e.g. 25.00"
                        className={INPUT_BASE}
                        aria-invalid={!!errors.petService?.[index]?.rate}
                        {...register(`petService.${index}.rate` as const, {
                          required: "Rate is required",
                          valueAsNumber: true,
                          min: { value: 1, message: "Rate must be positive" },
                        })}
                      />
                      <ErrorText error={errors.petService?.[index]?.rate} />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <Label htmlFor={`petService.${index}.locations`} text="Locations" />
                      <select
                        id={`petService.${index}.locations`}
                        className={INPUT_BASE}
                        multiple
                        aria-invalid={!!errors.petService?.[index]?.locations}
                        {...register(`petService.${index}.locations` as const, {
                          required: "Locations is required",
                          valueAsNumber: true,
                        })}
                        defaultValue={field.locations?.map(String) || []}
                      >
                        {locations.map((location) => (
                          <option key={location.id} value={location.id}>
                            {location.name}
                          </option>
                        ))}
                      </select>
                      <ErrorText error={errors.petService?.[index]?.locations as FieldError} />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor={`petService.${index}.day`} text="Available Days" />
                    <div className="flex flex-wrap gap-2 mt-1">
                      {DAYS_OF_WEEK.map((day) => (
                        <div key={day.value} className="flex items-center">
                          <input
                            id={`day-${index}-${day.value}`}
                            type="checkbox"
                            value={day.value}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            {...register(`petService.${index}.day` as const, {
                              required: "At least one day is required",
                              setValueAs: (v) => v.map(Number),
                            })}
                          />
                          <label
                            htmlFor={`day-${index}-${day.value}`}
                            className="ml-2 text-sm font-medium text-gray-700 select-none cursor-pointer p-1"
                          >
                            {day.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    <ErrorText error={errors.petService?.[index]?.day as FieldError} />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => append(defaultService)}
              className="w-full text-center border-1 border-black py-3 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium disabled:opacity-60 hover:cursor-pointer"
            >
              + Add Service
            </button>
          </div>
        ),
      }}
      onContinue={() => onContinue()}
      onBack={() => onBack()}
    />
  )
}

export default PetService
