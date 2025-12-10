from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.core import Base


class Review(Base):
    service_booking_id: Mapped[int] = mapped_column(
        ForeignKey("service_booking.id", ondelete="CASCADE"), primary_key=True
    )
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    description: Mapped[str] = mapped_column(nullable=False)
    rating: Mapped[int] = mapped_column(nullable=False)
    isAnonymouse: Mapped[bool] = mapped_column(nullable=False, default=True)

    service_booking: Mapped["ServiceBooking"] = relationship(back_populates="review", lazy="joined")  # noqa
