import { Pencil, Trash2 } from "lucide-react"

type TPetCardProps = {
  pet: {
    id: number
    name: string
    species: string
    breed: string
    age: number
    health: string
    preferences: string
  }
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

const PetCard = ({ pet, onEdit, onDelete }: TPetCardProps) => {
  return (
    <div className="p-5 relative border border-gray-300 rounded-md">
      <div className="absolute top-5 right-5 flex gap-4">
        <button className="h-4 w-4 hover:cursor-pointer" onClick={() => onEdit(pet.id)}>
          <Pencil className="h-full w-full text-gray-500" />
        </button>
        <button className="h-4 w-4 hover:cursor-pointer" onClick={() => onDelete?.(pet.id)}>
          <Trash2 className="h-full w-full text-red-500" />
        </button>
      </div>

      <h3 className="text-lg font-semibold mb-1">{pet.name}</h3>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {pet.species} | {pet.breed}
      </p>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Age</span>
          <span className="text-sm font-medium">{pet.age} Years Old</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Health</span>
          <span className="text-sm font-medium">{pet.health}</span>
        </div>
        <hr className="my-4 border-t-0.5 border-gray-300" />
        <div className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">Preferences</span>
          <span className="text-sm font-medium">{pet.preferences}</span>
        </div>
      </div>
    </div>
  )
}

export default PetCard
