from typing import Annotated

from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker


# pass empty connection string to use PG* environment variables
# (see https://www.postgresql.org/docs/current/libpq-envars.html)
engine = create_engine("postgresql+psycopg2://", future=True)
Session = sessionmaker(engine, autoflush=False, autocommit=False)


def get_session():
    with Session() as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]

Base = declarative_base()
