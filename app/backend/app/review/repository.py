from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select
from .models import Review
from typing import List, Optional
from uuid import UUID
from app.util.repository import db_add
from app.booking.models import ServiceBooking
from app.service.models import OfferedService


class ReviewRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def create_review(self, *, review_new: Review) -> None:
        db_add(self.db_session, review_new)

    def get_reviews_by_offered_service_id(self, *, offered_service_id: int) -> List[Review]:
        stmt = (
            select(Review)
            .join(Review.service_booking)
            .join(ServiceBooking.offered_service)
            .where(OfferedService.id == offered_service_id)
            .options(selectinload(Review.service_booking).selectinload(ServiceBooking.offered_service))
        )
        results = self.db_session.execute(stmt).scalars().all()
        return list(results)

    def get_reviews_by_caretaker_id(self, *, caretaker_id: UUID) -> List[Review]:
        stmt = (
            select(Review)
            .join(Review.service_booking)
            .join(ServiceBooking.offered_service)
            .where(OfferedService.caretaker_id == caretaker_id)
            .options(selectinload(Review.service_booking).selectinload(ServiceBooking.offered_service))
        )
        results = self.db_session.execute(stmt).scalars().all()
        return list(results)

    def get_review_by_reviewer_id(self, *, reviewer_id: UUID, review_id: int) -> Optional[Review]:
        stmt = select(Review).where(Review.id == review_id and Review.service_booking.pet.caretaker_id == reviewer_id)
        return self.db_session.execute(stmt).scalar_one_or_none()

    def get_review(self, *, review_id: int) -> Optional[Review]:
        stmt = select(Review).where(Review.id == review_id)
        return self.db_session.execute(stmt).scalar_one_or_none()
