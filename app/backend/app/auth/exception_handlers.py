from fastapi import Request, status
from .exceptions import InvalidCredentials, EmailAlreadyExists, PasswordMismatch
from fastapi.responses import JSONResponse


async def invalid_credentials_exception_handler(request: Request, exc: InvalidCredentials) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"message": str(exc)},
    )


async def email_exists_exception_handler(request: Request, exc: EmailAlreadyExists) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={"message": str(exc)},
    )


async def password_mismatch_exception_handler(request: Request, exc: PasswordMismatch) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"message": str(exc)},
    )
