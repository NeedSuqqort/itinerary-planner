import sqlite3
import os
from contextlib import contextmanager
from typing import Generator


def get_database_path() -> str:
    """Get the database path from environment or default."""
    return os.getenv("DATABASE_PATH", "itinerary_planner.db")


def init_db(db_path: str = None) -> None:
    """Initialize the database with required tables."""
    if db_path is None:
        db_path = get_database_path()
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS plans (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            destination TEXT NOT NULL,
            start_date TEXT NOT NULL,
            end_date TEXT NOT NULL,
            travelers INTEGER NOT NULL,
            interests TEXT NOT NULL,
            itinerary TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
        """
    )

    conn.commit()
    conn.close()


@contextmanager
def get_db() -> Generator[sqlite3.Connection, None, None]:
    """Get a database connection context manager."""
    conn = sqlite3.connect(get_database_path())
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


def dict_from_row(row: sqlite3.Row) -> dict:
    """Convert a sqlite3.Row to a dictionary."""
    return dict(row) if row else None

