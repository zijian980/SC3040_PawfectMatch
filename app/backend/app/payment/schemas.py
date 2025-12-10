from pydantic import BaseModel


class PaymentCreate(BaseModel):
    billing_id: int
    amount_paid: float
