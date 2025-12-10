from fastapi import APIRouter, Path, status
from fastapi.responses import JSONResponse, Response
from fastapi.encoders import jsonable_encoder
from app.auth.dependency import CurrentId
from app.petowner.dependency import ExternalPetOwnerSvc as PetOwnerSvc
from .dependency import InternalPetSvc as PetSvc
from .schemas import PetCreate

pet_router = APIRouter()


@pet_router.get("/{pet_id}")
def get_pet(id: CurrentId, pet_service: PetSvc, petowner_service: PetOwnerSvc, pet_id: int = Path(...)) -> JSONResponse:
    pet = pet_service.get_pet(owner_id=id, pet_id=pet_id)
    return JSONResponse(status_code=status.HTTP_200_OK, content=jsonable_encoder(pet))


@pet_router.get("")
def get_pets_by_owner_id(id: CurrentId, pet_service: PetSvc) -> JSONResponse:
    pets = pet_service.get_pets_by_owner_id(owner_id=id)
    return JSONResponse(status_code=status.HTTP_200_OK, content=jsonable_encoder(pets))


@pet_router.post("")
def create_pet(id: CurrentId, pet_service: PetSvc, petowner_service: PetOwnerSvc, pet_new: PetCreate) -> Response:
    pet_service.create_pet(owner_id=id, pet_new=pet_new)
    return Response(status_code=status.HTTP_201_CREATED)


@pet_router.delete("/{pet_id}")
def delete_pet(id: CurrentId, pet_service: PetSvc, petowner_service: PetOwnerSvc, pet_id: int = Path(...)) -> Response:
    pet_service.delete_pet(owner_id=id, pet_id=pet_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
