from .protocols import ExternalPetService, InternalPetService
from typing import Annotated
from fastapi import Depends
from app.database.core import DbSession
from app.petowner.dependency import ExternalPetOwnerSvc as PetOwnerSvc
from .repository import PetRepository
from .service import PetService


async def get_pet_repo(db_session: DbSession) -> PetRepository:
    return PetRepository(db_session)


async def get_pet_service(petowner_service: PetOwnerSvc, repo: PetRepository = Depends(get_pet_repo)) -> PetService:
    return PetService(repo=repo, petowner_service=petowner_service)


InternalPetSvc = Annotated[InternalPetService, Depends(get_pet_service)]
ExternalPetSvc = Annotated[ExternalPetService, Depends(get_pet_service)]
