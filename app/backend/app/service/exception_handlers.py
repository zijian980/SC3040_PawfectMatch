from .exceptions import CareTakerOfferedServiceExists, OfferedServiceNotExists
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from fastapi import status


async def caretaker_offered_svc_exists_exception_handler(
    request: Request, exc: CareTakerOfferedServiceExists
) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"message": str(exc)},
    )


async def offered_svc_not_exists_exception_handler(request: Request, exc: OfferedServiceNotExists) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"message": str(exc)},
    )
