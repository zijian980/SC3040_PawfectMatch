from sqlalchemy.orm import Session
from sqlalchemy import delete, select
from .models import PetOwner
from app.util.repository import db_add
from uuid import UUID
from typing import Optional


class PetOwnerRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def create_petowner(self, *, petowner_new: PetOwner) -> None:
        db_add(self.db_session, petowner_new)

    def delete_petowner(self, *, petowner_id: UUID) -> None:
        stmt = delete(PetOwner).where(PetOwner.id == petowner_id)
        self.db_session.execute(stmt)

    def get_petowner_by_id(self, *, petowner_id: UUID) -> Optional[PetOwner]:
        stmt = select(PetOwner).where(PetOwner.id == petowner_id)
        return self.db_session.execute(stmt).scalar_one_or_none()
