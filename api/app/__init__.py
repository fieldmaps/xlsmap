import azure.functions as func
from fastapi import FastAPI

from .routers import router

app = FastAPI()
app.include_router(router, prefix="/api")


async def main(req, context):
    return await func.AsgiMiddleware(app).handle_async(req, context)
