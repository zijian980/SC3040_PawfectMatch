from sqlalchemy.orm import Session
from .models import Payment
from app.util.repository import db_add


class PaymentRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def create_payment(self, *, payment_new: Payment) -> None:
        db_add(self.db_session, payment_new)
