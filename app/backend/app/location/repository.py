from sqlalchemy.orm import Session
from .models import Location
from app.util.repository import db_add
from typing import List
from sqlalchemy import select


class LocationRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def create_location(self, *, location_new: Location) -> None:
        db_add(self.db_session, location_new)

    def get_all_locations(self) -> List[Location]:
        stmt = select(Location)
        result = self.db_session.execute(stmt).scalars().all()
        return list(result)

    def get_filtered_locations(self, location_ids: List[int]) -> List[Location]:
        stmt = select(Location).where(Location.id.in_(location_ids))
        locations = self.db_session.execute(stmt).scalars().all()
        return list(locations)
