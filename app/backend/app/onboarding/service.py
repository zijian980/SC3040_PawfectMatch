from .protocols import InternalOnboardingService
from app.profile.protocols import ExternalProfileService as ProfileService
from app.profile.schemas import ProfileOnboardRequest, ProfileOnboard
from app.profile.enums import Role
from app.profile.exceptions import ProfileAlreadyOnboarded
from app.petowner.protocols import ExternalPetOwnerService as PetOwnerService
from app.petowner.schemas import PetOwnerCreate
from app.petcaretaker.protocols import ExternalPetCareTakerService as PetCareTakerService
from app.petcaretaker.schemas import PetCareTakerCreate
from app.pet.protocols import ExternalPetService as PetService
from app.pet.schemas import PetCreate
from app.service.protocols import ExternalServiceService as ServiceService
from app.service.schemas import OfferedServiceCreate
from uuid import UUID
from typing import List


class OnboardingService(InternalOnboardingService):
    def __init__(
        self,
        profile_service: ProfileService,
        petowner_service: PetOwnerService,
        petcaretaker_service: PetCareTakerService,
        pet_service: PetService,
        service_service: ServiceService,
    ):
        self.profile_service = profile_service
        self.petowner_service = petowner_service
        self.petcaretaker_service = petcaretaker_service
        self.pet_service = pet_service
        self.service_service = service_service

    def onboard_profile(self, *, profile_id: UUID, onboard_req: ProfileOnboardRequest) -> None:
        """
        Onboards a profile by setting its role and initializing related entities.

        Args:
            profile_id (UUID): Profile identifier.
            onboard_req (ProfileOnboardRequest): Onboarding details.

        Raises:
            ProfileAlreadyOnboarded: If the profile has already onboarded.
            ValueError: If caretaker role is selected but `yoe` is missing.
        """
        if self.profile_service.check_onboarding_status(profile_id=profile_id):
            raise ProfileAlreadyOnboarded("Profile has completed onboarding")
        profile_onboard = ProfileOnboard(**onboard_req.model_dump(exclude={"yoe"}))
        self.profile_service.onboard_profile(profile_id=profile_id, profile_update=profile_onboard)

        self.petowner_service.delete_pet_owner(petowner_id=profile_id)
        self.petcaretaker_service.delete_petcaretaker(petcaretaker_id=profile_id)
        if profile_onboard.type == Role.PetOwner.value:
            new_petowner = PetOwnerCreate(id=profile_id)
            self.petowner_service.create_pet_owner(petowner_new=new_petowner)
        elif profile_onboard.type == Role.PetCareTaker.value:
            if not onboard_req.yoe:
                raise ValueError("Missing yoe")
            new_petcaretaker = PetCareTakerCreate(id=profile_id, yoe=onboard_req.yoe)
            self.petcaretaker_service.create_petcaretaker(petcaretaker_new=new_petcaretaker)

    def onboard_pet(self, *, profile_id: UUID, new_pet_req: PetCreate) -> None:
        """
        Adds a pet for the profile during onboarding.

        Args:
            profile_id (UUID): Profile identifier.
            new_pet_req (PetCreate): New pet details.

        Raises:
            ProfileAlreadyOnboarded: If the profile has already onboarded.
        """
        if self.profile_service.check_onboarding_status(profile_id=profile_id):
            raise ProfileAlreadyOnboarded("Profile has completed onboarding")
        self.pet_service.create_pet(owner_id=profile_id, pet_new=new_pet_req)

    def onboard_offered_services(self, *, profile_id: UUID, offered_services: List[OfferedServiceCreate]) -> None:
        """
        Sets offered services for a caretaker during onboarding.

        Args:
            profile_id (UUID): Profile identifier.
            offered_services (List[OfferedServiceCreate]): List of offered services.

        Raises:
            ProfileAlreadyOnboarded: If the profile has already onboarded.
        """
        if self.profile_service.check_onboarding_status(profile_id=profile_id):
            raise ProfileAlreadyOnboarded("Profile has completed onboarding")
        current_services = self.service_service.get_offered_services_by_profile_id(profile_id=profile_id)
        for current_service in current_services:
            self.service_service.delete_offered_service(caretaker_id=profile_id, offered_service_id=current_service.id)
        for offered_service in offered_services:
            self.service_service.create_offered_service(profile_id=profile_id, offered_service_req=offered_service)

    def complete_onboard(self, *, profile_id: UUID) -> None:
        """
        Marks the profile's onboarding as complete.

        Args:
            profile_id (UUID): Profile identifier.

        Raises:
            ProfileAlreadyOnboarded: If the profile has already onboarded.
        """
        if self.profile_service.check_onboarding_status(profile_id=profile_id):
            raise ProfileAlreadyOnboarded("Profile has completed onboarding")
        self.profile_service.complete_onboard(profile_id=profile_id)
