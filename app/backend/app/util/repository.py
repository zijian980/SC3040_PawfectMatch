from sqlalchemy.orm import DeclarativeBase, Session
from typing import Type, Any, Optional


def get_by_field(session: Session, model: Type[DeclarativeBase], field: str, value: Any) -> Optional[Any]:
    """
    Generic helper to query any SQLAlchemy model by a specific field.

    Args:
        session: SQLAlchemy Session
        model: SQLAlchemy Declarative model class
        field: Column name to filter by
        value: Value to match

    Returns:
        Single instance of the model, or None if not found
    """
    # Validate the field exists in the model
    if not hasattr(model, field):
        raise ValueError(f"Invalid field '{field}' for model {model.__name__}")

    column = getattr(model, field)
    return session.query(model).filter(column == value).one_or_none()


def db_add(session: Session, obj: DeclarativeBase) -> None:
    session.add(obj)
    session.flush()
