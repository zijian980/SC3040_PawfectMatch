from pydantic import BaseModel, SecretStr, field_validator, StringConstraints, EmailStr
from datetime import datetime, timezone
from typing import Optional, Annotated
from app.profile.enums import Gender
from uuid import UUID


class AuthLogin(BaseModel):
    """
    Schema for user login via email and password.

    Used in:
        - AuthService.login
        - /login endpoint
    """

    email: EmailStr
    password: SecretStr

    @field_validator("password")
    def validate_password(cls, v: SecretStr) -> SecretStr:
        """
        Validate password complexity for login and registration.

        Requirements:
            - At least 8 characters
            - At least one lowercase letter
            - At least one uppercase letter
            - At least one digit
            - At least one special character (@$!%*?&)
        """
        pw = v.get_secret_value()
        if len(pw) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not any(c.islower() for c in pw):
            raise ValueError("Password must contain a lowercase letter")
        if not any(c.isupper() for c in pw):
            raise ValueError("Password must contain an uppercase letter")
        if not any(c.isdigit() for c in pw):
            raise ValueError("Password must contain a digit")
        if not any(c in "@$!%*?&" for c in pw):
            raise ValueError("Password must contain a special character (@$!%*?&)")
        return v


class AuthRegister(AuthLogin):
    """
    Schema for user registration.

    Extends AuthLogin with additional user profile information.

    Used in:
        - AuthService.register
        - /register endpoint
    """

    first_name: Annotated[str, StringConstraints(min_length=3)]
    dob: datetime
    gender: Gender

    @field_validator("dob")
    def validate_dob(cls, v: datetime) -> datetime:
        """
        Ensure Date of Birth is in the past.

        Raises:
            ValueError: If the date is today or in the future.
        """
        if v.date() >= datetime.now(timezone.utc).date():
            raise ValueError("Date of Birth cannot be today or later")
        return v


class AuthLoginResponse(BaseModel):
    """
    Response schema returned after successful login.

    Contains the authenticated user's ID and session ID.

    Used in:
        - AuthService.login
        - /login endpoint
    """

    id: UUID
    session_id: str


class AuthPasswordUpdate(BaseModel):
    """
    Schema for updating a user's password.

    Used in:
        - AuthService.change_password
        - /change-password endpoint
    """

    old_password: SecretStr
    new_password: SecretStr

    @field_validator("new_password")
    def validate_password(cls, v: SecretStr) -> SecretStr:
        """
        Validate password complexity for new password.

        Same requirements as AuthLogin.
        """
        pw = v.get_secret_value()
        if len(pw) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not any(c.islower() for c in pw):
            raise ValueError("Password must contain a lowercase letter")
        if not any(c.isupper() for c in pw):
            raise ValueError("Password must contain an uppercase letter")
        if not any(c.isdigit() for c in pw):
            raise ValueError("Password must contain a digit")
        if not any(c in "@$!%*?&" for c in pw):
            raise ValueError("Password must contain a special character (@$!%*?&)")
        return v


class AuthRegisterResponse(BaseModel):
    """
    Response schema returned after successful registration.

    Contains only the new user's ID.

    Used in:
        - AuthService.register
        - /register endpoint
    """

    id: UUID


class OAuthRegister(BaseModel):
    """
    Schema representing the information needed to register a user via OAuth.

    Used in:
        - AuthService._register_oauth
        - process_oauth_callback
    """

    email: str
    first_name: str
    last_name: str


class OAuthLoginResponse(AuthLoginResponse):
    """
    Response schema for OAuth login/registration.

    Extends AuthLoginResponse to include first and last names.

    Used in:
        - AuthService.process_oauth_callback
        - /callback endpoint
    """

    first_name: str
    last_name: str


class OAuthProvider(BaseModel):
    """
    Configuration schema for an OAuth provider.

    Contains all necessary endpoints and credentials for OAuth flow.

    Used in:
        - OAuth client configuration
    """

    name: str
    client_id: str
    client_secret: str
    access_token_url: str
    authorize_url: str
    api_base_url: str
    server_metadata_url: str
    client_kwargs: Optional[dict[str, str]] = {}
