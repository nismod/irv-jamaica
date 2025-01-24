from fastapi import FastAPI
from fastapi.routing import APIRoute

from .routers import attributes, features


def custom_generate_unique_id(route: APIRoute):
    return f"{route.tags[0]}-{route.name}"


app = FastAPI(generate_unique_id_function=custom_generate_unique_id)

app.include_router(features.router, prefix="/features")
app.include_router(attributes.router, prefix="/attributes")
