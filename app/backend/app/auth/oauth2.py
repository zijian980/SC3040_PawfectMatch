from app.config import get_settings
from authlib.integrations.starlette_client import OAuth
from .schemas import OAuthProvider
from .oauth2_providers import GOOGLE_PROVIDER

settings = get_settings()

oauth = OAuth()  # type: ignore[no-untyped-call]


def register_provider(provider: OAuthProvider) -> None:
    oauth.register(**provider.model_dump())


register_provider(GOOGLE_PROVIDER)
