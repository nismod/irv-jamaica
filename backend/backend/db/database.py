from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import Session


# pass empty connection string to use PG* environment variables
# (see https://www.postgresql.org/docs/current/libpq-envars.html)
engine = create_engine("postgresql+psycopg2://", future=True)
session = Session(engine)

Base = declarative_base()
