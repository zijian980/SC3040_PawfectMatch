from .repository import PaymentRepository
from .protocols import InternalPaymentService
from .schemas import PaymentCreate
from .models import Payment
from uuid import UUID


class PaymentService(InternalPaymentService):
    def __init__(self, repo: PaymentRepository):
        self.repo = repo

    def create_payment(self, caller_id: UUID, payment_new: PaymentCreate) -> None:
        """
        Creates payment record, indicating payment completion

        Args:
            caller_id (UUID): ID of the user
            payment_new (PaymentCreate): Details for the payment
        """
        new_payment = Payment(**payment_new.model_dump())
        self.repo.create_payment(payment_new=new_payment)
