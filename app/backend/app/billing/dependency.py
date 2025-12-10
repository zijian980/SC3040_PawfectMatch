from fastapi import Depends
from .repository import BillingRepository
from .service import BillingService
from app.database.core import DbSession
from typing import Annotated
from .protocols import InternalBillingService, ExternalBillingService


async def get_billing_repo(db_session: DbSession) -> BillingRepository:
    return BillingRepository(db_session=db_session)


async def get_billing_service(repo: BillingRepository = Depends(get_billing_repo)) -> BillingService:
    return BillingService(repo=repo)


ExternalBillingSvc = Annotated[ExternalBillingService, Depends(get_billing_service)]
InternalBillingSvc = Annotated[InternalBillingService, Depends(get_billing_service)]
