from app.database.core import Base
from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .enums import Status
from datetime import datetime


class ServiceBooking(Base):
    """
    Represents a booking of an OfferedService for a Pet.
    Attributes:
        id (int): Primary key.
        offered_service_id (int): FK to OfferedService.id.
        pet_id (int): FK to Pet.id.
        pet (Pet): Relationship to the booked pet.
        offered_service (OfferedService): Relationship to the offered service.
        service_booking_days (list[ServiceBookingDay]): Days of booking.
        review (Review): Review associated with this booking.
        billing (Billing): Billing information for this booking.
    """

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    offered_service_id: Mapped[int] = mapped_column(
        ForeignKey("offered_service.id", ondelete="CASCADE"), nullable=False
    )
    pet_id: Mapped[int] = mapped_column(ForeignKey("pet.id", ondelete="CASCADE"), nullable=False)
    date: Mapped[datetime] = mapped_column(nullable=False)
    status: Mapped[Status] = mapped_column(default=Status.Pending, nullable=False)

    pet: Mapped["Pet"] = relationship(back_populates="service_bookings")  # noqa
    offered_service: Mapped["OfferedService"] = relationship(back_populates="service_bookings")  # noqa
    review: Mapped["Review"] = relationship(back_populates="service_booking")  # noqa
    billing: Mapped["Billing"] = relationship(back_populates="service_booking")  # noqa

    __table_args__ = (UniqueConstraint("pet_id", "date", "offered_service_id", name="uix_pet_date_offered_svc"),)
