import pytest
import sqlite3
import os
import sys
from pathlib import Path

# Set up test database path before importing database modules
test_db_path = "test_itinerary_planner.db"
os.environ["DATABASE_PATH"] = test_db_path

# Now import the modules that depend on DATABASE_PATH
from app.db.database import init_db, get_db
from app.models.db import PlanModel
from app.models.schemas import ItineraryItem


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """Setup test database before running tests."""
    # Clean up any existing test database
    if os.path.exists(test_db_path):
        os.remove(test_db_path)

    # Initialize the test database
    init_db()

    yield

    # Clean up after tests
    if os.path.exists(test_db_path):
        os.remove(test_db_path)


@pytest.fixture
def test_conn():
    """Provide a test database connection."""
    conn = sqlite3.connect(os.environ.get("DATABASE_PATH", "test_itinerary_planner.db"))
    conn.row_factory = sqlite3.Row
    yield conn
    conn.close()


def test_create_plan(test_conn):
    """Test creating a new plan."""
    plan_id = "test-plan-1"
    plan_data = {
        "destination": "Paris",
        "start_date": "2026-05-01",
        "end_date": "2026-05-05",
        "travelers": 2,
        "interests": ["art", "food", "history"],
        "itinerary": [
            {"day": 1, "activities": ["Louvre Museum", "Seine walk"], "notes": "Classic Paris"}
        ],
    }

    plan = PlanModel.create(test_conn, plan_id, "Paris Trip", plan_data)
    assert plan.id == plan_id
    assert plan.destination == "Paris"
    assert plan.travelers == 2


def test_get_plan(test_conn):
    """Test retrieving a plan."""
    plan_id = "test-plan-2"
    plan_data = {
        "destination": "Tokyo",
        "start_date": "2026-06-01",
        "end_date": "2026-06-10",
        "travelers": 1,
        "interests": ["culture", "food"],
        "itinerary": [
            {"day": 1, "activities": ["Arrival", "Rest"], "notes": None}
        ],
    }

    PlanModel.create(test_conn, plan_id, "Tokyo Trip", plan_data)
    plan = PlanModel.get_by_id(test_conn, plan_id)
    
    assert plan is not None
    assert plan.destination == "Tokyo"
    assert plan.travelers == 1


def test_get_all_plans(test_conn):
    """Test retrieving all plans."""
    plan_data_1 = {
        "destination": "Barcelona",
        "start_date": "2026-07-01",
        "end_date": "2026-07-05",
        "travelers": 3,
        "interests": ["beaches", "culture"],
        "itinerary": [{"day": 1, "activities": ["Beach"], "notes": None}],
    }
    plan_data_2 = {
        "destination": "Amsterdam",
        "start_date": "2026-08-01",
        "end_date": "2026-08-05",
        "travelers": 2,
        "interests": ["cycling", "art"],
        "itinerary": [{"day": 1, "activities": ["Canal tour"], "notes": None}],
    }

    PlanModel.create(test_conn, "test-plan-3", "Barcelona", plan_data_1)
    PlanModel.create(test_conn, "test-plan-4", "Amsterdam", plan_data_2)
    
    plans = PlanModel.get_all(test_conn)
    assert len(plans) >= 2


def test_delete_plan(test_conn):
    """Test deleting a plan."""
    plan_id = "test-plan-5"
    plan_data = {
        "destination": "Rome",
        "start_date": "2026-09-01",
        "end_date": "2026-09-05",
        "travelers": 2,
        "interests": ["history"],
        "itinerary": [{"day": 1, "activities": ["Colosseum"], "notes": None}],
    }

    PlanModel.create(test_conn, plan_id, "Rome", plan_data)
    deleted = PlanModel.delete(test_conn, plan_id)
    
    assert deleted is True
    assert PlanModel.get_by_id(test_conn, plan_id) is None
