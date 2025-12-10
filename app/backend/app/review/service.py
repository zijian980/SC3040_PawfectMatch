from .protocols import InternalReviewService
from .repository import ReviewRepository
from uuid import UUID
from .models import Review
from .schemas import ReviewCreate, Review as ReviewDTO
from typing import List
from app.booking.protocols import ExternalBookingService as BookingSvc


class ReviewService(InternalReviewService):
    def __init__(self, repo: ReviewRepository, booking_service: BookingSvc):
        self.repo = repo
        self.booking_service = booking_service

    def submit_reivew(self, *, reviewer_id: UUID, review_new: ReviewCreate) -> None:
        # Check existence and ownership
        self.booking_service.get_booking(caller_id=reviewer_id, booking_id=review_new.service_booking_id)
        new_review = Review(**review_new.model_dump())
        self.repo.create_review(review_new=new_review)

    def get_reviews_of_offered_service(self, *, offered_service_id: int) -> List[ReviewDTO]:
        all_reviews = self.repo.get_reviews_by_offered_service_id(offered_service_id=offered_service_id)
        all_reviewsDTO = [ReviewDTO.model_validate(review) for review in all_reviews]
        return all_reviewsDTO

    def get_reviews_by_caretaker_id(self, *, caretaker_id: UUID) -> List[ReviewDTO]:
        all_reviews = self.repo.get_reviews_by_caretaker_id(caretaker_id=caretaker_id)
        all_reviewsDTO = [ReviewDTO.model_validate(review) for review in all_reviews]
        return all_reviewsDTO
