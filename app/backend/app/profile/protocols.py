from typing import Protocol
from .schemas import Profile, ProfileAuthRegister, ProfileOAuthRegister, ProfileUpdate, ProfileOnboard
from uuid import UUID
from fastapi import UploadFile


class ExternalProfileService(Protocol):
    """
    Protocol defining the external interface for profile services.

    Intended for modules that consume profile-related functionality, such as API routes.
    """

    def register_profile(self, *, profile_id: UUID, profile_new: ProfileAuthRegister) -> None:
        """
        Register a new profile from standard authentication.

        Args:
            profile_id (UUID): The user ID to associate with the profile.
            profile_new (ProfileAuthRegister): Data for the new profile.
        """

    def get_profile(self, *, profile_id: UUID) -> Profile:
        """
        Retrieve a profile by its ID.

        Args:
            profile_id (UUID): The profile ID.

        Returns:
            Profile: The retrieved profile object.
        """

    def oauth_process_profile(self, *, profile_id: UUID, profile_new: ProfileOAuthRegister) -> None:
        """
        Process or create a profile from OAuth registration.

        Args:
            profile_id (UUID): The user ID.
            profile_new (ProfileOAuthRegister): Data from the OAuth provider.
        """

    def onboard_profile(self, *, profile_id: UUID, profile_update: ProfileOnboard) -> None:
        """
        Complete onboarding for a profile.

        Args:
            profile_id (UUID): The profile ID.
            profile_update (ProfileOnboard): Onboarding data.
        """

    def check_onboarding_status(self, *, profile_id: UUID) -> bool:
        """
        Check if a profile has completed onboarding.

        Args:
            profile_id (UUID): The profile ID.

        Returns:
            bool: True if onboarding is complete, False otherwise.
        """

    def complete_onboard(self, *, profile_id: UUID) -> None:
        """
        Mark a profile as having completed onboarding.

        Args:
            profile_id (UUID): The profile ID.
        """


class InternalProfileService(ExternalProfileService, Protocol):
    """
    Protocol extending ExternalProfileService with internal operations.

    Includes methods intended for internal service logic, such as updating profiles.
    """

    def update_profile(self, *, profile_id: UUID, profile_update: ProfileUpdate) -> None:
        """
        Update an existing profile with new data.

        Args:
            profile_id (UUID): The profile ID.
            profile_update (ProfileUpdate): Updated profile data.
        """

    def change_profile_picture(self, *, profile_id: UUID, file: UploadFile) -> str:
        """
        UPdates an existing profile's profile image

        Args:
            profile_id (UUID): The profile ID.
            file (UploadFIle): Uploaded image file
        Returns:
            str: New file path of image
        """
