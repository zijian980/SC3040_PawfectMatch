from pydantic import BaseModel
from datetime import datetime
from .enums import PayStatus
from typing import Optional


class Payment(BaseModel):
    id: int
    amount_paid: float

    model_config = {"from_attributes": True}


class OfferedServiceDetails(BaseModel):
    rate: int
    model_config = {"from_attributes": True}


class ServiceBookingDetails(BaseModel):
    offered_service: OfferedServiceDetails
    model_config = {"from_attributes": True}


class Billing(BaseModel):
    id: int
    total_payable: float
    paid_at: Optional[datetime] = None
    payment: Optional[Payment] = None
    status: PayStatus
    service_booking: ServiceBookingDetails

    model_config = {"from_attributes": True}


class BillingCreate(BaseModel):
    total_payable: float
