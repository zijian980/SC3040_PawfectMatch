from fastapi import Depends
from app.database.core import DbSession
from .repository import BookingRepository
from .protocols import InternalBookingService, ExternalBookingService
from .service import BookingService
from app.pet.dependency import ExternalPetSvc as PetSvc
from typing import Annotated
from app.billing.dependency import ExternalBillingSvc as BillingSvc
from app.payment.dependency import ExternalPaymentSvc as PaymentSvc


async def get_booking_repo(db_session: DbSession) -> BookingRepository:
    return BookingRepository(db_session=db_session)


async def get_booking_service(
    payment_service: PaymentSvc,
    billing_service: BillingSvc,
    pet_service: PetSvc,
    repo: BookingRepository = Depends(get_booking_repo),
) -> BookingService:
    return BookingService(
        repo=repo, pet_service=pet_service, billing_service=billing_service, payment_service=payment_service
    )


ExternalBookingSvc = Annotated[ExternalBookingService, Depends(get_booking_service)]
InternalBookingSvc = Annotated[InternalBookingService, Depends(get_booking_service)]
