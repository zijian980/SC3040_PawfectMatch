from fastapi import APIRouter, status, Path
from fastapi.responses import JSONResponse, Response
from fastapi.encoders import jsonable_encoder
from app.auth.dependency import CurrentId
from .schemas import BookingCreate
from .dependency import InternalBookingSvc as BookingSvc

booking_router = APIRouter()


@booking_router.get("")
def get_bookings(caller_id: CurrentId, booking_service: BookingSvc) -> JSONResponse:
    all_bookings = booking_service.get_bookings_by_caller_id(caller_id=caller_id)
    return JSONResponse(status_code=status.HTTP_200_OK, content=jsonable_encoder(all_bookings))


@booking_router.post("")
def create_booking(id: CurrentId, booking_service: BookingSvc, booking_details: BookingCreate) -> JSONResponse:
    booking_id = booking_service.create_booking(owner_id=id, booking_create=booking_details)
    return JSONResponse(status_code=status.HTTP_201_CREATED, content={"booking_id": booking_id})


@booking_router.get("/{booking_id}")
def get_booking_details(caller_id: CurrentId, booking_service: BookingSvc, booking_id: int = Path(...)) -> JSONResponse:
    booking = booking_service.get_booking(caller_id=caller_id, booking_id=booking_id)
    return JSONResponse(status_code=status.HTTP_200_OK, content=jsonable_encoder(booking))


@booking_router.post("/{booking_id}/accept")
def accept_booking(caretaker_id: CurrentId, booking_service: BookingSvc, booking_id: int = Path(...)) -> Response:
    booking_service.accept_booking(caretaker_id=caretaker_id, booking_id=booking_id)
    return Response(status_code=status.HTTP_200_OK)


@booking_router.post("/{booking_id}/decline")
def decline_booking(caretaker_id: CurrentId, booking_service: BookingSvc, booking_id: int = Path(...)) -> Response:
    booking_service.decline_booking(caretaker_id=caretaker_id, booking_id=booking_id)
    return Response(status_code=status.HTTP_200_OK)


@booking_router.post("/{booking_id}/cancel")
def cancel_booking(caller_id: CurrentId, booking_service: BookingSvc, booking_id: int = Path(...)) -> Response:
    booking_service.cancel_booking(caller_id=caller_id, booking_id=booking_id)
    return Response(status_code=status.HTTP_200_OK)


@booking_router.post("/{booking_id}/completeservice")
def complete_booking_service(
    caretaker_id: CurrentId, booking_service: BookingSvc, booking_id: int = Path(...)
) -> Response:
    booking_service.pending_payment_booking(caretaker_id=caretaker_id, booking_id=booking_id)
    return Response(status_code=status.HTTP_200_OK)


@booking_router.post("/{booking_id}/pay")
def pay_for_booking(owner_id: CurrentId, booking_service: BookingSvc, booking_id: int = Path(...)) -> Response:
    booking_service.pay_booking_bill(caller_id=owner_id, billing_id=booking_id)
    return Response(status_code=status.HTTP_200_OK)
