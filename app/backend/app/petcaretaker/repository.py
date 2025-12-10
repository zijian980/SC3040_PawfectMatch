from sqlalchemy.orm import Session
from sqlalchemy import update, delete
from .models import PetCareTaker
from .schemas import PetCareTakerUpdate
from app.util.repository import db_add, get_by_field
from uuid import UUID
from typing import Optional


class PetCareTakerRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def get_petcaretaker_by_id(self, *, petcaretaker_id: UUID) -> Optional[PetCareTaker]:
        return get_by_field(self.db_session, PetCareTaker, "id", petcaretaker_id)

    def create_petcaretaker(self, *, petcaretaker_new: PetCareTaker) -> None:
        db_add(self.db_session, petcaretaker_new)

    def update_petcaretaker(self, *, petcaretaker_id: UUID, petcaretaker_update: PetCareTakerUpdate) -> None:
        values = petcaretaker_update.model_dump()
        stmt = update(PetCareTaker).where(PetCareTaker.id == petcaretaker_id).values(**values)
        self.db_session.execute(stmt)

    def delete_petcaretaker(self, *, petcaretaker_id: UUID) -> None:
        stmt = delete(PetCareTaker).where(PetCareTaker.id == petcaretaker_id)
        self.db_session.execute(stmt)
