import pytest
from unittest.mock import MagicMock
from app.location.service import LocationService
from app.location.models import Location
from app.location.schemas import Location as LocationDTO


@pytest.fixture
def mock_repo():
    return MagicMock()


@pytest.fixture
def location_service(mock_repo):
    return LocationService(repo=mock_repo)


def test_get_locations(location_service):
    locations = [Location(id=1, name="Loc1"), Location(id=2, name="Loc2")]
    location_service.repo.get_all_locations.return_value = locations

    result = location_service.get_locations()

    assert len(result) == 2
    assert all(isinstance(loc, LocationDTO) for loc in result)
    assert result[0].name == "Loc1"
    assert result[1].name == "Loc2"
