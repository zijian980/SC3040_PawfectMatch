from typing import Protocol, List
from uuid import UUID
from .schemas import (
    OfferedServiceCreate,
    OfferedService as OfferedServiceDTO,
    Service as ServiceDTO,
    OfferedServiceUpdate,
    OfferedServiceSearch,
)


class ExternalServiceService(Protocol):
    """
    External-facing service interface for managing offered services.
    """

    def create_offered_service(self, *, profile_id: UUID, offered_service_req: OfferedServiceCreate) -> None: ...
    def get_offered_services_by_profile_id(self, *, profile_id: UUID) -> List[OfferedServiceDTO]: ...
    def delete_offered_service(self, *, caretaker_id: UUID, offered_service_id: int) -> None: ...


class InternalServiceService(ExternalServiceService, Protocol):
    """
    Internal-facing service interface with extended operations.
    """

    def get_offered_services(self) -> List[OfferedServiceDTO]: ...
    def update_offered_service(
        self, *, caretaker_id: UUID, offered_service_id: int, offered_service_update: OfferedServiceUpdate
    ) -> None: ...
    def search_offered_service(self, *, search_parameters: OfferedServiceSearch) -> List[OfferedServiceDTO]: ...
    def get_services(self) -> List[ServiceDTO]: ...
