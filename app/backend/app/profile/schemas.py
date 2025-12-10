from pydantic import BaseModel, StringConstraints, field_validator
from typing import Optional, Literal, Annotated
from datetime import datetime
from .enums import Gender


class Profile(BaseModel):
    """
    Base Pydantic model representing user profile data.

    Used as a return type for profile retrieval and as a base for registration/update schemas.

    Attributes:
        first_name (str): User's first name.
        last_name (Optional[str]): User's last name.
        dob (Optional[datetime]): Date of birth of the user.
        gender (Optional[Gender]): User's gender.
        contact_num (Optional[str]): User's contact number.
        address (Optional[str]): User's address.
        type (Optional[str]): Profile type (e.g., "owner" or "caretaker").
        yoe (Optional[int]): Years of experience (for caretakers only).
    """

    first_name: str
    last_name: Optional[str] = None
    dob: Optional[datetime] = None
    gender: Optional[Gender] = None
    contact_num: Optional[str] = None
    address: Optional[str] = None
    type: Optional[str] = None
    yoe: Optional[int] = None
    profile_picture: Optional[str] = None

    class Config:
        from_attributes = True


class ProfileAuthRegister(Profile):
    """
    Profile schema used during standard registration.

    Inherits all fields from Profile.
    """

    pass


class ProfileUpdate(BaseModel):
    """
    Schema for updating existing profile fields.

    Only fields provided will be updated.
    """

    first_name: Optional[Annotated[str, StringConstraints(min_length=3)]] = None
    last_name: Optional[Annotated[str, StringConstraints(min_length=3)]] = None
    dob: Optional[datetime] = None
    gender: Optional[Gender] = None
    contact_num: Optional[str] = None
    address: Optional[str] = None


class ProfileUpdateRequest(ProfileUpdate):
    """
    Schema for profile update requests including caretaker-specific fields.

    Attributes:
        yoe (Optional[int]): Years of experience; must be >= 0 if provided.
    """

    yoe: Optional[int] = None

    @field_validator("yoe")
    def yoe_gt_zero(cls, value: int) -> int:
        """
        Validate that years of experience is greater than or equal to 0.

        Args:
            value (int): The yoe value.

        Returns:
            int: The validated yoe value.

        Raises:
            ValueError: If yoe is negative.
        """
        if value < 0:
            raise ValueError("Years of experience(yoe) must be greater or equal to 0")
        return value


class ProfileOAuthRegister(ProfileAuthRegister):
    """
    Schema for profile registration via OAuth providers.

    Inherits all fields from ProfileAuthRegister.
    """

    pass


class ProfileOnboardRequest(BaseModel):
    """
    Schema for onboarding a new profile.

    All fields are required to complete onboarding.

    Attributes:
        first_name (str): First name of the user.
        last_name (str): Last name of the user.
        dob (datetime): Date of birth.
        gender (Gender): User's gender.
        contact_num (str): Contact number.
        address (str): Address.
        type (Literal["owner", "caretaker"]): Profile type.
        yoe (Optional[int]): Years of experience (only for caretakers).
    """

    first_name: str
    last_name: str
    dob: datetime
    gender: Gender
    contact_num: str
    address: str
    type: Literal["owner", "caretaker"]
    yoe: Optional[int] = None


class ProfileOnboard(BaseModel):
    """
    Schema representing profile data required for onboarding.

    Similar to ProfileOnboardRequest, but without the optional yoe field.
    """

    first_name: str
    last_name: str
    dob: datetime
    gender: Gender
    contact_num: str
    address: str
    type: Literal["owner", "caretaker"]


class ProfileGetResponse(BaseModel):
    """
    Schema representing profile data retrieved for displaying to other users
    """

    first_name: str
    last_name: str
    profile_picture: str
