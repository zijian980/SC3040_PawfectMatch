from fastapi import APIRouter, status
from fastapi.responses import JSONResponse, Response
from .dependency import InternalOnboardingSvc as OnboardingSvc
from app.auth.dependency import CurrentId
from app.profile.dependency import ExternalProfileSvc as ProfileSvc
from app.profile.schemas import ProfileOnboardRequest
from app.service.schemas import OfferedServiceCreate
from app.pet.schemas import PetCreate
from typing import List

onboarding_router = APIRouter()


@onboarding_router.get("/status")
def get_onboarding_status(id: CurrentId, profile_service: ProfileSvc) -> JSONResponse:
    isOnboarded = profile_service.check_onboarding_status(profile_id=id)
    return JSONResponse(status_code=status.HTTP_200_OK, content={"onboarded": isOnboarded})


@onboarding_router.post("/profile")
def onboard_profile(id: CurrentId, onboard_details: ProfileOnboardRequest, onboard_service: OnboardingSvc) -> Response:
    onboard_service.onboard_profile(profile_id=id, onboard_req=onboard_details)
    return Response(status_code=status.HTTP_200_OK)


@onboarding_router.post("/pet")
def onboard_pet(id: CurrentId, new_pet: PetCreate, onboard_service: OnboardingSvc) -> Response:
    onboard_service.onboard_pet(profile_id=id, new_pet_req=new_pet)
    return Response(status_code=status.HTTP_201_CREATED)


@onboarding_router.post("/service")
def onboard_offered_service(
    id: CurrentId, offered_services: List[OfferedServiceCreate], onboard_service: OnboardingSvc
) -> Response:
    onboard_service.onboard_offered_services(profile_id=id, offered_services=offered_services)
    return Response(status_code=status.HTTP_201_CREATED)


@onboarding_router.post("/complete")
def complete_onboarding(id: CurrentId, onboard_service: OnboardingSvc) -> Response:
    onboard_service.complete_onboard(profile_id=id)
    return Response(status_code=status.HTTP_200_OK)
