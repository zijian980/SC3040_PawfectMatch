from .schemas import (
    AuthRegister,
    AuthPasswordUpdate,
    OAuthLoginResponse,
    OAuthRegister,
    AuthLoginResponse,
    AuthRegisterResponse as AuthDTO,
)
from .models import Auth, AuthSession
from uuid import UUID
from authlib.integrations.starlette_client import OAuth
from fastapi.requests import Request
from typing import Protocol
from pydantic import SecretStr


class InternalAuthService(Protocol):
    """
    Protocol defining the interface for an authentication service.

    Implementers of this protocol must provide methods for user registration,
    login, session management, password updates, logout, and OAuth handling.
    """

    def login(self, *, email: str, password: SecretStr) -> AuthLoginResponse:
        """
        Authenticate a user using email and password.

        Args:
            email (str): User's email.
            password (SecretStr): User's password (wrapped for secrecy).

        Returns:
            AuthLoginResponse: Contains user ID and session ID.

        Raises:
            InvalidCredentials: If email is not found or password is invalid.
        """
        ...

    def retrieve_auth_id_by_session(self, *, session_id: str) -> UUID:
        """
        Retrieve the user ID associated with a session.

        Args:
            session_id (str): The session identifier.

        Returns:
            UUID: ID of the authenticated user.

        Raises:
            InvalidCredentials: If session does not exist.
        """
        ...

    def register(self, *, auth_in: AuthRegister) -> AuthDTO:
        """
        Register a new user with email/password.

        Args:
            auth_in (AuthRegister): User registration data.

        Returns:
            AuthDTO: Object containing the new user ID.

        Raises:
            EmailAlreadyExists: If email is already in use.
        """
        ...

    def _register_oauth(self, *, auth_in: OAuthRegister) -> Auth:
        """
        Internal helper to register a user via OAuth provider.

        Args:
            auth_in (OAuthRegister): Data received from OAuth provider.

        Returns:
            Auth: Newly created Auth model instance.
        """
        ...

    def _create_session(self, *, auth: Auth) -> AuthSession:
        """
        Internal helper to create a session for a user.

        Args:
            auth (Auth): Authenticated user.

        Returns:
            AuthSession: New session object.
        """
        ...

    def change_password(self, *, user_id: UUID, auth_pw_in: AuthPasswordUpdate) -> None:
        """
        Change the password of a user.

        Args:
            user_id (UUID): ID of the user.
            auth_pw_in (AuthPasswordUpdate): Old and new password data.

        Raises:
            InvalidCredentials: If user does not exist.
            PasswordMismatch: If old password is incorrect.
        """
        ...

    async def process_oauth_callback(self, oauth: OAuth, request: Request) -> OAuthLoginResponse:
        """
        Handle OAuth callback and login/registration flow.

        Args:
            oauth (OAuth): OAuth client instance.
            request (Request): FastAPI request object.

        Returns:
            OAuthLoginResponse: Contains user ID, session ID, and basic profile info.

        Notes:
            - Registers new users if they don't exist.
            - Always creates a session.
        """
        ...

    def logout(self, *, session_id: str) -> None:
        """
        Terminate a user session.

        Args:
            session_id (str): Session identifier to delete.

        Raises:
            InvalidCredentials: If session does not exist.
        """
        ...
