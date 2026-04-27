import sqlite3
import json
from typing import Optional, List
from datetime import datetime
from .schemas import TravelPlan, ItineraryItem, UpdatePlanPayload


class PlanModel:
    @staticmethod
    def create(conn: sqlite3.Connection, plan_id: str, title: str, data: dict) -> TravelPlan:
        """Create a new travel plan."""
        cursor = conn.cursor()
        now = datetime.utcnow().isoformat()

        cursor.execute(
            """
            INSERT INTO plans
            (id, title, destination, start_date, end_date, travelers, interests, itinerary, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                plan_id,
                title,
                data.get("destination"),
                data.get("start_date"),
                data.get("end_date"),
                data.get("travelers"),
                json.dumps(data.get("interests", [])),
                json.dumps(data.get("itinerary", [])),
                now,
                now,
            ),
        )
        conn.commit()
        return PlanModel.get_by_id(conn, plan_id)

    @staticmethod
    def get_by_id(conn: sqlite3.Connection, plan_id: str) -> Optional[TravelPlan]:
        """Retrieve a plan by ID."""
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM plans WHERE id = ?", (plan_id,))
        row = cursor.fetchone()
        return PlanModel._row_to_plan(row) if row else None

    @staticmethod
    def get_all(conn: sqlite3.Connection) -> List[TravelPlan]:
        """Retrieve all plans."""
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM plans ORDER BY created_at DESC")
        rows = cursor.fetchall()
        return [PlanModel._row_to_plan(row) for row in rows]

    @staticmethod
    def update(conn: sqlite3.Connection, plan_id: str, data: UpdatePlanPayload) -> Optional[TravelPlan]:
        """Update an existing plan."""
        cursor = conn.cursor()
        now = datetime.utcnow().isoformat()

        cursor.execute(
            """
            UPDATE plans
            SET title = ?, destination = ?, start_date = ?, end_date = ?, travelers = ?, interests = ?, itinerary = ?, updated_at = ?
            WHERE id = ?
            """,
            (
                data.title,
                data.destination,
                data.start_date,
                data.end_date,
                data.travelers,
                json.dumps(data.interests),
                json.dumps([item.model_dump() for item in data.itinerary]),
                now,
                plan_id,
            ),
        )
        conn.commit()
        return PlanModel.get_by_id(conn, plan_id)

    @staticmethod
    def delete(conn: sqlite3.Connection, plan_id: str) -> bool:
        """Delete a plan by ID."""
        cursor = conn.cursor()
        cursor.execute("DELETE FROM plans WHERE id = ?", (plan_id,))
        conn.commit()
        return cursor.rowcount > 0

    @staticmethod
    def _row_to_plan(row: sqlite3.Row) -> TravelPlan:
        """Convert a database row to a TravelPlan object."""
        interests = json.loads(row["interests"])
        itinerary_data = json.loads(row["itinerary"])
        itinerary = [ItineraryItem(**item) for item in itinerary_data]

        return TravelPlan(
            id=row["id"],
            title=row["title"],
            destination=row["destination"],
            start_date=row["start_date"],
            end_date=row["end_date"],
            travelers=row["travelers"],
            interests=interests,
            itinerary=itinerary,
            created_at=row["created_at"],
        )
