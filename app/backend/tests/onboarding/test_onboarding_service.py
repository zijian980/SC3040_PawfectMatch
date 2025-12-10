from app.profile.protocols import ExternalProfileService as ProfileService
from app.petowner.protocols import ExternalPetOwnerService as PetOwnerService
from app.petcaretaker.protocols import ExternalPetCareTakerService as PetCareTakerService
from app.pet.protocols import ExternalPetService as PetService
from app.service.protocols import ExternalServiceService as ServiceService
from app.onboarding.service import OnboardingService
from unittest.mock import MagicMock
import pytest
from uuid import uuid4
from app.profile.schemas import ProfileOnboardRequest
from app.profile.exceptions import ProfileAlreadyOnboarded
from app.pet.schemas import PetCreate
from app.service.schemas import OfferedServiceCreate


@pytest.fixture
def profile_svc() -> ProfileService:
    return MagicMock()


@pytest.fixture
def owner_svc() -> PetOwnerService:
    return MagicMock()


@pytest.fixture
def caretaker_svc() -> PetCareTakerService:
    return MagicMock()


@pytest.fixture
def pet_svc() -> PetService:
    return MagicMock()


@pytest.fixture
def service_svc() -> ServiceService:
    return MagicMock()


@pytest.fixture
def onboard_svc(profile_svc, owner_svc, caretaker_svc, pet_svc, service_svc) -> OnboardingService:
    return OnboardingService(profile_svc, owner_svc, caretaker_svc, pet_svc, service_svc)


def test_onboard_owner(onboard_svc):
    id = uuid4()
    req = ProfileOnboardRequest(
        first_name="Test",
        last_name="Tester",
        dob="2000-01-01",
        gender="male",
        contact_num="+6591234567",
        address="123 Street",
        type="owner",
    )
    onboard_svc.profile_service.check_onboarding_status.return_value = False

    onboard_svc.onboard_profile(profile_id=id, onboard_req=req)

    onboard_svc.profile_service.check_onboarding_status.assert_called_once_with(profile_id=id)
    onboard_svc.profile_service.onboard_profile.assert_called_once()
    onboard_svc.petowner_service.delete_pet_owner.assert_called_once_with(petowner_id=id)
    onboard_svc.petcaretaker_service.delete_petcaretaker.assert_called_once_with(petcaretaker_id=id)
    onboard_svc.petowner_service.create_pet_owner.assert_called_once()


def test_onboard_caretaker(onboard_svc):
    id = uuid4()
    req = ProfileOnboardRequest(
        first_name="Test",
        last_name="Tester",
        dob="2000-01-01",
        gender="male",
        contact_num="+6591234567",
        address="123 Street",
        type="caretaker",
        yoe=5,
    )
    onboard_svc.profile_service.check_onboarding_status.return_value = False

    onboard_svc.onboard_profile(profile_id=id, onboard_req=req)

    onboard_svc.profile_service.check_onboarding_status.assert_called_once_with(profile_id=id)
    onboard_svc.profile_service.onboard_profile.assert_called_once()
    onboard_svc.petowner_service.delete_pet_owner.assert_called_once_with(petowner_id=id)
    onboard_svc.petcaretaker_service.delete_petcaretaker.assert_called_once_with(petcaretaker_id=id)
    onboard_svc.petcaretaker_service.create_petcaretaker.assert_called_once()


def test_onboard_already_onboarded(onboard_svc):
    id = uuid4()
    req = ProfileOnboardRequest(
        first_name="Test",
        last_name="Tester",
        dob="2000-01-01",
        gender="male",
        contact_num="+6591234567",
        address="123 Street",
        type="owner",
    )
    onboard_svc.profile_service.check_onboarding_status.return_value = True
    onboard_svc.petowner_service.delete_pet_owner.assert_not_called()
    onboard_svc.petcaretaker_service.delete_petcaretaker.assert_not_called()
    onboard_svc.petcaretaker_service.create_petcaretaker.assert_not_called()

    with pytest.raises(ProfileAlreadyOnboarded):
        onboard_svc.onboard_profile(profile_id=id, onboard_req=req)

    onboard_svc.profile_service.check_onboarding_status.assert_called_once_with(profile_id=id)
    onboard_svc.profile_service.onboard_profile.assert_not_called()


def test_onboard_pet_success(onboard_svc):
    id = uuid4()
    req = PetCreate(name="Bob", species="Dawg", breed="DawgBreed", age=5)
    onboard_svc.profile_service.check_onboarding_status.return_value = False

    onboard_svc.onboard_pet(profile_id=id, new_pet_req=req)

    onboard_svc.profile_service.check_onboarding_status.assert_called_once_with(profile_id=id)
    onboard_svc.pet_service.create_pet(owner_id=id, pet_new=req)


def test_onboard_already_boarded(onboard_svc):
    id = uuid4()
    req = PetCreate(name="Bob", species="Dawg", breed="DawgBreed", age=5)
    onboard_svc.profile_service.check_onboarding_status.return_value = True

    with pytest.raises(ProfileAlreadyOnboarded):
        onboard_svc.onboard_pet(profile_id=id, new_pet_req=req)

    onboard_svc.profile_service.check_onboarding_status.assert_called_once_with(profile_id=id)
    onboard_svc.pet_service.create_pet.assert_not_called()


def test_onboard_offered_services_success(onboard_svc):
    id = uuid4()
    offered_svcs = [
        OfferedServiceCreate(service_id=1, rate=50, day=[1, 2], locations=[1, 2]),
        OfferedServiceCreate(service_id=2, rate=50, day=[1, 2], locations=[1, 2]),
    ]
    onboard_svc.profile_service.check_onboarding_status.return_value = False

    onboard_svc.onboard_offered_services(profile_id=id, offered_services=offered_svcs)

    onboard_svc.profile_service.check_onboarding_status.assert_called_once_with(profile_id=id)
    assert onboard_svc.service_service.create_offered_service.call_count == len(offered_svcs)
    for offered_svc in offered_svcs:
        onboard_svc.service_service.create_offered_service.assert_any_call(
            profile_id=id, offered_service_req=offered_svc
        )


def test_onboard_offered_services_already_onboarded(onboard_svc):
    id = uuid4()
    offered_svcs = [
        OfferedServiceCreate(service_id=1, rate=50, day=[1, 2], locations=[1, 2]),
        OfferedServiceCreate(service_id=2, rate=50, day=[1, 2], locations=[1, 2]),
    ]
    onboard_svc.profile_service.check_onboarding_status.return_value = True

    with pytest.raises(ProfileAlreadyOnboarded):
        onboard_svc.onboard_offered_services(profile_id=id, offered_services=offered_svcs)

    onboard_svc.profile_service.check_onboarding_status.assert_called_once_with(profile_id=id)
    onboard_svc.service_service.create_offered_service.assert_not_called()


def test_complete_onboard(onboard_svc):
    id = uuid4()
    onboard_svc.profile_service.check_onboarding_status.return_value = False

    onboard_svc.complete_onboard(profile_id=id)

    onboard_svc.profile_service.check_onboarding_status.assert_called_once_with(profile_id=id)
    onboard_svc.profile_service.complete_onboard.assert_called_once_with(profile_id=id)


def test_onboard_completed_already_onboarded(onboard_svc):
    id = uuid4()
    onboard_svc.profile_service.check_onboarding_status.return_value = True

    with pytest.raises(ProfileAlreadyOnboarded):
        onboard_svc.complete_onboard(profile_id=id)

    onboard_svc.profile_service.check_onboarding_status.assert_called_once_with(profile_id=id)
    onboard_svc.profile_service.complete_onboard.assert_not_called()
