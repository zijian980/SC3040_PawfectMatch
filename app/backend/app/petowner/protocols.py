from typing import Protocol
from .schemas import PetOwnerCreate, PetOwner as PetOwnerDTO
from uuid import UUID


class ExternalPetOwnerService(Protocol):
    """
    Protocol defining the external interface for PetOwner services.

    Intended for use by API routes or other modules interacting with PetOwner functionality.
    """

    def create_pet_owner(self, *, petowner_new: PetOwnerCreate) -> None:
        """
        Create a new PetOwner.

        Args:
            petowner_new (PetOwnerCreate): Schema containing the PetOwner's data.

        Returns:
            PetOwner: The created PetOwner instance.
        """

    def delete_pet_owner(self, *, petowner_id: UUID) -> None:
        """
        Delete an existing PetOwner by their ID.

        Args:
            petowner_id (UUID): The ID of the PetOwner to delete.
        """

    def get_pet_owner(self, *, petowner_id: UUID) -> PetOwnerDTO: ...


class InternalPetOwnerService(ExternalPetOwnerService, Protocol):
    """
    Protocol extending ExternalPetOwnerService with potential internal operations.

    Currently mirrors the external interface.
    """

    pass
