from typing import Protocol, List
from .schemas import Location as LocationDTO
from .models import Location


class ExternalLocationService(Protocol):
    def get_filtered_locations(self, *, location_ids: List[int]) -> List[Location]: ...


class InternalLocationService(ExternalLocationService, Protocol):
    """
    Protocol for internal-facing location service.
    """

    def get_locations(self) -> List[LocationDTO]: ...
