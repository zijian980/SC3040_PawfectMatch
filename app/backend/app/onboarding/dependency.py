from fastapi import Depends
from .service import OnboardingService
from typing import Annotated
from .protocols import InternalOnboardingService
from app.profile.dependency import ExternalProfileSvc as ProfileSvc
from app.petowner.dependency import ExternalPetOwnerSvc as PetOwnerSvc
from app.petcaretaker.dependency import ExternalPetCareTakerSvc as PetCareTakerSvc
from app.pet.dependency import ExternalPetSvc as PetSvc
from app.service.dependency import ExternalServiceSvc as ServiceSvc


async def get_onboarding_service(
    profile_service: ProfileSvc,
    petowner_service: PetOwnerSvc,
    petcaretaker_service: PetCareTakerSvc,
    pet_service: PetSvc,
    service_service: ServiceSvc,
) -> OnboardingService:
    return OnboardingService(profile_service, petowner_service, petcaretaker_service, pet_service, service_service)


InternalOnboardingSvc = Annotated[InternalOnboardingService, Depends(get_onboarding_service)]
