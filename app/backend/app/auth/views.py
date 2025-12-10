from fastapi import APIRouter, status, Body
from fastapi.responses import RedirectResponse, Response
from fastapi.exceptions import HTTPException
from fastapi.requests import Request
from .schemas import (
    AuthLogin,
    AuthRegister,
    AuthPasswordUpdate,
)
from .dependency import CurrentId, InternalAuthSvc as AuthSvc
from secrets import token_urlsafe
from .oauth2 import oauth
from typing import Any
from app.config import get_settings
from app.util.cookies import set_cookie
from app.profile.dependency import ExternalProfileSvc as ProfileSvc
from app.profile.schemas import ProfileAuthRegister, ProfileOAuthRegister

auth_router = APIRouter()
settings = get_settings()


@auth_router.post("/login")
def login_auth(auth_in: AuthLogin, auth_service: AuthSvc) -> Response:
    auth = auth_service.login(email=auth_in.email, password=auth_in.password)
    response = Response(status_code=status.HTTP_200_OK)
    set_cookie(response=response, key="session_id", value=auth.session_id, max_age=10 * 60 * 60 * 24)  # 10 days
    return response


@auth_router.post("/register")
def register_auth(auth_new: AuthRegister, auth_service: AuthSvc, profile_service: ProfileSvc) -> Response:
    register_details = auth_service.register(auth_in=auth_new)
    new_profile = ProfileAuthRegister(first_name=auth_new.first_name)
    profile_service.register_profile(profile_id=register_details.id, profile_new=new_profile)
    return Response(status_code=status.HTTP_201_CREATED)


@auth_router.patch(
    "/change-password",
    description="Send passwords as plaintext, censored values are not an issue",
)
def change_password_auth(
    auth_service: AuthSvc,
    user_id: CurrentId,
    pw_change: AuthPasswordUpdate = Body(...),
) -> Response:
    auth_service.change_password(user_id=user_id, auth_pw_in=pw_change)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@auth_router.get("/login/google", description="Redirects to Google OAuth2 login")
async def login_google(request: Request, auth_service: AuthSvc) -> Any:
    if hasattr(request.state, "session_id") and request.state.session_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already logged in")
    state = token_urlsafe(32)
    request.session["oauth_state"] = state
    redirect_uri = request.url_for("auth_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri, state=state)


@auth_router.get("/callback", name="auth_callback", description="Callback from OAuth2 authentication")
async def oauth_callback(request: Request, auth_service: AuthSvc, profile_service: ProfileSvc) -> RedirectResponse:
    state_in_session = request.session.get("oauth_state")
    query_state = request.query_params.get("state")
    if not state_in_session or state_in_session != query_state:
        raise HTTPException(status_code=400, detail="Invalid OAuth state")
    del request.session["oauth_state"]

    auth_details = await auth_service.process_oauth_callback(oauth=oauth, request=request)
    new_profile = ProfileOAuthRegister(first_name=auth_details.first_name, last_name=auth_details.last_name)
    profile_service.oauth_process_profile(profile_id=auth_details.id, profile_new=new_profile)
    response = RedirectResponse(
        url=f"{settings.frontend_url_with_scheme}"
    )  # Subject to change, required as OAuth2 flow goes thru backend
    set_cookie(response=response, key="session_id", value=auth_details.session_id, max_age=31 * 60 * 60 * 24)
    return response


@auth_router.post("/logout")
def logout(request: Request, auth_service: AuthSvc) -> Response:
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session ID")
    auth_service.logout(session_id=session_id)
    resp = Response(status_code=status.HTTP_200_OK)
    resp.delete_cookie(key="session_id")
    return resp
