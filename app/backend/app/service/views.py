from fastapi import APIRouter, status, Path, Depends
from fastapi.responses import JSONResponse, Response
from fastapi.encoders import jsonable_encoder
from .dependency import InternalServiceSvc as ServiceSvc
from .schemas import OfferedServiceCreate, OfferedServiceUpdate, OfferedServiceSearch
from uuid import UUID
from app.auth.dependency import CurrentId

service_router = APIRouter()
offered_service_router = APIRouter()


@service_router.get("")
def get_services(service_service: ServiceSvc) -> JSONResponse:
    all_services = service_service.get_services()
    return JSONResponse(status_code=status.HTTP_200_OK, content=jsonable_encoder(all_services))


@offered_service_router.get("")
def get_offered_services(service_service: ServiceSvc) -> JSONResponse:
    all_offered_services = service_service.get_offered_services()
    return JSONResponse(status_code=status.HTTP_200_OK, content=jsonable_encoder(all_offered_services))


@offered_service_router.get("/me")
def get_user_offered_services(service_service: ServiceSvc, id: CurrentId) -> JSONResponse:
    offered_services = service_service.get_offered_services_by_profile_id(profile_id=id)
    return JSONResponse(status_code=status.HTTP_200_OK, content=jsonable_encoder(offered_services))


@offered_service_router.get("/{user_id}")
def get_offered_services_by_id(service_service: ServiceSvc, user_id: UUID = Path(...)) -> JSONResponse:
    offered_services = service_service.get_offered_services_by_profile_id(profile_id=user_id)
    return JSONResponse(status_code=status.HTTP_200_OK, content=jsonable_encoder(offered_services))


@offered_service_router.post("")
def create_offered_service(
    id: CurrentId, service_service: ServiceSvc, new_offered_svc_req: OfferedServiceCreate
) -> Response:
    service_service.create_offered_service(profile_id=id, offered_service_req=new_offered_svc_req)
    return Response(status_code=status.HTTP_201_CREATED)


@offered_service_router.patch("/{offered_svc_id}")
def update_offered_service(
    id: CurrentId,
    service_service: ServiceSvc,
    offered_svc_update_req: OfferedServiceUpdate,
    offered_svc_id: int = Path(...),
) -> Response:
    service_service.update_offered_service(
        caretaker_id=id, offered_service_id=offered_svc_id, offered_service_update=offered_svc_update_req
    )
    return Response(status_code=status.HTTP_200_OK)


@offered_service_router.delete("/{offered_svc_id}")
def delete_offered_service(id: CurrentId, service_service: ServiceSvc, offered_svc_id: int = Path(...)) -> Response:
    service_service.delete_offered_service(caretaker_id=id, offered_service_id=offered_svc_id)
    return Response(status_code=status.HTTP_200_OK)


@offered_service_router.get("/search")
def search_offered_service(service_service: ServiceSvc, params: OfferedServiceSearch = Depends()) -> JSONResponse:
    searched_offered_services = service_service.search_offered_service(search_parameters=params)
    return JSONResponse(status_code=status.HTTP_200_OK, content=jsonable_encoder(searched_offered_services))
