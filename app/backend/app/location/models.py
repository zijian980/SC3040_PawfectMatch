from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.core import Base
from app.service.models import offered_service_location


class Location(Base):
    """
    SQLAlchemy model representing a location.

    Attributes:
        id (int): Primary key, auto-incremented.
        name (str): Name of the location.
        offered_services (List[OfferedService]): List of offered services associated
            with this location via a many-to-many relationship.
    """

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(nullable=False)

    offered_services: Mapped[list["OfferedService"]] = relationship(  # noqa
        secondary=offered_service_location, back_populates="locations"
    )
