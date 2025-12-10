from .dependency import InternalLocationSvc as LocationSvc
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi import APIRouter, status

location_router = APIRouter()


@location_router.get("")
def get_all_locations(location_service: LocationSvc) -> JSONResponse:
    all_locations = location_service.get_locations()
    return JSONResponse(status_code=status.HTTP_200_OK, content=jsonable_encoder(all_locations))
