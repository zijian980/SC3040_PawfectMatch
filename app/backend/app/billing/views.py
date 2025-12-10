from fastapi import APIRouter, Path, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from app.auth.dependency import CurrentId
from .dependency import InternalBillingSvc as BillingSvc

billing_router = APIRouter()


@billing_router.get("")
def get_all_bills(id: CurrentId, billing_service: BillingSvc) -> JSONResponse:
    all_bills = billing_service.get_all_bills(caller_id=id)
    return JSONResponse(status_code=status.HTTP_200_OK, content=jsonable_encoder(all_bills))


@billing_router.get("/{billing_id}")
def get_bill(id: CurrentId, billing_service: BillingSvc, billing_id: int = Path(...)) -> JSONResponse:
    bill = billing_service.get_billing(caller_id=id, billing_id=billing_id)
    return JSONResponse(status_code=status.HTTP_200_OK, content=jsonable_encoder(bill))
