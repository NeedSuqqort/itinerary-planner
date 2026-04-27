from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict


def to_camel(string: str) -> str:
    parts = string.split("_")
    return parts[0] + "".join(word.capitalize() for word in parts[1:])


class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )


class TravelInputPayload(CamelModel):
    destination: str = Field(..., min_length=2)
    start_date: str = Field(..., description="ISO format date string")
    end_date: str = Field(..., description="ISO format date string")
    travelers: int = Field(..., ge=1, le=20)
    interests: List[str] = Field(..., min_items=1)


class ItineraryItem(CamelModel):
    day: int
    activities: List[str]
    notes: Optional[str] = None


class TravelPlan(CamelModel):
    id: str
    title: str
    destination: str
    start_date: str
    end_date: str
    travelers: int
    interests: List[str]
    itinerary: List[ItineraryItem]
    created_at: str


class UpdatePlanPayload(CamelModel):
    title: str
    destination: str
    start_date: str
    end_date: str
    travelers: int
    interests: List[str]
    itinerary: List[ItineraryItem]


class ErrorResponse(CamelModel):
    detail: str
    status_code: int
