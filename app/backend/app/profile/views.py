from fastapi import APIRouter, status, File, UploadFile
from fastapi.encoders import jsonable_encoder
from .enums import Role
from .dependency import InternalProfileSvc as ProfileSvc
from app.auth.dependency import CurrentId
from fastapi.responses import JSONResponse, Response
from fastapi.exceptions import HTTPException
from .schemas import ProfileUpdate, ProfileUpdateRequest, ProfileGetResponse
from app.petcaretaker.dependency import ExternalPetCareTakerSvc as PetCareTakerSvc
from app.petcaretaker.schemas import PetCareTakerUpdate
from uuid import UUID

profile_router = APIRouter()


@profile_router.get("")
def get_profile(id: CurrentId, profile_service: ProfileSvc) -> JSONResponse:
    profile = profile_service.get_profile(profile_id=id)
    content = jsonable_encoder(profile.model_dump(exclude_none=True))
    return JSONResponse(status_code=status.HTTP_200_OK, content=content)


@profile_router.get("/{profile_id}")
def get_profile_by_id(profile_id: UUID, profile_service: ProfileSvc) -> JSONResponse:
    profile = profile_service.get_profile(profile_id=profile_id)
    profile_content = ProfileGetResponse(**profile.model_dump())
    return JSONResponse(status_code=status.HTTP_200_OK, content=jsonable_encoder(profile_content))


@profile_router.put("/update")
def update_profile(
    id: CurrentId,
    profile_update: ProfileUpdateRequest,
    profile_service: ProfileSvc,
    petcaretaker_service: PetCareTakerSvc,
) -> Response:
    profile = profile_service.get_profile(profile_id=id)
    update = ProfileUpdate(**profile_update.model_dump(exclude={"yoe"}, exclude_unset=True, exclude_none=True))
    profile_service.update_profile(profile_id=id, profile_update=update)
    if profile.type == Role.PetCareTaker.value:
        if profile_update.yoe is not None:
            petcaretaker_update = PetCareTakerUpdate(yoe=profile_update.yoe)
            petcaretaker_service.update_petcaretaker(petcaretaker_id=id, petcaretaker_update=petcaretaker_update)
    return Response(status_code=status.HTTP_200_OK)


@profile_router.patch("/picture")
def change_profile_picture(id: CurrentId, profile_service: ProfileSvc, image: UploadFile = File(...)) -> JSONResponse:
    if image.content_type is None or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Only images are allowed")
    path = profile_service.change_profile_picture(profile_id=id, file=image)
    return JSONResponse(status_code=status.HTTP_200_OK, content={"image_path": path})
