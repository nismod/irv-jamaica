from fastapi import Query
from backend.app import schemas
from backend.db.database import SessionLocal


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()