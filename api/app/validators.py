from base64 import b64decode
from json import loads
from typing import Annotated

from fastapi import Header, HTTPException
from starlette.status import HTTP_401_UNAUTHORIZED

header = Annotated[str | None, Header()]


def authorized(slug: str = "", x_ms_client_principal: header = None):
    if x_ms_client_principal:
        roles = loads(b64decode(str(x_ms_client_principal)))["userRoles"]
        authorized = slug.replace("-", "_") in roles
        if not authorized:
            raise HTTPException(status_code=HTTP_401_UNAUTHORIZED)
