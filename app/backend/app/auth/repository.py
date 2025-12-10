from sqlalchemy.orm import Session
from sqlalchemy import select, delete
from .models import Auth, AuthSession
from uuid import UUID
from app.util.repository import get_by_field, db_add
from typing import Optional


class AuthRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def get_by_email(self, email: str) -> Optional[Auth]:
        return get_by_field(self.db_session, Auth, "email", email)

    def get_by_id(self, id: UUID) -> Optional[Auth]:
        return get_by_field(self.db_session, Auth, "id", id)

    def get_by_session_id(self, session_id: str) -> Optional[Auth]:
        stmt = select(Auth, AuthSession).join(Auth.sessions).where(AuthSession.session_id == session_id)
        auth = self.db_session.execute(stmt).scalar_one_or_none()
        return auth

    def create_auth(self, auth_new: Auth) -> None:
        db_add(self.db_session, auth_new)

    def create_session(self, session_new: AuthSession) -> None:
        db_add(self.db_session, session_new)

    def delete_session(self, session_id: str) -> None:
        stmt = delete(AuthSession).where(AuthSession.session_id == session_id)
        self.db_session.execute(stmt)
