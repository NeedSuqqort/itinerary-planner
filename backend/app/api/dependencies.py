from typing import Generator
from app.db.database import get_db
import sqlite3


async def get_database() -> Generator[sqlite3.Connection, None, None]:
    """Dependency to get database connection."""
    with get_db() as conn:
        yield conn
