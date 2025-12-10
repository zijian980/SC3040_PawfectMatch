from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.requests import Request
from fastapi.staticfiles import StaticFiles
from .api import router
from .exception_handlers import register_exception_handlers
from starlette.middleware.sessions import SessionMiddleware
from app.middleware import AuthMiddleware, ResponseTimeMiddleware
import uvicorn
from contextlib import asynccontextmanager
from .config import get_settings
from typing import AsyncGenerator
from secrets import token_urlsafe
import os

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    yield


app = FastAPI(title=settings.APP_NAME, docs_url="/docs", lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[f"{settings.frontend_url_with_scheme}"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(SessionMiddleware, token_urlsafe(32))
app.add_middleware(AuthMiddleware)
app.add_middleware(ResponseTimeMiddleware)
app.include_router(router)
register_exception_handlers(app)

os.makedirs("app/resources/uploads/profile", exist_ok=True)
app.mount("/resources/profile", StaticFiles(directory="app/resources/uploads/profile"), name="profile_pics")


@app.get("/")
def root(request: Request) -> dict[str, str]:
    if request.cookies.get("session_id"):
        print(request.cookies.get("session_id"))
    return {"message": "Welcome to PawfectMatch"}


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
