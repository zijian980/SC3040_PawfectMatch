from unittest.mock import MagicMock
import pytest
from app.pet.service import PetService
from app.pet.schemas import PetCreate
from uuid import uuid4


@pytest.fixture
def mock_repo():
    return MagicMock()


@pytest.fixture
def petowner_service():
    return MagicMock()


@pytest.fixture
def pet_service(mock_repo, petowner_service):
    return PetService(repo=mock_repo, petowner_service=petowner_service)


def test_create_pet(pet_service, mock_repo):
    owner_id = uuid4()
    new_pet = PetCreate(name="Bob", species="Dawg", breed="Woof", age=25)

    pet_service.create_pet(owner_id=owner_id, pet_new=new_pet)

    pet_service.repo.create_pet.assert_called_once()
