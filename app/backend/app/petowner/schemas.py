from pydantic import BaseModel
from uuid import UUID


class PetOwner(BaseModel):
    id: UUID

    model_config = {"from_attributes": True}


class PetOwnerCreate(PetOwner):
    """
    Schema for creating a new PetOwner.

    Attributes:
        id (UUID): ID of the profile that this PetOwner is linked to.
    """

    id: UUID
