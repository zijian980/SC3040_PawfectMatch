from pydantic import BaseModel, Field


class Review(BaseModel):
    id: int
    service_booking_id: int
    description: str
    rating: int = Field(..., ge=0, le=5)
    isAnonymouse: bool
    model_config = {"from_attributes": True}


class ReviewCreate(BaseModel):
    service_booking_id: int
    description: str
    rating: int = Field(..., ge=0, le=5)
    isAnonymouse: bool
