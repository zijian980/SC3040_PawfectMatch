from app.exceptions import ResourceNotExists, ResourceAlreadyExists


class PetOwnerNotExists(ResourceNotExists):
    pass


class PetOwnerExists(ResourceAlreadyExists):
    pass
