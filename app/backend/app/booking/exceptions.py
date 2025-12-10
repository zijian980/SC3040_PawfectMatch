from app.exceptions import ResourceNotExists, InsufficientPermissions


class BookingNotExists(ResourceNotExists):
    pass


class BookingPermissionDenied(InsufficientPermissions):
    pass
