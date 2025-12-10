from .protocols import InternalProfileService
from .repository import ProfileRepository
from .schemas import (
    ProfileAuthRegister,
    Profile as ProfileDTO,
    ProfileOAuthRegister,
    ProfileUpdate,
    ProfileOnboard,
)
from .models import Profile
from uuid import UUID
from .exceptions import ProfileAlreadyExists, ProfileNotExists, ProfileAlreadyOnboarded
from fastapi import UploadFile
import os
import shutil
from uuid import uuid4

UPLOAD_DIR = "app/resources/uploads/profile"
BASE_URL = "/resources/profile"


class ProfileService(InternalProfileService):
    """
    Service implementing business logic for user profile management.

    Responsibilities:
        - Register new profiles (auth or OAuth)
        - Retrieve profile information
        - Onboard profiles
        - Update profiles
        - Check onboarding status
    """

    def __init__(self, repo: ProfileRepository):
        """
        Initialize the service with a repository.

        Args:
            repo (ProfileRepository): Repository handling persistence operations.
        """
        self.repo = repo

    def register_profile(self, *, profile_id: UUID, profile_new: ProfileAuthRegister) -> None:
        """
        Register a new profile for a user who signed up via standard auth.

        Args:
            profile_id (UUID): ID of the user.
            profile_new (ProfileAuthRegister): New profile data.

        Raises:
            ProfileAlreadyExists: If a profile with the same ID already exists.
        """
        if self.repo.get_by_id(profile_id):
            raise ProfileAlreadyExists("Profile already exists")
        profile = Profile(**profile_new.model_dump(exclude_unset=True, exclude={"yoe"}))
        profile.id = profile_id
        self.repo.create_profile(profile_new=profile)

    def get_profile(self, *, profile_id: UUID) -> ProfileDTO:
        """
        Retrieve a profile by user ID.

        Args:
            profile_id (UUID): ID of the profile to fetch.

        Returns:
            ProfileDTO: Pydantic model representing the profile.

        Raises:
            ProfileNotExists: If the profile does not exist.
        """
        profile = self.repo.get_by_id(profile_id=profile_id)
        if not profile:
            raise ProfileNotExists("Profile doesn't exist")
        return_profile = ProfileDTO.model_validate(profile)
        if profile.type == "caretaker" and hasattr(profile, "petcaretaker"):
            return_profile.yoe = profile.petcaretaker.yoe
        return return_profile

    def oauth_process_profile(self, *, profile_id: UUID, profile_new: ProfileOAuthRegister) -> None:
        """
        Handle profile creation or update after OAuth registration.

        Args:
            profile_id (UUID): ID of the user.
            profile_new (ProfileOAuthRegister): Data from OAuth provider.

        Notes:
            - Does nothing if profile already exists.
            - Calls internal helper to create profile if it doesn't exist.
        """
        profile = self.repo.get_by_id(profile_id=profile_id)
        if profile:
            return
        self._oauth_register_profile(profile_id=profile_id, profile_new=profile_new)

    def _oauth_register_profile(self, *, profile_id: UUID, profile_new: ProfileOAuthRegister) -> None:
        """
        Internal helper to create a new profile after OAuth registration.

        Args:
            profile_id (UUID): ID of the user.
            profile_new (ProfileOAuthRegister): Data from OAuth provider.
        """
        profile = Profile(**profile_new.model_dump(exclude_unset=True, exclude={"yoe"}))
        profile.id = profile_id
        self.repo.create_profile(profile_new=profile)

    def onboard_profile(self, *, profile_id: UUID, profile_update: ProfileOnboard) -> None:
        """
        Complete onboarding for a profile by updating required fields.

        Args:
            profile_id (UUID): ID of the profile to onboard.
            profile_update (ProfileOnboard): Onboarding data.

        Raises:
            ProfileNotExists: If the profile does not exist.
            ProfileAlreadyOnboarded: If onboarding was already completed.
        """
        profile = self.repo.get_by_id(profile_id=profile_id)
        if not profile:
            raise ProfileNotExists("Profile doesn't exist")
        if profile.onboarded:
            raise ProfileAlreadyOnboarded("Profile has already completed onboarding")
        self.repo.onboard_profile(profile_id=profile.id, profile_update=profile_update)

    def update_profile(self, *, profile_id: UUID, profile_update: ProfileUpdate) -> None:
        """
        Update fields in an existing profile.

        Args:
            profile_id (UUID): ID of the profile to update.
            profile_update (ProfileUpdate): Fields to update.
        """
        self.repo.update_profile(profile_id=profile_id, profile_update=profile_update)

    def complete_onboard(self, *, profile_id: UUID) -> None:
        """
        Mark the profile as having completed onboarding.

        Args:
            profile_id (UUID): ID of the profile.
        """
        self.repo.update_onboarding(profile_id=profile_id, status=True)

    def check_onboarding_status(self, *, profile_id: UUID) -> bool:
        """
        Check if a profile has completed onboarding.

        Args:
            profile_id (UUID): ID of the profile.

        Returns:
            bool: True if onboarding is complete, False otherwise.

        Raises:
            ProfileNotExists: If the profile does not exist.
        """
        profile = self.repo.get_by_id(profile_id=profile_id)
        if not profile:
            raise ProfileNotExists("Profile doesn't exist")
        return profile.onboarded

    def change_profile_picture(self, *, profile_id: UUID, file: UploadFile) -> str:
        """
        Updates profile_picture field of Profile entity

        Args:
            profile_id (UUID): ID of the profile
            file (UploadFile): Image file
        """
        filename = f"{uuid4()}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        file_url = f"{BASE_URL}/{filename}"
        self.repo.update_profile_picture(profile_id=profile_id, path=file_url)
        return file_url
