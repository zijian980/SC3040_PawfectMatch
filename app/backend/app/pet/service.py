from .protocols import InternalPetService
from .schemas import PetCreate, Pet as PetDTO
from .models import Pet
from .repository import PetRepository
from uuid import UUID
from typing import List
from .exceptions import PetNotExists, PetPermissionDenied
from app.petowner.protocols import ExternalPetOwnerService as PetOwnerService


class PetService(InternalPetService):
    """
    Concrete implementation of the InternalPetService protocol.

    Handles creation of pets using the repository pattern.
    """

    def __init__(self, repo: PetRepository, petowner_service: PetOwnerService):
        """
        Initialize PetService with a repository.

        Args:
            repo (PetRepository): Repository for database operations on pets.
        """
        self.repo = repo
        self.petowner_service = petowner_service

    def create_pet(self, *, owner_id: UUID, pet_new: PetCreate) -> None:
        """
        Create a new pet for the specified owner and persist it to the database.

        Args:
            owner_id (UUID): The ID of the pet owner.
            pet_new (PetCreate): Data for the new pet.
        """
        self.petowner_service.get_pet_owner(petowner_id=owner_id)
        new_pet = Pet(**pet_new.model_dump())
        new_pet.owner_id = owner_id
        self.repo.create_pet(pet_new=new_pet)

    def delete_pet(self, *, owner_id: UUID, pet_id: int) -> None:
        """
        Deletes a pet owned by the given profile.

        Args:
            owner_id (UUID): Owner profile identifier.
            pet_id (int): Pet identifier.

        Raises:
            PetNotExists: If the pet does not exist.
            PetPermissionDenied: If the pet is not owned by the given owner.
        """
        self.petowner_service.get_pet_owner(petowner_id=owner_id)
        pet = self.repo.get_pet(pet_id=pet_id)
        if not pet:
            raise PetNotExists("Pet doesn't exist")
        elif pet.owner_id != owner_id:
            raise PetPermissionDenied(f"Not allowed to perform this action on Pet ID: {pet.id}")
        self.repo.delete_pet(pet_id=pet_id)

    def get_pet(self, *, owner_id: UUID, pet_id: int) -> PetDTO:
        """
        Retrieves a pet by ID for the given owner.

        Args:
            owner_id (UUID): Owner profile identifier.
            pet_id (int): Pet identifier.

        Returns:
            PetDTO: Data transfer object of the pet.

        Raises:
            PetNotExists: If the pet does not exist.
            PetPermissionDenied: If the pet is not owned by the given owner.
        """
        petowner = self.petowner_service.get_pet_owner(petowner_id=owner_id)
        pet = self.repo.get_pet(pet_id=pet_id)
        if not pet:
            raise PetNotExists("Pet doesn't exist")
        elif petowner and petowner.id != pet.owner_id:
            raise PetPermissionDenied(f"Not allowed to perform this action on Pet ID: {pet.id}")
        petDTO = PetDTO.model_validate(pet)
        return petDTO

    def get_pets_by_owner_id(self, *, owner_id: UUID) -> List[PetDTO]:
        """
        Retrieves all pets owned by a profile.

        Args:
            owner_id (UUID): Owner profile identifier.

        Returns:
            List[PetDTO]: List of pet DTOs.
        """
        self.petowner_service.get_pet_owner(petowner_id=owner_id)
        pets = self.repo.get_pets_by_owner_id(owner_id=owner_id)
        petDTOs = []
        for pet in pets:
            petDTO = PetDTO.model_validate(pet)
            petDTOs.append(petDTO)
        return petDTOs
