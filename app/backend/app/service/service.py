from .repository import ServiceRepository
from uuid import UUID
from .protocols import InternalServiceService
from .schemas import (
    OfferedServiceCreate,
    OfferedService as OfferedServiceDTO,
    Service as ServiceDTO,
    OfferedServiceUpdate,
    OfferedServiceSearch,
)
from .models import OfferedService
from .exceptions import CareTakerOfferedServiceExists, OfferedServiceNotExists
from app.exceptions import InsufficientPermissions
from typing import List
from app.location.protocols import ExternalLocationService as LocationService


class ServiceService(InternalServiceService):
    """
    Concrete implementation of Service-related operations.
    """

    def __init__(self, repo: ServiceRepository, location_service: LocationService):
        """
        Args:
            repo: Repository handling database interactions for services.
        """
        self.repo = repo
        self.location_service = location_service

    def create_offered_service(self, *, profile_id: UUID, offered_service_req: OfferedServiceCreate) -> None:
        """
        Create a new offered service for a caretaker.

        Args:
            profile_id (UUID): Profile ID of the caretaker
            offered_service_req (OfferedServiceCreate): New offered service details

        Raises:
            CareTakerOfferedServiceExists: If the caretaker already has an existing listing for this service
        """
        offered_svc = self.repo.get_offered_service_by_service_caretaker_id(
            service_id=offered_service_req.service_id, caretaker_id=profile_id
        )
        if offered_svc:
            raise CareTakerOfferedServiceExists(
                f"User cannot creare more than one listing for a service. NAME: {offered_svc.service.name}"
            )
        locations = self.location_service.get_filtered_locations(location_ids=offered_service_req.locations)
        new_offered_service = OfferedService(
            caretaker_id=profile_id, locations=locations, **offered_service_req.model_dump(exclude={"locations"})
        )
        self.repo.create_offered_service(offered_service_new=new_offered_service)

    def get_offered_services_by_profile_id(self, *, profile_id: UUID) -> List[OfferedServiceDTO]:
        """
        Retrieve all offered services for a specific caretaker.

        Args:
            profile_id (UUID): Caretaker ID to search for

        Returns:
            List[OfferedServiceDTO]: List of offered services by the caretaker
        """
        all_services = self.repo.get_offered_services_by_profile_id(profile_id=profile_id)
        return [OfferedServiceDTO.model_validate(svc) for svc in all_services]

    def update_offered_service(
        self, *, caretaker_id: UUID, offered_service_id: int, offered_service_update: OfferedServiceUpdate
    ) -> None:
        """
        Updates an offered service owned by the given caretaker.

        Args:
            caretaker_id (UUID): Caretaker profile identifier.
            offered_service_id (int): Offered service identifier.
            offered_service_update (OfferedServiceUpdate): Updated service details.

        Raises:
            OfferedServiceNotExists: If the offered service does not exist.
            InsufficientPermissions: If the caretaker does not own the service.
        """

        offered_svc = self.repo.get_offered_service_by_id(offered_service_id=offered_service_id)
        if not offered_svc:
            raise OfferedServiceNotExists("Offered service ID doesn't exist")
        if offered_svc.caretaker_id != caretaker_id:
            raise InsufficientPermissions("Access not allowed")
        self.repo.update_offered_service(
            offered_service_id=offered_service_id, values=offered_service_update.model_dump()
        )

    def delete_offered_service(self, *, caretaker_id: UUID, offered_service_id: int) -> None:
        """
        Deletes an offered service owned by the given caretaker.

        Args:
            caretaker_id (UUID): Caretaker profile identifier.
            offered_service_id (int): Offered service identifier.

        Raises:
            OfferedServiceNotExists: If the offered service does not exist.
            InsufficientPermissions: If the caretaker does not own the service.
        """
        offered_svc = self.repo.get_offered_service_by_id(offered_service_id=offered_service_id)
        if not offered_svc:
            raise OfferedServiceNotExists("Offered service ID doesn't exist")
        if offered_svc.caretaker_id != caretaker_id:
            raise InsufficientPermissions("Access not allowed")
        self.repo.delete_offered_service(offered_service_id=offered_service_id)

    def get_offered_services(self) -> List[OfferedServiceDTO]:
        """
        Retrieve all offered services by all users

        Returns:
            List[OfferedServiceDTO]: List of offered services by all caretakers
        """
        all_services = self.repo.get_offered_services()
        return [OfferedServiceDTO.model_validate(svc) for svc in all_services]

    def get_services(self) -> List[ServiceDTO]:
        """
        Retrieve all available services
        """
        all_services = self.repo.get_services()
        return [ServiceDTO.model_validate(svc) for svc in all_services]

    def search_offered_service(self, *, search_parameters: OfferedServiceSearch) -> List[OfferedServiceDTO]:
        """
        Retrieves all offered services based on search search parameters

        Args:
            search_parameters (OfferedServiceSearch): DTO containing possible search parameters

        Returns:
            List[OfferedServiceDTO]: List of all offered services by search parameters
        """
        searched_offered_services = self.repo.search_offered_service(
            services=search_parameters.service_id,
            locations=search_parameters.location_id,
            availability=search_parameters.availability,
            max_rate=search_parameters.max_rate,
            limit=search_parameters.limit,
            skip=search_parameters.skip,
        )
        dto_offered_services = [
            OfferedServiceDTO.model_validate(offered_svc) for offered_svc in searched_offered_services
        ]
        return dto_offered_services
