from .repository import ProfileRepository
from .service import ProfileService
from .protocols import InternalProfileService, ExternalProfileService
from typing import Annotated
from app.database.core import DbSession
from fastapi import Depends


async def get_profile_repo(db_session: DbSession) -> ProfileRepository:
    return ProfileRepository(db_session=db_session)


async def get_profile_service(repo: ProfileRepository = Depends(get_profile_repo)) -> ProfileService:
    return ProfileService(repo)


InternalProfileSvc = Annotated[InternalProfileService, Depends(get_profile_service)]
ExternalProfileSvc = Annotated[ExternalProfileService, Depends(get_profile_service)]
