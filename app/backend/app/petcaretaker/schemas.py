from pydantic import BaseModel, field_validator
from uuid import UUID


class PetCareTaker(BaseModel):
    """
    Schema representing a PetCareTaker.

    Attributes:
        id (UUID): ID of the PetCareTaker.
        yoe (int): Years of experience. Must be >= 0.
    """

    id: UUID
    yoe: int

    @field_validator("yoe")
    def yoe_gt_zero(cls, value: int) -> int:
        if value < 0:
            raise ValueError("Years of Experience(yoe) must be 0 or greater")
        return value


class PetCareTakerCreate(PetCareTaker):
    """
    Schema for creating a new PetCareTaker.
    Inherits all fields from PetCareTaker.
    """

    pass


class PetCareTakerUpdate(BaseModel):
    """
    Schema for updating a PetCareTaker's information.

    Attributes:
        yoe (int): Updated years of experience. Must be >= 0.
    """

    yoe: int

    @field_validator("yoe")
    def yoe_gt_zero(cls, value: int) -> int:
        if value < 0:
            raise ValueError("Years of Experience(yoe) must be 0 or greater")
        return value
