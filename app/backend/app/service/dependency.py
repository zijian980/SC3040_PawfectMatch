from .repository import ServiceRepository
from .service import ServiceService
from app.database.core import DbSession
from fastapi import Depends
from typing import Annotated
from .protocols import InternalServiceService, ExternalServiceService
from app.location.dependency import ExternalLocationSvc as LocationSvc


async def get_service_repo(db_session: DbSession) -> ServiceRepository:
    return ServiceRepository(db_session=db_session)


async def get_service_service(
    location_service: LocationSvc, repo: ServiceRepository = Depends(get_service_repo)
) -> ServiceService:
    return ServiceService(repo=repo, location_service=location_service)


InternalServiceSvc = Annotated[InternalServiceService, Depends(get_service_service)]
ExternalServiceSvc = Annotated[ExternalServiceService, Depends(get_service_service)]
