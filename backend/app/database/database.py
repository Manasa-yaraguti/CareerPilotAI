from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.database.config import (
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_NAME,
    DATABASE_USER,
    DATABASE_PASSWORD,
)

if DATABASE_HOST and DATABASE_USER and DATABASE_NAME:
    DATABASE_URL = (
        f"postgresql://{DATABASE_USER}:{DATABASE_PASSWORD or ''}"
        f"@{DATABASE_HOST}:{DATABASE_PORT or 5432}/{DATABASE_NAME}"
    )
    engine = create_engine(DATABASE_URL)
else:
    DATABASE_URL = "sqlite:///./careerpilot.db"
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Create the Base class
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()