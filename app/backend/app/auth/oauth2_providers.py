from app.config import get_settings
from .schemas import OAuthProvider

settings = get_settings()

GOOGLE_PROVIDER = OAuthProvider(
    name="google",
    client_id=settings.GOOGLE_CLIENT_ID.get_secret_value(),
    client_secret=settings.GOOGLE_CLIENT_SECRET.get_secret_value(),
    access_token_url="https://oauth2.googleapis.com/token",
    authorize_url="https://accounts.google.com/o/oauth2/v2/auth",
    api_base_url="https://www.googleapis.com/oauth2/v2/",
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid email profile",
        "prompt": "consent",
    },
)
