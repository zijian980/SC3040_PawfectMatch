from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import sessionmaker, Session, declared_attr
from app.config import get_settings
from app.models import TimeStampMixin
from typing import Annotated, Generator
from fastapi import Depends
import re

settings = get_settings()

SQLALCHEMY_DATABASE_URL = settings.database_url

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_size=10,  # increase pool size
    max_overflow=20,  # increase overflow)
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def resolve_table_name(name: str) -> str:
    """Resolves table names to their mapped names."""
    names = re.split("(?=[A-Z])", name)  # noqa
    return "_".join([x.lower() for x in names if x])


class Base(DeclarativeBase, TimeStampMixin):
    """Base class for all SQLAlchemy models."""

    __repr_attrs__: list[str] = []
    __repr_max_length__ = 15

    @declared_attr.directive
    def __tablename__(cls) -> str:
        return resolve_table_name(cls.__name__)

    def dict(self) -> dict[str, str]:
        """Returns a dict representation of a model."""
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    @property
    def _id_str(self) -> str:
        ids = inspect(self).identity
        if ids:
            return "-".join([str(x) for x in ids]) if len(ids) > 1 else str(ids[0])
        else:
            return "None"

    @property
    def _repr_attrs_str(self) -> str:
        max_length = self.__repr_max_length__

        values = []
        single = len(self.__repr_attrs__) == 1
        for key in self.__repr_attrs__:
            if not hasattr(self, key):
                raise KeyError("{} has incorrect attribute '{}' in __repr__attrs__".format(self.__class__, key))
            value = getattr(self, key)
            wrap_in_quote = isinstance(value, str)

            value = str(value)
            if len(value) > max_length:
                value = value[:max_length] + "..."

            if wrap_in_quote:
                value = "'{}'".format(value)
            values.append(value if single else "{}:{}".format(key, value))

        return " ".join(values)

    def __repr__(self) -> str:
        # get id like '#123'
        id_str = ("#" + self._id_str) if self._id_str else ""
        # join class name, id and repr_attrs
        return "<{} {}{}>".format(
            self.__class__.__name__,
            id_str,
            " " + self._repr_attrs_str if self._repr_attrs_str else "",
        )


# Dependency
def get_db() -> Generator[Session, None, None]:
    session: Session = SessionLocal()
    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()


DbSession = Annotated[Session, Depends(get_db)]
