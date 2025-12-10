from pydantic import BaseModel
from typing import List, Optional
from .enums import Day
from uuid import UUID


class Service(BaseModel):
    """
    Pydantic schema representing a service.
    """

    id: int
    name: str

    model_config = {"from_attributes": True}


class ServiceDetails(BaseModel):
    id: int
    name: str

    model_config = {"from_attributes": True}


class ProfileDetails(BaseModel):
    first_name: str
    last_name: str

    model_config = {"from_attributes": True}


class CareTakerDetails(BaseModel):
    id: UUID
    yoe: int
    profile: ProfileDetails

    model_config = {"from_attributes": True}


class LocationDetails(BaseModel):
    id: int
    name: str

    model_config = {"from_attributes": True}


class OfferedService(BaseModel):
    """
    Pydantic schema representing an offered service by a caretaker.
    """

    id: int
    service: ServiceDetails
    petcaretaker: CareTakerDetails
    locations: List[LocationDetails]
    day: List[Day]
    rate: int

    model_config = {"from_attributes": True}


class OfferedServiceCreate(BaseModel):
    """
    Schema for creating a new OfferedService.
    """

    service_id: int
    rate: int
    day: List[Day]
    locations: List[int]


class OfferedServiceUpdate(BaseModel):
    rate: int
    day: List[Day]
    locations: List[int]


class OfferedServiceSearch(BaseModel):
    """
    Schema for offered services search parameters
    """

    service_id: Optional[List[int]] = None
    location_id: Optional[List[int]] = None
    availability: Optional[List[Day]] = None
    max_rate: Optional[int] = None
    limit: int = 10
    skip: int = 0
