from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from .database import Base


def upsert(db: Session, instance: Base) -> None:
    """
    Insert `instance` to `db` database session, unless there is a primary key
    collision, in which case update the matching row.
    """
    model = type(instance)

    pk_cols: set[str] = {col.name for col in model.__table__.primary_key.columns}
    all_cols: set[str] = {col.name for col in model.__table__.columns}
    update_cols: set[str] = all_cols - pk_cols

    row: dict = {k: v for k, v in instance.__dict__.items() if k in all_cols}
    stmt = insert(model).values(**row)
    stmt = stmt.on_conflict_do_update(
        index_elements=pk_cols,
        set_={k: v for k, v in row.items() if k in update_cols}
    )
    db.execute(stmt)

    return
