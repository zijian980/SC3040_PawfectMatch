from typing import Protocol
from .schemas import BillingCreate, Billing as BillingDTO
from uuid import UUID
from typing import List


class ExternalBillingService(Protocol):
    def create_billing(self, *, caller_id: UUID, billing_id: int, billing_new: BillingCreate) -> None: ...
    def get_billing(self, *, caller_id: UUID, billing_id: int) -> BillingDTO: ...
    def update_billing(self, *, caller_id: UUID, billing_id: int) -> None: ...


class InternalBillingService(ExternalBillingService, Protocol):
    def get_all_bills(self, *, caller_id: UUID) -> List[BillingDTO]: ...
