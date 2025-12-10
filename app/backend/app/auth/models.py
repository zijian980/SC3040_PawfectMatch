from app.database.core import Base
from app.models import TimeStampMixin
from sqlalchemy.orm import Mapped, relationship, mapped_column
from sqlalchemy import ForeignKey
import bcrypt
from uuid import UUID, uuid4
import secrets


def hash_password(password: str) -> bytes:
    """Hash a password using bcrypt."""
    pw = password.encode("utf-8")
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pw, salt)


class Auth(Base):
    """
    Represents authentication details

    Attributes:
        id (UUID): Primary key
        email (str): Email of user
        password (bytes): Password of user, in bytes (hashed with bcrypt)
    """

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    email: Mapped[str] = mapped_column(nullable=False, unique=True, index=True)
    password: Mapped[bytes] = mapped_column(
        nullable=True,
        comment="Nullable due to usage of OAuth2 login. Users can set password later.",
    )
    sessions: Mapped[list["AuthSession"]] = relationship(back_populates="auth")

    def verify_password(self, password: str) -> bool:
        """Checks if the provided password matches stored hash"""
        if not password or not self.password:
            return False
        return bcrypt.checkpw(password.encode("utf-8"), self.password)

    def set_password(self, password: str) -> None:
        """Set new password for user"""
        if not password:
            raise ValueError("Password cannot be empty")
        self.password = hash_password(password)

    @property
    def token(self) -> str:
        return secrets.token_urlsafe(32)


class AuthSession(Base, TimeStampMixin):
    """
    AuthSession keeps track of user to session mapping

    Attributes:
        auth_id: Primary key, foreign key (Auth)
        session_id: Primary key, generated session_id on login
    """

    auth_id: Mapped[UUID] = mapped_column(ForeignKey("auth.id", ondelete="CASCADE"), primary_key=True)
    auth: Mapped["Auth"] = relationship(back_populates="sessions")
    session_id: Mapped[str] = mapped_column(primary_key=True)
