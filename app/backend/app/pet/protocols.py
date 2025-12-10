from typing import Protocol, List
from .schemas import PetCreate, Pet as PetDTO
from uuid import UUID


class ExternalPetService(Protocol):
    """
    Protocol defining the external interface for pet services.

    Intended for use by modules or routes that interact with pet functionality.
    """

    def create_pet(self, *, owner_id: UUID, pet_new: PetCreate) -> None: ...
    def get_pet(self, *, owner_id: UUID, pet_id: int) -> PetDTO: ...


class InternalPetService(ExternalPetService, Protocol):
    """
    Protocol for internal pet service operations.

    Currently mirrors ExternalPetService, but can be extended with internal-only methods in the future.
    """

    def delete_pet(self, *, owner_id: UUID, pet_id: int) -> None: ...
    def get_pets_by_owner_id(self, *, owner_id: UUID) -> List[PetDTO]: ...
