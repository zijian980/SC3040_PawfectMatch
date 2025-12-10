from .repository import PetCareTakerRepository
from .service import PetCareTakerService
from app.database.core import DbSession
from fastapi import Depends
from typing import Annotated
from .protocols import ExternalPetCareTakerService, InternalPetCareTakerService


async def get_petcaretaker_repo(db_session: DbSession) -> PetCareTakerRepository:
    return PetCareTakerRepository(db_session)


async def get_petcaretaker_service(
    repo: PetCareTakerRepository = Depends(get_petcaretaker_repo),
) -> PetCareTakerService:
    return PetCareTakerService(repo)


InternalPetCareTakerSvc = Annotated[InternalPetCareTakerService, Depends(get_petcaretaker_service)]
ExternalPetCareTakerSvc = Annotated[ExternalPetCareTakerService, Depends(get_petcaretaker_service)]
