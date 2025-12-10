from typing import Protocol
from uuid import UUID
from .schemas import PaymentCreate


class ExternalPaymentService(Protocol):
    def create_payment(self, *, caller_id: UUID, payment_new: PaymentCreate) -> None: ...


class InternalPaymentService(ExternalPaymentService, Protocol):
    pass
