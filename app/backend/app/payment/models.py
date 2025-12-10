from app.database.core import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey


class Payment(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    billing_id: Mapped[int] = mapped_column(ForeignKey("billing.id", ondelete="CASCADE"))
    amount_paid: Mapped[float] = mapped_column(nullable=False)

    billing: Mapped["Billing"] = relationship(back_populates="payment")  # noqa
