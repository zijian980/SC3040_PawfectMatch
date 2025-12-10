from fastapi import status, Depends
from fastapi.requests import Request
from fastapi.exceptions import HTTPException
from app.database.core import DbSession
from .service import AuthService
from .repository import AuthRepository
from uuid import UUID
from typing import Annotated


async def get_auth_repo(db_session: DbSession) -> AuthRepository:
    return AuthRepository(db_session)


async def get_auth_service(repo: AuthRepository = Depends(get_auth_repo)) -> AuthService:
    return AuthService(repo)


async def get_current_id(request: Request, service: AuthService = Depends(get_auth_service)) -> UUID:
    session_id = request.state.session_id
    auth_id = service.retrieve_auth_id_by_session(session_id=session_id)
    if not auth_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    return auth_id


CurrentId = Annotated[UUID, Depends(get_current_id)]
InternalAuthSvc = Annotated[AuthService, Depends(get_auth_service)]
