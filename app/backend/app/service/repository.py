from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select, update, delete, and_
from .models import Service, OfferedService
from .enums import Day
from app.location.models import Location
from app.util.repository import db_add
from typing import List, Dict, Any
from uuid import UUID
from typing import Optional


class ServiceRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def create_service(self, *, service_new: Service) -> None:
        db_add(self.db_session, service_new)

    def create_offered_service(self, *, offered_service_new: OfferedService) -> None:
        db_add(self.db_session, offered_service_new)

    def get_offered_service_by_id(self, offered_service_id: int) -> Optional[OfferedService]:
        stmt = select(OfferedService).where(OfferedService.id == offered_service_id)
        return self.db_session.execute(stmt).scalar_one_or_none()

    def get_services(self) -> List[Service]:
        stmt = select(Service)
        return list(self.db_session.execute(stmt).scalars().all())

    def get_offered_service_by_service_caretaker_id(
        self, *, service_id: int, caretaker_id: UUID
    ) -> Optional[OfferedService]:
        stmt = select(OfferedService).where(
            and_(OfferedService.service_id == service_id, OfferedService.caretaker_id == caretaker_id)
        )
        return self.db_session.execute(stmt).scalar_one_or_none()

    def get_offered_services_by_profile_id(self, *, profile_id: UUID) -> List[OfferedService]:
        stmt = (
            select(OfferedService)
            .join(Service, OfferedService.service_id == Service.id)
            .where(OfferedService.caretaker_id == profile_id)
        )
        return list(self.db_session.execute(stmt).scalars().all())

    def get_offered_services(self) -> List[OfferedService]:
        stmt = select(OfferedService).join(Service, OfferedService.service_id == Service.id)
        return list(self.db_session.execute(stmt).scalars().all())

    def update_offered_service(self, offered_service_id: int, values: Dict[str, Any]) -> None:
        location_ids = values.pop("locations", None)

        stmt = update(OfferedService).where(OfferedService.id == offered_service_id).values(**values)
        self.db_session.execute(stmt)
        self.db_session.flush()

        if location_ids is not None:
            offered_service = self.get_offered_service_by_id(offered_service_id=offered_service_id)
            if offered_service:
                locations = self.db_session.query(Location).filter(Location.id.in_(location_ids)).all()
                offered_service.locations = locations
                self.db_session.flush()

    def delete_offered_service(self, offered_service_id: int) -> None:
        stmt = delete(OfferedService).where(OfferedService.id == offered_service_id)
        self.db_session.execute(stmt)

    def search_offered_service(
        self,
        *,
        services: Optional[List[int]] = None,
        locations: Optional[List[int]] = None,
        availability: Optional[List[Day]] = None,
        max_rate: Optional[int] = None,
        limit: int = 10,
        skip: int = 0,
    ) -> List[OfferedService]:
        stmt = select(OfferedService).options(
            selectinload(OfferedService.locations),
            selectinload(OfferedService.service_bookings),
        )
        # Filter by service IDs
        if services:
            stmt = stmt.where(OfferedService.service_id.in_(services))

        # Filter by maximum rate
        if max_rate is not None:
            stmt = stmt.where(OfferedService.rate <= max_rate)

        # Filter by availability (day array column)
        if availability:
            # days = [day.value for day in availability]
            stmt = stmt.where(OfferedService.day.contains(availability))

        # Filter by locations (many-to-many relationship)
        if locations:
            stmt = stmt.join(OfferedService.locations).where(Location.id.in_(locations))

        stmt = stmt.limit(limit).offset(skip)

        result = self.db_session.execute(stmt)
        return list(result.scalars().all())
