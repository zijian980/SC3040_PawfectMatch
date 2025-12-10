from fastapi import APIRouter
from app.auth.views import auth_router
from app.profile.views import profile_router
from app.onboarding.views import onboarding_router
from app.service.views import service_router, offered_service_router
from app.location.views import location_router
from app.booking.views import booking_router
from app.pet.views import pet_router
from app.billing.views import billing_router
from app.review.views import review_router

router = APIRouter()

# Include all views/routes here from individual domains
router.include_router(auth_router, prefix="/auth", tags=["Auth"])
router.include_router(profile_router, prefix="/profile", tags=["Profile"])
router.include_router(onboarding_router, prefix="/onboarding", tags=["Onboarding"])
router.include_router(service_router, prefix="/service", tags=["Service"])
router.include_router(offered_service_router, prefix="/offered-service", tags=["Offered Service"])
router.include_router(location_router, prefix="/location", tags=["Location"])
router.include_router(booking_router, prefix="/booking", tags=["Booking"])
router.include_router(pet_router, prefix="/pet", tags=["Pet"])
router.include_router(billing_router, prefix="/billing", tags=["Billing"])
router.include_router(review_router, prefix="/review", tags=["Review"])
