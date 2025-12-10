export const API = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/register",
    GOOGLE_LOGIN: "/auth/login/google",
    CALLBACK: "/auth/callback",
    LOGOUT: "/auth/logout",
  },
  PROFILE: {
    GET: "/profile",
    UPDATE: "/profile/update",
    PICTURE: "/profile/picture",
  },
  ONBOARDING: {
    STATUS: "/onboarding/status",
    PROFILE: "/onboarding/profile",
    PET: "/onboarding/pet",
    SERVICE: "/onboarding/service",
    COMPLETE: "/onboarding/complete",
  },
  SERVICE: {
    GET: "/service",
  },
  OFFERED_SERVICE: {
    BASE: "/offered-service",
    SEARCH: "/offered-service/search",
  },
  LOCATION: {
    GET: "/location",
  },
  BOOKING: {
    BASE: "/booking",
    ACCEPT: "/accept",
    DECLINE: "/decline",
    CANCEL: "/cancel",
    COMPLETE: "/completeservice",
    PAY: "/pay",
  },
  PET: "/pet",
  BILLING: {
    BASE: "/billing",
  },
  REVIEW: {
    BASE: "/review",
    SERVICE: "/review/service",
    USER: "/review/user",
  },
}
