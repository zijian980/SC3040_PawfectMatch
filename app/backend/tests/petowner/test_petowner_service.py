from unittest.mock import MagicMock
import pytest
from app.petowner.service import PetOwnerService
from app.petowner.schemas import PetOwnerCreate
from uuid import uuid4


@pytest.fixture
def mock_repo():
    return MagicMock()


@pytest.fixture
def petowner_service(mock_repo):
    return PetOwnerService(repo=mock_repo)


def test_create_petowner(petowner_service, mock_repo):
    id = uuid4()
    petowner_new = PetOwnerCreate(id=id)
    petowner_service.repo.get_petowner_by_id.return_value = None

    petowner_service.create_pet_owner(petowner_new=petowner_new)

    petowner_service.repo.create_petowner.assert_called_once()
