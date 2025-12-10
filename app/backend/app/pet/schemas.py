from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class ProfileDetails(BaseModel):
    first_name: str
    last_name: str

    model_config = {"from_attributes": True}


class OwnerDetails(BaseModel):
    id: UUID
    profile: ProfileDetails

    model_config = {"from_attributes": True}


class Pet(BaseModel):
    id: int
    owner: OwnerDetails
    name: str
    species: str
    breed: str
    age: int
    health: Optional[str] = None
    preferences: Optional[str] = None

    model_config = {"from_attributes": True}


class PetCreate(BaseModel):
    """
    Schema for creating a new pet.

    Attributes:
        name (str): Name of the pet.
        species (str): Species of the pet (e.g., dog, cat).
        breed (str): Breed of the pet.
        age (int): Age of the pet.
        health (Optional[str]): Health status of the pet. Defaults to None, stored as "Healthy" in DB if not provided.
        preferences (Optional[str]): Pet-specific preferences or notes. Defaults to None, stored as "NIL" in DB if not provided.
    """

    name: str
    species: str
    breed: str
    age: int
    health: Optional[str] = None
    preferences: Optional[str] = None
