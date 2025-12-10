from .protocols import InternalBookingService
from .repository import BookingRepository
from .schemas import BookingCreate, Booking as BookingDTO
from .models import ServiceBooking
from .enums import Status as StatusEnum
from .exceptions import BookingNotExists, BookingPermissionDenied
from typing import List
from uuid import UUID
from app.pet.protocols import ExternalPetService as PetService
from app.billing.protocols import ExternalBillingService as BillingService
from app.billing.schemas import BillingCreate
from app.payment.protocols import ExternalPaymentService as PaymentService
from app.payment.schemas import PaymentCreate


class BookingService(InternalBookingService):
    def __init__(
        self,
        repo: BookingRepository,
        pet_service: PetService,
        billing_service: BillingService,
        payment_service: PaymentService,
    ):
        self.repo = repo
        self.pet_service = pet_service
        self.billing_service = billing_service
        self.payment_service = payment_service

    def create_booking(self, *, owner_id: UUID, booking_create: BookingCreate) -> int:
        # Add check for unique pet_id, offered_service_id, date
        self.pet_service.get_pet(owner_id=owner_id, pet_id=booking_create.pet_id)
        new_booking = ServiceBooking(**booking_create.model_dump())
        self.repo.create_service_booking(service_booking_new=new_booking)
        return new_booking.id

    def accept_booking(self, *, caretaker_id: UUID, booking_id: int) -> None:
        booking = self.repo.get_service_booking(booking_id=booking_id)
        if not booking:
            raise BookingNotExists("Booking doesn't exist")
        elif booking.offered_service.caretaker_id != caretaker_id:
            raise BookingPermissionDenied("Not authorized to perform this action")
        self.repo.update_service_booking_status(booking_id=booking_id, status=StatusEnum.Accepted)

    def decline_booking(self, *, caretaker_id: UUID, booking_id: int) -> None:
        booking = self.repo.get_service_booking(booking_id=booking_id)
        if not booking:
            raise BookingNotExists("Booking doesn't exist")
        elif booking.offered_service.caretaker_id != caretaker_id:
            raise BookingPermissionDenied("Not authorized to perform this action")
        self.repo.update_service_booking_status(booking_id=booking_id, status=StatusEnum.Declined)

    def cancel_booking(self, *, caller_id: UUID, booking_id: int) -> None:
        booking = self.repo.get_service_booking(booking_id=booking_id)
        if not booking:
            raise BookingNotExists("Booking doesn't exist")
        elif not (booking.pet.owner_id == caller_id) != (booking.offered_service.caretaker_id == caller_id):
            raise BookingPermissionDenied("Not authorized to perform this action")
        self.repo.update_service_booking_status(booking_id=booking_id, status=StatusEnum.Cancelled)

    def pending_payment_booking(self, *, caretaker_id: UUID, booking_id: int) -> None:
        booking = self.repo.get_service_booking(booking_id=booking_id)
        if not booking:
            raise BookingNotExists("Booking doesn't exist")
        elif booking.offered_service.caretaker_id != caretaker_id:
            raise BookingPermissionDenied("Not authorized to perform this action")
        elif booking.status != StatusEnum.Accepted:
            raise BookingPermissionDenied("Not authorized to perform this action")
        self.repo.update_service_booking_status(booking_id=booking_id, status=StatusEnum.PendingPayment)
        new_billing = BillingCreate(total_payable=booking.offered_service.rate)
        self.billing_service.create_billing(caller_id=caretaker_id, billing_id=booking_id, billing_new=new_billing)

    def _complete_booking(self, *, booking_id: int) -> None:
        booking = self.repo.get_service_booking(booking_id=booking_id)
        if not booking:
            raise BookingNotExists("Booking doesn't exist")
        elif booking.status != StatusEnum.PendingPayment:
            raise BookingPermissionDenied("Not authorized to perform this action")
        self.repo.update_service_booking_status(booking_id=booking_id, status=StatusEnum.Completed)

    def get_bookings_by_caller_id(self, *, caller_id: UUID) -> List[BookingDTO]:
        all_bookings = self.repo.get_service_bookings_by_caller_id(caller_id=caller_id)
        all_bookingsDTO = [BookingDTO.model_validate(booking) for booking in all_bookings]
        return all_bookingsDTO

    def get_booking(self, *, caller_id: UUID, booking_id: int) -> BookingDTO:
        booking = self.repo.get_service_booking(booking_id=booking_id)
        if not booking:
            raise BookingNotExists("Booking doesn't exist")
        elif not (booking.pet.owner_id == caller_id) != (booking.offered_service.caretaker_id == caller_id):
            raise BookingPermissionDenied("Not authorized to perform this action")
        return BookingDTO.model_validate(booking)

    def pay_booking_bill(self, *, caller_id: UUID, billing_id: int) -> None:
        bill = self.billing_service.get_billing(caller_id=caller_id, billing_id=billing_id)
        new_payment = PaymentCreate(billing_id=billing_id, amount_paid=bill.service_booking.offered_service.rate)
        self.payment_service.create_payment(caller_id=caller_id, payment_new=new_payment)
        self.billing_service.update_billing(caller_id=caller_id, billing_id=billing_id)
        self._complete_booking(booking_id=billing_id)
