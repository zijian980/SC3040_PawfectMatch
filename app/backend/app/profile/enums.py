from enum import Enum


class Gender(Enum):
    Male = "male"
    Female = "female"
    Others = "others"


class Role(Enum):
    PetOwner = "owner"
    PetCareTaker = "caretaker"
