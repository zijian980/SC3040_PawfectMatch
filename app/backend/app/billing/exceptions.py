from app.exceptions import InsufficientPermissions, ResourceNotExists, ResourceAlreadyExists


class BillingAlreadyExists(ResourceAlreadyExists):
    pass


class BillingNotExists(ResourceNotExists):
    pass


class BillingPermissionDenied(InsufficientPermissions):
    pass
