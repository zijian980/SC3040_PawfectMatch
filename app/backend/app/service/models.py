from sqlalchemy import ForeignKey, Enum, Table, Column, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import ARRAY
from app.database.core import Base
from uuid import UUID
from .enums import Day as DayEnum


class Service(Base):
    """
    Represents a service type that a caretaker can offer.

    Attributes:
        id (int): Primary key.
        name (str): Name of the service.
        offered_services (list[OfferedService]): Services offered by caretakers under this service type.
    """

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(nullable=False)
    offered_services: Mapped[list["OfferedService"]] = relationship(back_populates="service")


class OfferedService(Base):
    """
    Represents a specific service offered by a PetCareTaker.

    Attributes:
        id (int): Primary key.
        service_id (int): Foreign key referencing Service.id.
        caretaker_id (UUID): Foreign key referencing PetCareTaker.id.
        rate (int): Service rate.
        day (list[DayEnum]): Days on which service is offered.
        service (Service): Relationship to Service.
        service_bookings (list[ServiceBooking]): Bookings for this service.
        petcaretaker (PetCareTaker): Relationship to the caretaker offering this service.
        locations (list[Location]): Locations associated with this service.
    """

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    service_id: Mapped[int] = mapped_column(ForeignKey("service.id", ondelete="CASCADE"), nullable=False)
    caretaker_id: Mapped[UUID] = mapped_column(ForeignKey("pet_care_taker.id", ondelete="CASCADE"), nullable=False)
    rate: Mapped[int] = mapped_column(nullable=False)
    day: Mapped[list[DayEnum]] = mapped_column(ARRAY(Enum(DayEnum)), nullable=False)

    service: Mapped["Service"] = relationship(back_populates="offered_services", lazy="joined")
    service_bookings: Mapped[list["ServiceBooking"]] = relationship(back_populates="offered_service")  # noqa
    petcaretaker: Mapped["PetCareTaker"] = relationship(back_populates="offered_services")  # noqa
    locations: Mapped[list["Location"]] = relationship(  # noqa
        secondary="offered_service_location", back_populates="offered_services"
    )

    __table_args__ = (UniqueConstraint("service_id", "caretaker_id", name="uix_service_caretaker"),)


# Association table for many-to-many between OfferedService and Location
offered_service_location = Table(
    "offered_service_location",
    Base.metadata,
    Column("offered_service_id", ForeignKey("offered_service.id", ondelete="CASCADE"), primary_key=True),
    Column("location_id", ForeignKey("location.id", ondelete="CASCADE"), primary_key=True),
)
