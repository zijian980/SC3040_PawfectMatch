from app.exceptions import ResourceNotExists, ResourceAlreadyExists


class CareTakerOfferedServiceExists(ResourceAlreadyExists):
    pass


class OfferedServiceNotExists(ResourceNotExists):
    pass
