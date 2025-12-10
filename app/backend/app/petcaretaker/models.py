from app.database.core import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from uuid import UUID
from app.profile.models import Profile


class PetCareTaker(Base):
    """
    Represents a PetCareTaker profile.

    Attributes:
        id (UUID): Primary key, foreign key referencing `profile.id`.
        yoe (int): Years of experience of the PetCareTaker.
        profile (Profile): Relationship to the user's profile.
        offered_services (list[OfferedService]): Services offered by this PetCareTaker.
    """

    id: Mapped[UUID] = mapped_column(ForeignKey("profile.id", ondelete="cascade"), primary_key=True)
    yoe: Mapped[int] = mapped_column(nullable=False, comment="Years of experience")

    # Relationships
    profile: Mapped["Profile"] = relationship(back_populates="petcaretaker", lazy="joined")  # noqa
    offered_services: Mapped[list["OfferedService"]] = relationship(back_populates="petcaretaker")  # noqa
