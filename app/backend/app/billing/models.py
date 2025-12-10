from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.core import Base
from datetime import datetime
from .enums import PayStatus


class Billing(Base):
    id: Mapped[int] = mapped_column(ForeignKey("service_booking.id"), primary_key=True)
    total_payable: Mapped[float] = mapped_column(nullable=False)
    paid_at: Mapped[datetime] = mapped_column(nullable=True)
    status: Mapped[PayStatus] = mapped_column(default=PayStatus.Pending, nullable=False)

    service_booking: Mapped["ServiceBooking"] = relationship(back_populates="billing")  # noqa
    payment: Mapped["Payment"] = relationship(back_populates="billing", lazy="joined")  # noqa
