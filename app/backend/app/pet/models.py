from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.core import Base
from uuid import UUID


class Pet(Base):
    """
    Represents a pet belonging to a PetOwner.

    Attributes:
        id (int): Primary key, auto-incremented.
        owner_id (UUID): Foreign key referencing `pet_owner.id`. Cascade delete ensures
            pets are deleted when their owner is deleted.
        name (str): Name of the pet.
        species (str): Species of the pet (e.g., dog, cat).
        breed (str): Breed of the pet.
        age (int): Age of the pet.
        health (str): Health status of the pet. Defaults to "Healthy".
        preferences (str): Additional preferences or notes about the pet. Defaults to "NIL".
        owner (PetOwner): Relationship to the PetOwner entity.
        service_bookings (list[ServiceBooking]): Relationship to service bookings for this pet.
    """

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    owner_id: Mapped[UUID] = mapped_column(ForeignKey("pet_owner.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(nullable=False)
    species: Mapped[str] = mapped_column(nullable=False)
    breed: Mapped[str] = mapped_column(nullable=False)
    age: Mapped[int] = mapped_column(nullable=False)
    health: Mapped[str] = mapped_column(nullable=False, default="Healthy")
    preferences: Mapped[str] = mapped_column(nullable=False, default="NIL")

    # Relationships
    owner: Mapped["PetOwner"] = relationship(back_populates="pets")  # noqa
    service_bookings: Mapped[list["ServiceBooking"]] = relationship(back_populates="pet")  # noqa
