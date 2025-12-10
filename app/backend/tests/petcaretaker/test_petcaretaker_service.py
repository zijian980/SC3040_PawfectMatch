from unittest.mock import MagicMock
import pytest
from app.petcaretaker.service import PetCareTakerService
from app.petcaretaker.exceptions import PetCareTakerNotFound
from app.petcaretaker.models import PetCareTaker
from app.petcaretaker.schemas import PetCareTakerCreate, PetCareTakerUpdate
from uuid import uuid4


@pytest.fixture
def mock_repo():
    return MagicMock()


@pytest.fixture
def petcaretaker_service(mock_repo):
    return PetCareTakerService(repo=mock_repo)


def test_get_petcaretaker_not_exists(petcaretaker_service, mock_repo):
    id = uuid4()
    petcaretaker_service.repo.get_petcaretaker_by_id.return_value = None

    with pytest.raises(PetCareTakerNotFound):
        petcaretaker_service.get_petcaretaker(petcaretaker_id=id)

    petcaretaker_service.repo.get_petcaretaker_by_id.assert_called_once_with(petcaretaker_id=id)


def test_get_petcaretaker_success(petcaretaker_service, mock_repo):
    id = uuid4()
    petcaretaker = PetCareTaker(id=id, yoe=5)
    petcaretaker_service.repo.get_petcaretaker_by_id.return_value = petcaretaker

    return_petcaretaker = petcaretaker_service.get_petcaretaker(petcaretaker_id=id)

    assert return_petcaretaker.id == petcaretaker.id
    assert return_petcaretaker.yoe == petcaretaker.yoe
    petcaretaker_service.repo.get_petcaretaker_by_id.assert_called_once_with(petcaretaker_id=id)


def test_create_petcaretaker_success(petcaretaker_service, mock_repo):
    id = uuid4()
    new_petcaretaker = PetCareTakerCreate(id=id, yoe=0)

    petcaretaker_service.create_petcaretaker(petcaretaker_new=new_petcaretaker)

    petcaretaker_service.repo.create_petcaretaker.assert_called_once()


def test_update_petcaretaker_not_exists(petcaretaker_service, mock_repo):
    id = uuid4()
    petcaretaker_update = PetCareTakerUpdate(yoe=10)
    petcaretaker_service.repo.get_petcaretaker_by_id.return_value = None

    with pytest.raises(PetCareTakerNotFound):
        petcaretaker_service.update_petcaretaker(petcaretaker_id=id, petcaretaker_update=petcaretaker_update)

    petcaretaker_service.repo.get_petcaretaker_by_id.assert_called_once_with(petcaretaker_id=id)


def test_update_petcaretaker_success(petcaretaker_service, mock_repo):
    id = uuid4()
    petcaretaker = PetCareTakerUpdate(id=5, yoe=5)
    petcaretaker_update = PetCareTakerUpdate(yoe=10)
    petcaretaker_service.repo.get_petcaretaker_by_id.return_value = petcaretaker

    petcaretaker_service.update_petcaretaker(petcaretaker_id=id, petcaretaker_update=petcaretaker_update)

    petcaretaker_service.repo.get_petcaretaker_by_id.assert_called_once_with(petcaretaker_id=id)
    petcaretaker_service.repo.update_petcaretaker.assert_called_once_with(
        petcaretaker_id=id, petcaretaker_update=petcaretaker_update
    )
