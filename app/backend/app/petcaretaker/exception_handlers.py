from fastapi.requests import Request
from fastapi.responses import JSONResponse
from fastapi import status
from .exceptions import PetCareTakerNotFound


async def petcaretaker_not_found_exception_handler(request: Request, exc: PetCareTakerNotFound) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"message": str(exc)},
    )
