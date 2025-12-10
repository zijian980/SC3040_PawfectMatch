from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select, or_, update, and_
from .models import Billing
from app.util.repository import db_add
from typing import Optional, List
from app.booking.models import ServiceBooking
from app.pet.models import Pet
from app.service.models import OfferedService
from uuid import UUID
from datetime import datetime
from .enums import PayStatus


class BillingRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def create_billing(self, *, billing_new: Billing) -> None:
        db_add(self.db_session, billing_new)

    def get_billing(self, *, caller_id: UUID, billing_id: int) -> Optional[Billing]:
        stmt = (
            select(Billing)
            .join(Billing.service_booking)
            .join(ServiceBooking.pet)
            .where(and_(Pet.owner_id == caller_id, Billing.id == billing_id))
            .options(selectinload(Billing.service_booking).selectinload(ServiceBooking.pet))
        )
        result = self.db_session.execute(stmt).scalar_one_or_none()
        return result

    def get_all_bills(self, *, caller_id: UUID) -> List[Billing]:
        stmt = (
            select(Billing)
            .join(Billing.service_booking)
            .join(ServiceBooking.pet)
            .join(ServiceBooking.offered_service)
            .where(or_(Pet.owner_id == caller_id, OfferedService.caretaker_id == caller_id))
            .options(
                selectinload(Billing.service_booking).selectinload(ServiceBooking.pet),
                selectinload(Billing.service_booking).selectinload(ServiceBooking.offered_service),
            )
        )
        results = self.db_session.execute(stmt).scalars().all()
        return list(results)

    def update_bill(self, *, billing_id: int, paid_at: datetime, status: PayStatus) -> None:
        stmt = update(Billing).where(Billing.id == billing_id).values(paid_at=paid_at, status=status)
        self.db_session.execute(stmt)
