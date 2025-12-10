import { useEffect, useRef, useState } from "react"
import ContentLayout from "./ContentLayout"
import ServiceCard from "./ServiceCard"
import Modal, { type TModalHandle } from "../ui/Modal"
import { LocationAPI, OfferedServiceAPI, ServiceAPI } from "@/api"
import type { TOfferedService, TOfferedServices } from "@/api/offeredService/types"
import { useForm, type FieldError } from "react-hook-form"
import { ErrorText, Label } from "../form"
import type { TLocations } from "@/api/location/types"
import type { TServiceList } from "@/api/service/types"
import { INPUT_BASE } from "@/constants/form"
import { DAYS_OF_WEEK } from "@/constants/petService"
import DeleteModal from "../ui/DeleteModal"

type TServiceForm = {
  serviceId: number
  rate: number
  day: string[]
  locations: string[]
}

const defaultService: TServiceForm = {
  serviceId: 0,
  rate: 0,
  day: [],
  locations: [],
}

const ServiceContent = () => {
  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TServiceForm>()
  const selectedDays = watch("day") || []

  const serviceModalRef = useRef<TModalHandle>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const deleteModalRef = useRef<TModalHandle>(null)
  const [selectedService, setSelectedService] = useState<number>()
  const [offeredServices, setOfferedServices] = useState<TOfferedServices>([])
  const [services, setServices] = useState<TServiceList>([])
  const [locations, setLocations] = useState<TLocations>([])

  const onAdd = () => {
    setSelectedService(undefined)
    reset(defaultService)
    serviceModalRef.current?.openModal()
  }

  const onEdit = ({ id, service, locations, day, rate }: TOfferedService) => {
    setSelectedService(id)
    reset({
      serviceId: service.id,
      rate,
      day: day.map(String),
      locations: locations.map(({ id }) => String(id)),
    })
    serviceModalRef.current?.openModal()
  }

  const onDelete = (id: number) => {
    setSelectedService(id)
    deleteModalRef.current?.openModal()
  }

  const handleAddService = async ({ serviceId, rate, day, locations }: TServiceForm) => {
    await OfferedServiceAPI.addOfferedService({
      service_id: serviceId,
      rate,
      day: day.map(Number),
      locations: locations.map(Number),
    })
      .then(() =>
        OfferedServiceAPI.fetchOfferedServiceByUserId("me").then((data) =>
          setOfferedServices(data),
        ),
      )
      .catch((err) => alert(err.message))
      .finally(() => serviceModalRef.current?.closeModal())
  }

  const handleEditService = async ({ rate, day, locations }: TServiceForm) => {
    await OfferedServiceAPI.updateOfferedService({
      id: selectedService!,
      rate,
      day: day.map(Number),
      locations: locations.map(Number),
    })
      .then(() =>
        OfferedServiceAPI.fetchOfferedServiceByUserId("me").then((data) =>
          setOfferedServices(data),
        ),
      )
      .catch((err) => alert(err.message))
      .finally(() => serviceModalRef.current?.closeModal())
  }

  const handleDeleteService = async (id: number) => {
    OfferedServiceAPI.deleteOfferedService(id)
      .then(() =>
        OfferedServiceAPI.fetchOfferedServiceByUserId("me").then((data) =>
          setOfferedServices(data),
        ),
      )
      .catch((err) => alert(err.message))
      .finally(() => deleteModalRef.current?.closeModal())
  }

  const submitForm = () => formRef.current?.requestSubmit()

  useEffect(() => {
    OfferedServiceAPI.fetchOfferedServiceByUserId("me").then((data) => setOfferedServices(data))
    ServiceAPI.fetchServiceList().then((data) => setServices(data))
    LocationAPI.fetchLocations().then((data) => setLocations(data))
  }, [])

  return (
    <>
      <ContentLayout
        title="Service(s) Provided"
        action={{
          label: "+ Add Service",
          onClick: () => onAdd(),
        }}
        children={offeredServices.map((offeredService) => (
          <ServiceCard service={offeredService} onEdit={onEdit} onDelete={onDelete} />
        ))}
      />
      <Modal
        ref={serviceModalRef}
        header={`${selectedService ? "Edit" : "Add"} Service`}
        actionButtons={[
          {
            label: "Cancel",
            onClick: () => serviceModalRef.current?.closeModal(),
            variant: "secondary",
          },
          {
            label: selectedService ? "Save" : "Add",
            onClick: submitForm,
          },
        ]}
      >
        <form
          ref={formRef}
          onSubmit={handleSubmit((data) =>
            selectedService ? handleEditService(data) : handleAddService(data),
          )}
          className="max-w-[620px] w-full p-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <Label text="Service Type" htmlFor="serviceId" />
              <select
                id="serviceId"
                className={`${INPUT_BASE} disabled:bg-gray-200`}
                aria-invalid={!!errors.serviceId}
                {...register("serviceId", {
                  required: "Service type is required",
                  valueAsNumber: true,
                  validate: (value) => value !== 0 || "Please select a service",
                })}
                disabled={!!selectedService}
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
              <ErrorText error={errors.serviceId} />
            </div>

            <div className="col-span-1">
              <Label text="Hourly/Daily Rate ($)" htmlFor="rate" />
              <input
                id="rate"
                type="number"
                placeholder="e.g. 25.00"
                className={INPUT_BASE}
                aria-invalid={!!errors.rate}
                {...register("rate", {
                  required: "Rate is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Rate must be positive" },
                })}
              />
              <ErrorText error={errors.rate} />
            </div>

            <div className="col-span-1 md:col-span-2">
              <Label text="Locations" htmlFor="locations" />
              <select
                id="locations"
                className={INPUT_BASE}
                multiple
                aria-invalid={!!errors.locations}
                {...register("locations", {
                  required: "Locations is required",
                })}
              >
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
              <ErrorText error={errors.locations as FieldError} />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor={"day"} text="Available Days" />
            <div className="flex flex-wrap gap-2 mt-1">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.value} className="flex items-center">
                  <input
                    id={`day-${day.value}`}
                    type="checkbox"
                    value={day.value}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    {...register(`day` as const, {
                      required: "At least one day is required",
                      setValueAs: (v) => v.map(String),
                    })}
                    checked={selectedDays.includes(String(day.value))}
                  />
                  <label
                    htmlFor={`day-${day.value}`}
                    className="ml-2 text-sm font-medium text-gray-700 select-none cursor-pointer p-1"
                  >
                    {day.label}
                  </label>
                </div>
              ))}
            </div>
            <ErrorText error={errors.day as FieldError} />
          </div>
        </form>
      </Modal>

      <DeleteModal
        ref={deleteModalRef}
        onConfirm={() => handleDeleteService(selectedService!)}
        onCancel={() => deleteModalRef.current?.closeModal()}
      />
    </>
  )
}

export default ServiceContent
