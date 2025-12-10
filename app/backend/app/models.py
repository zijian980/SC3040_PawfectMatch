from sqlalchemy.orm import Mapped, mapped_column, Mapper
from sqlalchemy.engine import Connection
from sqlalchemy import event
import datetime
from datetime import timezone
from typing import Any


class TimeStampMixin(object):
    """Timestamping mixin for created_at and updated_at fields."""

    created_at: Mapped[datetime.datetime] = mapped_column(default=lambda: datetime.datetime.now(timezone.utc))
    created_at._creation_order = 9998
    updated_at: Mapped[datetime.datetime] = mapped_column(default=lambda: datetime.datetime.now(timezone.utc))
    updated_at._creation_order = 9998

    @staticmethod
    def _updated_at(mapper: Mapper[Any], connection: Connection, target: Any) -> None:
        """Updates the updated_at field to the current UTC time."""
        target.updated_at = datetime.datetime.now(timezone.utc)

    @classmethod
    def __declare_last__(cls) -> None:
        """Registers the before_update event to update the updated_at field."""
        event.listen(cls, "before_update", cls._updated_at)
