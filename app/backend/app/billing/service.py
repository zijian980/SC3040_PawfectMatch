from .protocols import InternalBillingService
from .repository import BillingRepository
from .models import Billing
from .schemas import BillingCreate, Billing as BillingDTO
from .exceptions import BillingAlreadyExists, BillingNotExists, BillingPermissionDenied
from uuid import UUID
from typing import List
from datetime import datetime
from .enums import PayStatus


class BillingService(InternalBillingService):
    def __init__(self, repo: BillingRepository):
        self.repo = repo

    def create_billing(self, *, caller_id: UUID, billing_id: int, billing_new: BillingCreate) -> None:
        """
        Creates a new billing record

        Args:
            caller_id (UUID): ID of account calling this function
            billing_id (int): ID of billing record (same as booking ID)
            billing_new (BillingCreate): Additional info for billing record
        """
        billing = self.repo.get_billing(caller_id=caller_id, billing_id=billing_id)
        if billing:
            raise BillingAlreadyExists(f"Billing for ID {billing_id} already exists")
        new_bill = Billing(id=billing_id, **billing_new.model_dump())
        self.repo.create_billing(billing_new=new_bill)

    def get_billing(self, *, caller_id: UUID, billing_id: int) -> BillingDTO:
        """
        Retrieve a specific billing record for the given caller.

        Args:
            caller_id (UUID): The unique identifier of the caller requesting the billing.
            billing_id (int): The ID of the billing record to retrieve.

        Returns:
            BillingDTO: The billing record corresponding to the given billing ID.

        Raises:
            BillingNotExists: If no billing record exists for the provided billing ID.
            BillingPermissionDenied: If the caller is not authorized to access this billing.
        """
        bill = self.repo.get_billing(caller_id=caller_id, billing_id=billing_id)
        if not bill:
            raise BillingNotExists(f"Billing for ID {billing_id} doesn't exist")
        elif bill.service_booking.pet.owner_id != caller_id:
            raise BillingPermissionDenied("Unauthorized to perform this action")
        return BillingDTO.model_validate(bill)

    def get_all_bills(self, *, caller_id: UUID) -> List[BillingDTO]:
        """
        Retrieve all billing records belonging to the caller.

        Args:
            caller_id (UUID): The unique identifier of the caller requesting their billing records.

        Returns:
            List[BillingDTO]: A list of all billing records associated with the caller.
        """
        all_bills = self.repo.get_all_bills(caller_id=caller_id)
        all_billsDTO = [BillingDTO.model_validate(bill) for bill in all_bills]
        return all_billsDTO

    def update_billing(self, *, caller_id: UUID, billing_id: int) -> None:
        """
        Mark a billing record as paid if the caller is authorized.

        Args:
            caller_id (UUID): The unique identifier of the caller attempting to update the billing.
            billing_id (int): The ID of the billing record to update.

        Raises:
            BillingNotExists: If no billing record exists for the provided billing ID.
            BillingPermissionDenied: If the caller is not authorized to update this billing.
        """
        bill = self.repo.get_billing(caller_id=caller_id, billing_id=billing_id)
        if not bill:
            raise BillingNotExists(f"Billing for ID {billing_id} doesn't exist")
        elif bill.service_booking.pet.owner_id != caller_id:
            raise BillingPermissionDenied("Unauthorized to perform this action")
        self.repo.update_bill(billing_id=billing_id, paid_at=datetime.now(), status=PayStatus.Paid)
