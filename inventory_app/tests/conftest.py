import os
import tempfile
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

# Point DATABASE_URL to a temp file BEFORE any app.* imports happen.
_test_db = Path(tempfile.gettempdir()) / f"inventory_test_{id(os)}.db"
os.environ["DATABASE_URL"] = f"sqlite:///{_test_db}"


from app.database import Base, engine  # noqa: E402
from app.main import app  # noqa: E402

# Ensure tables exist on this engine (idempotent).
Base.metadata.create_all(bind=engine)


@pytest.fixture(autouse=True)
def _drop_tables():
    """Drop and recreate tables between tests for isolation."""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture
def client():
    tc = TestClient(app)
    yield tc
    tc.close()
