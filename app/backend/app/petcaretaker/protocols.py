from typing import Protocol
from .schemas import PetCareTaker as PetCareTakerDTO, PetCareTakerCreate, PetCareTakerUpdate
from uuid import UUID


class ExternalPetCareTakerService(Protocol):
    """
    External-facing protocol for PetCareTaker services.
    """

    def create_petcaretaker(self, *, petcaretaker_new: PetCareTakerCreate) -> None: ...
    def update_petcaretaker(self, *, petcaretaker_id: UUID, petcaretaker_update: PetCareTakerUpdate) -> None: ...
    def delete_petcaretaker(self, *, petcaretaker_id: UUID) -> None: ...


class InternalPetCareTakerService(ExternalPetCareTakerService, Protocol):
    """
    Internal-facing protocol for PetCareTaker services.
    Extends the external protocol with internal operations.
    """

    def get_petcaretaker(self, *, petcaretaker_id: UUID) -> PetCareTakerDTO: ...
