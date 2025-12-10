from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.core import Base
from uuid import UUID


class PetOwner(Base):
    """
    Represents a pet owner in the system.

    Attributes:
        id (UUID): Primary key, foreign key referencing `profile.id`.
        profile (Profile): Relationship to the user's profile.
        pets (list[Pet]): List of pets owned by this PetOwner.
    """

    id: Mapped[UUID] = mapped_column(ForeignKey("profile.id", ondelete="CASCADE"), primary_key=True)

    # Relationships
    profile: Mapped["Profile"] = relationship(back_populates="petowner", lazy="joined")  # noqa
    pets: Mapped[list["Pet"]] = relationship(back_populates="owner")  # noqa
