from app.exceptions import ResourceAlreadyExists, ResourceNotExists


class ProfileAlreadyExists(ResourceAlreadyExists):
    """
    Raised when attempting to create a profile that already exists.
    """

    pass


class ProfileNotExists(ResourceNotExists):
    """
    Raised when a profile is requested but does not exist.
    """

    pass


class ProfileAlreadyOnboarded(Exception):
    """
    Raised when attempting to onboard a profile that has already completed onboarding.
    """

    pass
