import os

from sqlalchemy import create_engine, pool
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# Use environment variable for DATABASE_URL or default to SQLite
_db_url = os.environ.get("DATABASE_URL", "sqlite:///./inventory.db")

# For SQLite, we need special connect_args
_connect_args: dict = {}
if "sqlite" in _db_url:
    _connect_args["check_same_thread"] = False

# Sync engine for ORM operations and Alembic (offline mode)
sync_engine = create_engine(_db_url, connect_args=_connect_args)

# Alias 'engine' for backward compatibility
engine = sync_engine

# Async engine for async operations (requires aiosqlite for SQLite async support)
async_engine = create_async_engine(
    _db_url.replace("sqlite://", "sqlite+aiosqlite://"),
    connect_args={"check_same_thread": False},
    poolclass=pool.NullPool,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=sync_engine)


class Base(DeclarativeBase):
    """Base class for all ORM models."""

    pass


async def get_async_session() -> AsyncSession:
    """Get an async database session."""
    async with AsyncSession(async_engine) as session:
        yield session


def get_session():
    """Get a sync database session (for Alembic and traditional use)."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
