import pytest
from app.services.export_service import ExportService
from app.models.schemas import TravelPlan, ItineraryItem


@pytest.fixture
def sample_plan():
    """Provide a sample travel plan for testing."""
    return TravelPlan(
        id="test-plan-export",
        title="European Adventure",
        destination="Europe",
        start_date="2026-05-01",
        end_date="2026-05-15",
        travelers=2,
        interests=["culture", "food", "history"],
        itinerary=[
            ItineraryItem(
                day=1,
                activities=["Arrive in Paris", "Check into hotel"],
                notes="Get some rest after travel"
            ),
            ItineraryItem(
                day=2,
                activities=["Louvre Museum", "Eiffel Tower", "Seine cruise"],
                notes="Classic Paris highlights"
            ),
        ],
        created_at="2026-04-23T10:00:00",
    )


def test_export_json(sample_plan):
    """Test exporting a plan as JSON."""
    json_str = ExportService.export_json(sample_plan)
    assert "European Adventure" in json_str
    assert "Europe" in json_str
    assert json.loads(json_str)  # Should be valid JSON


def test_export_csv(sample_plan):
    """Test exporting a plan as CSV."""
    csv_str = ExportService.export_csv(sample_plan)
    assert "European Adventure" in csv_str
    assert "Day,Activities,Notes" in csv_str
    assert "Louvre Museum" in csv_str


def test_export_markdown(sample_plan):
    """Test exporting a plan as Markdown."""
    md_str = ExportService.export_markdown(sample_plan)
    assert "# European Adventure" in md_str
    assert "## Itinerary" in md_str
    assert "### Day 1" in md_str
    assert "Louvre Museum" in md_str


import json
