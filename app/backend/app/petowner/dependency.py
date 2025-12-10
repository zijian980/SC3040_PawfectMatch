from .repository import PetOwnerRepository
from .service import PetOwnerService
from .protocols import InternalPetOwnerService, ExternalPetOwnerService
from app.database.core import DbSession
from typing import Annotated
from fastapi import Depends


async def get_petowner_repo(db_session: DbSession) -> PetOwnerRepository:
    return PetOwnerRepository(db_session)


async def get_petowner_service(repo: PetOwnerRepository = Depends(get_petowner_repo)) -> PetOwnerService:
    return PetOwnerService(repo)


ExternalPetOwnerSvc = Annotated[ExternalPetOwnerService, Depends(get_petowner_service)]
InternalPetOwnerSvc = Annotated[InternalPetOwnerService, Depends(get_petowner_service)]
