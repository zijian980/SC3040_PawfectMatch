from sqlalchemy.orm import Session
from sqlalchemy import select, delete
from .models import Pet
from uuid import UUID
from app.util.repository import db_add
from typing import List, Optional


class PetRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def create_pet(self, *, pet_new: Pet) -> None:
        db_add(self.db_session, pet_new)

    def delete_pet(self, *, pet_id: int) -> None:
        stmt = delete(Pet).where(Pet.id == pet_id)
        self.db_session.execute(stmt)

    def get_pet(self, *, pet_id: int) -> Optional[Pet]:
        stmt = select(Pet).where(Pet.id == pet_id)
        pet = self.db_session.execute(stmt).scalar_one_or_none()
        return pet

    def get_pets_by_owner_id(self, *, owner_id: UUID) -> List[Pet]:
        stmt = select(Pet).where(Pet.owner_id == owner_id)
        pets = self.db_session.execute(stmt).scalars().all()
        return list(pets)
