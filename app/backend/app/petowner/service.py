from .protocols import InternalPetOwnerService
from .repository import PetOwnerRepository
from .schemas import PetOwnerCreate, PetOwner as PetOwnerDTO
from .models import PetOwner
from .exceptions import PetOwnerExists, PetOwnerNotExists
from uuid import UUID


class PetOwnerService(InternalPetOwnerService):
    """
    Concrete implementation of the InternalPetOwnerService protocol.

    Handles creation and deletion of PetOwner entities using the repository pattern.
    """

    def __init__(self, repo: PetOwnerRepository):
        """
        Initialize PetOwnerService with a repository.

        Args:
            repo (PetOwnerRepository): Repository for database operations on PetOwner.
        """
        self.repo = repo

    def create_pet_owner(self, *, petowner_new: PetOwnerCreate) -> None:
        """
        Create a new PetOwner and persist it to the database.

        Args:
            petowner_new (PetOwnerCreate): Data for the new PetOwner.

        Returns:
            PetOwner: The created PetOwner instance.
        """
        petowner = self.repo.get_petowner_by_id(petowner_id=petowner_new.id)
        if petowner:
            raise PetOwnerExists("Pet owner profile already exist")
        new_petowner = PetOwner(**petowner_new.model_dump())
        self.repo.create_petowner(petowner_new=new_petowner)

    def delete_pet_owner(self, *, petowner_id: UUID) -> None:
        """
        Delete an existing PetOwner by their ID.

        Args:
            petowner_id (UUID): The ID of the PetOwner to delete.
        """
        self.repo.delete_petowner(petowner_id=petowner_id)

    def get_pet_owner(self, *, petowner_id: UUID) -> PetOwnerDTO:
        petowner = self.repo.get_petowner_by_id(petowner_id=petowner_id)
        if not petowner:
            raise PetOwnerNotExists("Pet owner profile doesn't exist")
        petownerDTO = PetOwnerDTO.model_validate(petowner)
        return petownerDTO
