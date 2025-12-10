from sqlalchemy.orm import Session, joinedload
from .models import ServiceBooking
from app.util.repository import db_add, get_by_field
from sqlalchemy import update, select, or_
from typing import Optional, List
from uuid import UUID
from app.service.models import OfferedService
from app.pet.models import Pet
from .enums import Status


class BookingRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def get_service_booking(self, *, booking_id: int) -> Optional[ServiceBooking]:
        return get_by_field(self.db_session, ServiceBooking, "id", booking_id)

    def get_service_bookings_by_caller_id(self, *, caller_id: UUID) -> List[ServiceBooking]:
        stmt = (
            select(ServiceBooking)
            .join(ServiceBooking.offered_service)  # join offered_service table
            .join(ServiceBooking.pet)  # join pet table
            .where(or_(OfferedService.caretaker_id == caller_id, Pet.owner_id == caller_id))
            .options(joinedload(ServiceBooking.offered_service), joinedload(ServiceBooking.pet))
        )
        results = self.db_session.execute(stmt).scalars().all()
        return list(results)

    def create_service_booking(self, *, service_booking_new: ServiceBooking) -> None:
        db_add(self.db_session, service_booking_new)

    def update_service_booking_status(self, *, booking_id: int, status: Status) -> None:
        stmt = update(ServiceBooking).where(ServiceBooking.id == booking_id).values(status=status)
        self.db_session.execute(stmt)
