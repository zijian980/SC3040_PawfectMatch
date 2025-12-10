from .models import Auth, AuthSession
from .schemas import (
    AuthRegister,
    AuthPasswordUpdate,
    OAuthLoginResponse,
    OAuthRegister,
    AuthLoginResponse,
    AuthRegisterResponse as AuthDTO,
)
from .protocols import InternalAuthService
from .repository import AuthRepository
from pydantic import SecretStr
from .exceptions import InvalidCredentials, EmailAlreadyExists, PasswordMismatch
from fastapi.requests import Request
from authlib.integrations.starlette_client import OAuth
from uuid import UUID


class AuthService(InternalAuthService):
    """
    Service class for managing authentication and authorization.

    Handles:
    - Login and logout
    - Registration (email/password and OAuth)
    - Session management
    - Password changes
    """

    def __init__(self, repo: AuthRepository):
        """
        Initialize the authentication service.

        Args:
            repo (AuthRepository): Repository used for persistence operations.
        """
        self.repo = repo

    def login(self, *, email: str, password: SecretStr) -> AuthLoginResponse:
        """
        Authenticate a user by email and password.

        Args:
            email (str): User's email.
            password (SecretStr): User's password.

        Returns:
            AuthLoginResponse: Contains the user ID and session ID.

        Raises:
            InvalidCredentials: If email is not found or password is invalid.
        """
        auth = self.repo.get_by_email(email=email)

        if not auth:
            raise InvalidCredentials("Invalid credentials")

        if not auth.verify_password(password.get_secret_value()):
            raise InvalidCredentials("Invalid credentials")

        session = self._create_session(auth=auth)
        auth_login = AuthLoginResponse(id=auth.id, session_id=session.session_id)
        return auth_login

    def retrieve_auth_id_by_session(self, *, session_id: str) -> UUID:
        """
        Retrieve the user ID linked to a session.

        Args:
            session_id (str): Session identifier.

        Returns:
            UUID: ID of the user owning the session.

        Raises:
            InvalidCredentials: If session is not found.
        """
        auth = self.repo.get_by_session_id(session_id)
        if auth is None:
            raise InvalidCredentials("Session doesn't exist")
        return auth.id

    def register(self, *, auth_in: AuthRegister) -> AuthDTO:
        """
        Register a new user with email and password.

        Args:
            auth_in (AuthRegister): Registration details.

        Returns:
            AuthDTO: Object with the new user's ID.

        Raises:
            EmailAlreadyExists: If the email is already registered.
        """
        email = auth_in.email
        auth = self.repo.get_by_email(email)
        if auth:
            raise EmailAlreadyExists("Email is already in use")
        new_auth = Auth(**auth_in.model_dump(exclude={"password", "first_name", "last_name", "dob", "gender"}))
        self.repo.create_auth(auth_new=new_auth)
        if auth_in.password:
            new_auth.set_password(auth_in.password.get_secret_value())
        return_register = AuthDTO(id=new_auth.id)
        return return_register

    def change_password(self, *, user_id: UUID, auth_pw_in: AuthPasswordUpdate) -> None:
        """
        Change the password for a user.

        Args:
            user_id (UUID): ID of the user.
            auth_pw_in (AuthPasswordUpdate): Old and new password data.

        Raises:
            InvalidCredentials: If the user does not exist.
            PasswordMismatch: If the old password does not match.
        """
        auth = self.repo.get_by_id(user_id)
        if auth is None:
            raise InvalidCredentials("User does not exist")

        if auth.password is None:
            auth.set_password(auth_pw_in.new_password.get_secret_value())
            return

        if not auth.verify_password(auth_pw_in.old_password.get_secret_value()):
            raise PasswordMismatch("Invalid old password")

        auth.set_password(auth_pw_in.new_password.get_secret_value())

    async def process_oauth_callback(self, oauth: OAuth, request: Request) -> OAuthLoginResponse:
        """
        Process an OAuth callback (e.g., from Google).

        Args:
            oauth (OAuth): OAuth client.
            request (Request): FastAPI request.

        Returns:
            OAuthLoginResponse: Contains user ID, session ID, and basic profile info.

        Notes:
            - If user does not exist, registers them via OAuth.
            - Always creates a new session.
        """
        token = await oauth.google.authorize_access_token(request)
        email = token["userinfo"]["email"]
        first_name = token["userinfo"]["given_name"]
        last_name = token["userinfo"]["family_name"]
        auth = self.repo.get_by_email(email)
        if not auth:
            new_auth = OAuthRegister(email=email, first_name=first_name, last_name=last_name)
            auth = self._register_oauth(auth_in=new_auth)
        session = self._create_session(auth=auth)
        return OAuthLoginResponse(id=auth.id, session_id=session.session_id, first_name=first_name, last_name=last_name)

    def logout(self, *, session_id: str) -> None:
        """
        End a user session.

        Args:
            session_id (str): The session identifier.

        Raises:
            InvalidCredentials: If the session ID does not exist.
        """
        if not self.repo.get_by_session_id(session_id=session_id):
            raise InvalidCredentials("Session ID doesn't exist")
        self.repo.delete_session(session_id=session_id)

    def _register_oauth(self, *, auth_in: OAuthRegister) -> Auth:
        """
        Internal helper: register a user via OAuth.

        Args:
            auth_in (OAuthRegister): Data from the OAuth provider.

        Returns:
            Auth: Created Auth model.
        """
        new_auth = Auth(**auth_in.model_dump(exclude={"first_name", "last_name"}))
        self.repo.create_auth(new_auth)
        return new_auth

    def _create_session(self, *, auth: Auth) -> AuthSession:
        """
        Internal helper: create a session for a user.

        Args:
            auth (Auth): The authenticated user.

        Returns:
            AuthSession: New session object.
        """
        session = AuthSession(auth=auth, session_id=auth.token)
        self.repo.create_session(session)
        return session
