from pydantic import BaseModel
from .enums import Status as StatusEnum
from uuid import UUID
from datetime import datetime


class BookingCreate(BaseModel):
    date: datetime
    offered_service_id: int
    pet_id: int


class BookingPet(BaseModel):
    id: int
    name: str
    species: str
    breed: str
    age: int
    health: str
    preferences: str
    owner_id: UUID

    model_config = {"from_attributes": True}


class BookingOfferedServiceService(BaseModel):
    id: int
    name: str

    model_config = {"from_attributes": True}


class BookingOfferedService(BaseModel):
    id: int
    caretaker_id: UUID
    service: BookingOfferedServiceService
    model_config = {"from_attributes": True}


class Booking(BaseModel):
    id: int
    status: StatusEnum
    date: datetime
    offered_service: BookingOfferedService
    pet: BookingPet

    model_config = {"from_attributes": True}
