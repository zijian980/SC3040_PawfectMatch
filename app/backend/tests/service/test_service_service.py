import pytest
from uuid import uuid4
from unittest.mock import MagicMock
from app.service.service import ServiceService
from app.service.models import OfferedService, Service
from app.service.schemas import OfferedService as OfferedServiceDTO, OfferedServiceCreate, Service as ServiceDTO
from app.service.enums import Day
from app.location.models import Location
from app.petcaretaker.models import PetCareTaker
from app.profile.models import Profile


@pytest.fixture
def repo_mock():
    return MagicMock()


@pytest.fixture
def location_service():
    return MagicMock()


@pytest.fixture
def service(repo_mock, location_service):
    return ServiceService(repo=repo_mock, location_service=location_service)


def test_create_offered_service(service, repo_mock):
    profile_id = uuid4()
    offered_service_req = OfferedServiceCreate(service_id=1, rate=50, day=[1, 2, 3], locations=[1, 2])
    service.repo.get_offered_service_by_service_caretaker_id.return_value = None
    service.location_service.get_filtered_locations.return_value = [
        Location(id=1, name="Test"),
        Location(id=2, name="Test"),
    ]

    service.create_offered_service(profile_id=profile_id, offered_service_req=offered_service_req)

    created_obj = repo_mock.create_offered_service.call_args[1]["offered_service_new"]

    service.repo.create_offered_service.assert_called_once()
    assert created_obj.service_id == 1
    assert created_obj.rate == 50
    assert created_obj.day == [Day.Monday, Day.Tuesday, Day.Wednesday]


def test_get_offered_services_by_profile_id(service, repo_mock):
    profile_id = uuid4()
    fake_services = [
        OfferedService(
            id=1,
            caretaker_id=profile_id,
            service_id=1,
            rate=5,
            day=[1, 2],
            service=Service(id=1, name="Walking"),
            locations=[Location(id=1, name="testLocation")],
            petcaretaker=PetCareTaker(id=profile_id, yoe=5, profile=Profile(first_name="Test", last_name="Test")),
        ),
        OfferedService(
            id=2,
            caretaker_id=profile_id,
            service_id=2,
            rate=10,
            day=[1, 2],
            service=Service(id=2, name="Grooming"),
            locations=[Location(id=1, name="testLocation")],
            petcaretaker=PetCareTaker(id=profile_id, yoe=5, profile=Profile(first_name="Test", last_name="Test")),
        ),
    ]
    repo_mock.get_offered_services_by_profile_id.return_value = fake_services

    result = service.get_offered_services_by_profile_id(profile_id=profile_id)

    service.repo.get_offered_services_by_profile_id.assert_called_once_with(profile_id=profile_id)
    assert len(result) == 2
    assert all(isinstance(svc, OfferedServiceDTO) for svc in result)
    assert result[0].id == 1
    assert result[1].id == 2


def test_get_services(service, repo_mock):
    fake_services = [Service(id=1, name="Grooming"), Service(id=2, name="Walking")]
    repo_mock.get_services.return_value = fake_services

    result = service.get_services()

    service.repo.get_services.assert_called_once()
    assert len(result) == 2
    assert all(isinstance(svc, ServiceDTO) for svc in result)
    assert result[0].name == "Grooming"
    assert result[1].name == "Walking"
