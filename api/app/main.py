from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from . import schemas, models
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/features/{feature_id}", response_model=schemas.Feature)
def read_feature(feature_id: str, db: Session = Depends(get_db)):
    feature = db.query(models.Feature).filter(models.Feature.id == feature_id).one()
    return feature
