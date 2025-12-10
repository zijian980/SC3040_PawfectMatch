import type { TOfferedService } from "@/api/offeredService/types"
import { DAYS_OF_WEEK } from "@/constants/petService"
import { Pencil, Trash2 } from "lucide-react"

type TServiceCardProps = {
  service: TOfferedService
  onEdit: (service: TOfferedService) => void
  onDelete: (id: number) => void
}

const ServiceCard = ({ service, onEdit, onDelete }: TServiceCardProps) => {
  return (
    <div className="p-5 relative border border-gray-300 rounded-md">
      <div className="absolute top-5 right-5 flex gap-4">
        <button className="h-4 w-4 hover:cursor-pointer" onClick={() => onEdit(service)}>
          <Pencil className="h-full w-full text-gray-500" />
        </button>
        <button className="h-4 w-4 hover:cursor-pointer" onClick={() => onDelete(service.id)}>
          <Trash2 className="h-full w-full text-red-500" />
        </button>
      </div>

      <h3 className="text-lg font-semibold mb-3">{service.service.name}</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Price</span>
          <span className="text-sm font-medium">${service.rate}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-sm text-muted-foreground">Availability</span>
          <span className="text-sm font-medium">
            {service.day.map((day) => DAYS_OF_WEEK[day - 1].label).join(", ")}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-sm text-muted-foreground">Locations</span>
          <span className="text-sm font-medium">
            {service.locations.map(({ name }) => name).join(", ")}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ServiceCard
