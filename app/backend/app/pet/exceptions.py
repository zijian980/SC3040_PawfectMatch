from app.exceptions import ResourceNotExists, InsufficientPermissions


class PetNotExists(ResourceNotExists):
    pass


class PetPermissionDenied(InsufficientPermissions):
    pass
