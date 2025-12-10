from fastapi import APIRouter, status, Path
from fastapi.responses import Response, JSONResponse
from fastapi.encoders import jsonable_encoder
from .dependency import InternalReviewSvc as ReviewSvc
from .schemas import ReviewCreate
from app.auth.dependency import CurrentId
from uuid import UUID

review_router = APIRouter()


@review_router.post("")
def submit_review(reviewer_id: CurrentId, review_service: ReviewSvc, review_details: ReviewCreate) -> Response:
    review_service.submit_reivew(reviewer_id=reviewer_id, review_new=review_details)
    return Response(status_code=status.HTTP_201_CREATED)


@review_router.get("/service/{offered_service_id}")
def get_service_reviews(review_service: ReviewSvc, offered_service_id: int = Path(...)) -> JSONResponse:
    reviews = review_service.get_reviews_of_offered_service(offered_service_id=offered_service_id)
    return JSONResponse(status_code=status.HTTP_200_OK, content=jsonable_encoder(reviews))


@review_router.get("/user/{user_id}")
def get_user_reviews(review_service: ReviewSvc, user_id: UUID = Path(...)) -> JSONResponse:
    reviews = review_service.get_reviews_by_caretaker_id(caretaker_id=user_id)
    return JSONResponse(status_code=status.HTTP_200_OK, content=jsonable_encoder(reviews))
