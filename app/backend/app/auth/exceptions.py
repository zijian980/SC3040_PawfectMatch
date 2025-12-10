class InvalidCredentials(Exception):
    """Raised when a user provides invalid authentication details (e.g., wrong email or password)."""

    pass


class EmailAlreadyExists(Exception):
    """Raised when attempting to register with an email address that is already in use."""

    pass


class PasswordMismatch(Exception):
    """Raised when the old password provided does not match the user's current password."""

    pass
