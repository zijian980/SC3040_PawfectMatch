from fastapi.responses import Response


def set_cookie(*, response: Response, key: str, value: str, max_age: int) -> None:
    response.set_cookie(
        key=key,
        value=value,
        httponly=True,
        secure=False,
        samesite="lax",  # needed for localhost cross port
        max_age=max_age,  # 31 days
    )
