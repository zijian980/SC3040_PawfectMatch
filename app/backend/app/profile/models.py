from app.database.core import Base
from sqlalchemy import ForeignKey, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from uuid import UUID
from datetime import datetime
from .enums import Gender


class Profile(Base):
    """
    Represents a user's profile details.

    This model is linked to the Auth table via a one-to-one relationship.
    It stores personal information, contact info, onboarding status, type,
    and optional profile picture. Can be associated with either a PetOwner
    or a PetCareTaker entity depending on profile type.

    Attributes:
        id (UUID): Primary key, also a foreign key to `auth.id`. Cascade delete ensures
            profile is removed if auth is deleted.
        first_name (str): User's first name. Required.
        last_name (str, optional): User's last name. Optional.
        dob (datetime, optional): Date of birth of the user.
        gender (Gender, optional): Enum indicating user's gender (male, female, others).
        contact_num (str, optional): Contact number of the user.
        address (str, optional): Physical address of the user.
        onboarded (bool): Whether the profile has completed onboarding. Defaults to False.
        type (str): Profile type, e.g., "profile", "caretaker", or "owner". Defaults to "profile".
        profile_picture (str, optional): URL or path to profile picture.
        petowner (PetOwner, optional): Relationship to PetOwner entity if profile is an owner.
        petcaretaker (PetCareTaker, optional): Relationship to PetCareTaker entity if profile is a caretaker.
    """

    id: Mapped[UUID] = mapped_column(ForeignKey("auth.id", ondelete="CASCADE"), primary_key=True)
    first_name: Mapped[str] = mapped_column(nullable=False)
    last_name: Mapped[str] = mapped_column(nullable=True)
    dob: Mapped[datetime] = mapped_column(nullable=True)
    gender: Mapped[Gender] = mapped_column(nullable=True)
    contact_num: Mapped[str] = mapped_column(nullable=True)
    address: Mapped[str] = mapped_column(nullable=True)
    onboarded: Mapped[bool] = mapped_column(default=False, server_default=text("false"))
    type: Mapped[str] = mapped_column(nullable=False, default="profile")
    profile_picture: Mapped[str] = mapped_column(nullable=True)

    # Relationships
    petowner: Mapped["PetOwner"] = relationship(back_populates="profile", lazy="joined")  # noqa
    petcaretaker: Mapped["PetCareTaker"] = relationship(back_populates="profile", lazy="joined")  # noqa
