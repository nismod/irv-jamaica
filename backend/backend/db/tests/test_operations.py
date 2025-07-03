import pytest
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

from backend.db.operations import upsert


Base = declarative_base()


class CompositeKeyModel(Base):
    __tablename__ = "composite_key_model"
    id = Column(Integer, primary_key=True)
    other_id = Column(Integer, primary_key=True)
    name = Column(String)


@pytest.fixture(scope="function")
def db_session():
    # Use in-memory SQLite for testing
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()


def make_instance(**kwargs):
    # Provide required PK fields and at least one value field
    defaults = dict(
        id=1,
        other_id=2,
        name="foo",
    )
    defaults.update(kwargs)
    return CompositeKeyModel(**defaults)


def test_upsert_insert(db_session):
    instance = make_instance()
    upsert(db_session, instance)
    db_session.commit()
    result = db_session.query(CompositeKeyModel).one()
    assert result.id == 1
    assert result.other_id == 2
    assert result.name == "foo"


def test_upsert_update(db_session):
    instance = make_instance()
    upsert(db_session, instance)
    db_session.commit()
    instance2 = make_instance(name="bar")
    upsert(db_session, instance2)
    db_session.commit()
    result = db_session.query(CompositeKeyModel).one()
    assert result.name == "bar"


def test_upsert_composite_key(db_session):
    instance1 = make_instance()
    instance2 = make_instance(other_id=3)
    upsert(db_session, instance1)
    upsert(db_session, instance2)
    db_session.commit()
    results = db_session.query(CompositeKeyModel).all()
    assert len(results) == 2
    assert {r.other_id for r in results} == {2, 3}
