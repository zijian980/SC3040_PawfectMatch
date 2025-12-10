from app.profile.service import ProfileService
from app.profile.models import Profile
from app.profile.schemas import ProfileAuthRegister, ProfileOAuthRegister, ProfileOnboard, ProfileUpdate
from app.profile.exceptions import ProfileAlreadyExists, ProfileNotExists, ProfileAlreadyOnboarded
from unittest.mock import MagicMock
import pytest
from uuid import uuid4


@pytest.fixture
def mock_repo():
    return MagicMock()


@pytest.fixture
def auth_service(mock_repo):
    return ProfileService(repo=mock_repo)


def test_register_profile_exists(auth_service, mock_repo):
    profile_id = uuid4()
    profile_register = ProfileAuthRegister(first_name="Test")
    profile = Profile(id=profile_id, first_name="Test")
    auth_service.repo.get_by_id.return_value = profile

    with pytest.raises(ProfileAlreadyExists):
        auth_service.register_profile(profile_id=profile_id, profile_new=profile_register)
    auth_service.repo.get_by_id.assert_called_once_with(profile_id)
    auth_service.repo.create_profile.assert_not_called()


def test_register_profile_success(auth_service, mock_repo):
    profile_id = uuid4()
    profile_register = ProfileAuthRegister(first_name="Test")
    auth_service.repo.get_by_id.return_value = None

    auth_service.register_profile(profile_id=profile_id, profile_new=profile_register)

    auth_service.repo.get_by_id.assert_called_once_with(profile_id)
    auth_service.repo.create_profile.assert_called_once()
    created_profile = auth_service.repo.create_profile.call_args.kwargs["profile_new"]
    assert created_profile.first_name == "Test"
    assert created_profile.id == profile_id


def test_oauth_process_profile_exists(auth_service, mock_repo):
    profile_id = uuid4()
    profile_register = ProfileOAuthRegister(first_name="Test")
    profile = Profile(id=profile_id, first_name="Test")
    auth_service.repo.get_by_id.return_value = profile
    auth_service._oauth_register_profile = MagicMock()

    auth_service.oauth_process_profile(profile_id=profile_id, profile_new=profile_register)

    auth_service.repo.get_by_id.assert_called_once_with(profile_id=profile_id)
    auth_service._oauth_register_profile.assert_not_called()


def test_oauth_process_success(auth_service, mock_repo):
    profile_id = uuid4()
    profile_register = ProfileOAuthRegister(first_name="Test")
    auth_service.repo.get_by_id.return_value = None
    auth_service._oauth_register_profile = MagicMock()

    auth_service.oauth_process_profile(profile_id=profile_id, profile_new=profile_register)

    auth_service.repo.get_by_id.assert_called_once_with(profile_id=profile_id)
    auth_service._oauth_register_profile.assert_called_once_with(profile_id=profile_id, profile_new=profile_register)


def test_onboard_profile_exists(auth_service, mock_repo):
    profile_id = uuid4()
    profile_update = ProfileOnboard(
        first_name="Test",
        last_name="Tester",
        dob="2000-01-01",
        gender="male",
        contact_num="+6591234567",
        address="123 Test Street",
        type="owner",
    )
    auth_service.repo.get_by_id.return_value = None

    with pytest.raises(ProfileNotExists):
        auth_service.onboard_profile(profile_id=profile_id, profile_update=profile_update)

    auth_service.repo.get_by_id.assert_called_once_with(profile_id=profile_id)
    auth_service.repo.onboard_profile.assert_not_called()


def test_onboard_profile_success(auth_service, mock_repo):
    profile_id = uuid4()
    profile = Profile(id=profile_id, first_name="Test", onboarded=False)
    profile_update = ProfileOnboard(
        first_name="Test",
        last_name="Tester",
        dob="2000-01-01",
        gender="male",
        contact_num="+6591234567",
        address="123 Test Street",
        type="owner",
    )
    auth_service.repo.get_by_id.return_value = profile

    auth_service.onboard_profile(profile_id=profile_id, profile_update=profile_update)

    auth_service.repo.get_by_id.assert_called_once_with(profile_id=profile_id)
    auth_service.repo.onboard_profile.assert_called_once_with(profile_id=profile_id, profile_update=profile_update)


def test_onboard_profile_completed_onboarding(auth_service, mock_repo):
    profile_id = uuid4()
    profile = Profile(id=profile_id, first_name="Test", onboarded=True)
    profile_update = ProfileOnboard(
        first_name="Test",
        last_name="Tester",
        dob="2000-01-01",
        gender="male",
        contact_num="+6591234567",
        address="123 Test Street",
        type="owner",
    )
    auth_service.repo.get_by_id.return_value = profile

    with pytest.raises(ProfileAlreadyOnboarded):
        auth_service.onboard_profile(profile_id=profile_id, profile_update=profile_update)

    auth_service.repo.get_by_id.assert_called_once_with(profile_id=profile_id)
    auth_service.repo.onboard_profile.assert_not_called()


def test_update_profile_success(auth_service, mock_repo):
    profile_id = uuid4()
    profile = Profile(id=profile_id, first_name="Test")
    profile_update = ProfileUpdate(
        first_name="Test", last_name="Tester", contact_num="+6591234567", address="123 Test Street"
    )
    auth_service.repo.get_by_id.return_value = profile

    auth_service.update_profile(profile_id=profile_id, profile_update=profile_update)

    auth_service.repo.update_profile.assert_called_once_with(profile_id=profile_id, profile_update=profile_update)
