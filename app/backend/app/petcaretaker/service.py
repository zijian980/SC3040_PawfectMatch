from .protocols import InternalPetCareTakerService
from .repository import PetCareTakerRepository
from .models import PetCareTaker
from .schemas import PetCareTakerCreate, PetCareTaker as PetCareTakerDTO, PetCareTakerUpdate
from uuid import UUID
from .exceptions import PetCareTakerNotFound


class PetCareTakerService(InternalPetCareTakerService):
    """
    Concrete implementation of PetCareTaker services.

    Handles creation, retrieval, update, and deletion of PetCareTaker entities.
    """

    def __init__(self, repo: PetCareTakerRepository):
        """
        Initialize PetCareTakerService with a repository.

        Args:
            repo (PetCareTakerRepository): Repository for database operations.
        """
        self.repo = repo

    def get_petcaretaker(self, *, petcaretaker_id: UUID) -> PetCareTakerDTO:
        """
        Retrieve a PetCareTaker by ID.

        Raises:
            PetCareTakerNotFound: If the PetCareTaker does not exist.

        Returns:
            PetCareTaker: The corresponding PetCareTaker schema.
        """
        petcaretaker = self.repo.get_petcaretaker_by_id(petcaretaker_id=petcaretaker_id)
        if not petcaretaker:
            raise PetCareTakerNotFound("PetCareTaker not found")
        return PetCareTakerDTO.model_validate(petcaretaker.dict())

    def create_petcaretaker(self, *, petcaretaker_new: PetCareTakerCreate) -> None:
        """
        Create a new PetCareTaker.
        """
        new_petcaretaker = PetCareTaker(**petcaretaker_new.model_dump())
        self.repo.create_petcaretaker(petcaretaker_new=new_petcaretaker)

    def update_petcaretaker(self, *, petcaretaker_id: UUID, petcaretaker_update: PetCareTakerUpdate) -> None:
        """
        Update an existing PetCareTaker's information.

        Raises:
            PetCareTakerNotFound: If the PetCareTaker does not exist.
        """
        petcaretaker = self.repo.get_petcaretaker_by_id(petcaretaker_id=petcaretaker_id)
        if not petcaretaker:
            raise PetCareTakerNotFound("PetCareTaker not found")
        self.repo.update_petcaretaker(petcaretaker_id=petcaretaker_id, petcaretaker_update=petcaretaker_update)

    def delete_petcaretaker(self, *, petcaretaker_id: UUID) -> None:
        """
        Delete a PetCareTaker by ID.
        """
        self.repo.delete_petcaretaker(petcaretaker_id=petcaretaker_id)
