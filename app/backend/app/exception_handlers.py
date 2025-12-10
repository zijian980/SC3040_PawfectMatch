from app.auth.exception_handlers import (
    invalid_credentials_exception_handler,
    email_exists_exception_handler,
    password_mismatch_exception_handler,
)
from app.auth.exceptions import InvalidCredentials, EmailAlreadyExists, PasswordMismatch
from app.profile.exception_handlers import (
    profile_onboarded_exception_handler,
)
from app.profile.exceptions import ProfileAlreadyOnboarded
from app.service.exception_handlers import (
    caretaker_offered_svc_exists_exception_handler,
)
from app.service.exceptions import CareTakerOfferedServiceExists
from app.exceptions import InsufficientPermissions, ResourceNotExists, ResourceAlreadyExists
from fastapi import FastAPI, status
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    msg = str(exc.errors()[0]["msg"])
    msg = msg.removeprefix("Value error, ")
    return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, content={"message": msg})


async def insufficient_permissions_exception_handler(request: Request, exc: InsufficientPermissions) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN,
        content={"message": str(exc)},
    )


async def resource_not_exists_exception_handler(request: Request, exc: ResourceNotExists) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"message": str(exc)},
    )


async def resource_exists_exception_handler(request: Request, exc: ResourceAlreadyExists) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={"message": str(exc)},
    )


def register_exception_handlers(app: FastAPI) -> None:
    # Global
    # app.add_exception_handler(RequestValidationError, validation_exception_handler)  # type: ignore[arg-type]
    app.add_exception_handler(InsufficientPermissions, insufficient_permissions_exception_handler)  # type: ignore[arg-type]
    app.add_exception_handler(ResourceNotExists, resource_not_exists_exception_handler)  # type: ignore[arg-type]
    app.add_exception_handler(ResourceAlreadyExists, resource_exists_exception_handler)  # type: ignore[arg-type]
    # Auth
    app.add_exception_handler(InvalidCredentials, invalid_credentials_exception_handler)  # type: ignore[arg-type]
    app.add_exception_handler(EmailAlreadyExists, email_exists_exception_handler)  # type: ignore[arg-type]
    app.add_exception_handler(PasswordMismatch, password_mismatch_exception_handler)  # type: ignore[arg-type]
    # Profile
    app.add_exception_handler(ProfileAlreadyOnboarded, profile_onboarded_exception_handler)  # type: ignore[arg-type]
    # PetCareTaker
    # Service
    app.add_exception_handler(CareTakerOfferedServiceExists, caretaker_offered_svc_exists_exception_handler)  # type: ignore[arg-type]
