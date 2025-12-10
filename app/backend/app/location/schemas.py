from pydantic import BaseModel


class Location(BaseModel):
    """
    Data Transfer Object for Location.

    Attributes:
        id (int): Unique identifier of the location.
        name (str): Name of the location.
    """

    id: int
    name: str

    model_config = {"from_attributes": True}
