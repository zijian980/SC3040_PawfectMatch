from fastapi import Depends
from .repository import ReviewRepository
from .service import ReviewService
from app.database.core import DbSession
from .protocols import InternalReviewService
from app.booking.dependency import ExternalBookingSvc as BookingSvc
from typing import Annotated


async def get_review_repo(db_session: DbSession) -> ReviewRepository:
    return ReviewRepository(db_session=db_session)


async def get_review_service(
    booking_service: BookingSvc, repo: ReviewRepository = Depends(get_review_repo)
) -> ReviewService:
    return ReviewService(repo=repo, booking_service=booking_service)


InternalReviewSvc = Annotated[InternalReviewService, Depends(get_review_service)]
