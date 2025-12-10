from fastapi import status
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from .exceptions import ProfileAlreadyExists, ProfileNotExists, ProfileAlreadyOnboarded


async def profile_exists_exception_handler(request: Request, exc: ProfileAlreadyExists) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"message": str(exc)},
    )


async def profile_onboarded_exception_handler(request: Request, exc: ProfileAlreadyOnboarded) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"message": str(exc)},
    )


async def profile_not_exists_exception_handler(request: Request, exc: ProfileNotExists) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"message": str(exc)},
    )
