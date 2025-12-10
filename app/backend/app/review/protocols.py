from typing import Protocol, List
from .schemas import Review as ReviewDTO
from .schemas import ReviewCreate
from uuid import UUID


class InternalReviewService(Protocol):
    def submit_reivew(self, *, reviewer_id: UUID, review_new: ReviewCreate) -> None: ...
    def get_reviews_of_offered_service(self, *, offered_service_id: int) -> List[ReviewDTO]: ...
    def get_reviews_by_caretaker_id(self, *, caretaker_id: UUID) -> List[ReviewDTO]: ...
