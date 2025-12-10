from fastapi import Depends
from .repository import PaymentRepository
from .service import PaymentService
from .protocols import ExternalPaymentService
from app.database.core import DbSession
from typing import Annotated


async def get_payment_repo(db_session: DbSession) -> PaymentRepository:
    return PaymentRepository(db_session=db_session)


async def get_payment_service(repo: PaymentRepository = Depends(get_payment_repo)) -> PaymentService:
    return PaymentService(repo=repo)


ExternalPaymentSvc = Annotated[ExternalPaymentService, Depends(get_payment_service)]
