from fastapi import APIRouter, Depends, HTTPException, status
import sqlite3
from uuid import uuid4
from datetime import datetime
from app.api.dependencies import get_database
from app.models.schemas import TravelInputPayload, TravelPlan, ItineraryItem
from app.models.db import PlanModel
from app.services.openai_service import OpenAIService

router = APIRouter(prefix="/plans", tags=["generation"])


@router.post("/generate", response_model=TravelPlan)
async def generate_plan(
    payload: TravelInputPayload,
    db: sqlite3.Connection = Depends(get_database),
):
    """Generate a new travel plan based on user input."""
    try:
        service = OpenAIService()
        itinerary = await service.generate_itinerary(
            destination=payload.destination,
            start_date=payload.start_date,
            end_date=payload.end_date,
            travelers=payload.travelers,
            interests=payload.interests,
        )

        plan_id = str(uuid4())
        plan_data = {
            "destination": payload.destination,
            "start_date": payload.start_date,
            "end_date": payload.end_date,
            "travelers": payload.travelers,
            "interests": payload.interests,
            "itinerary": [item.model_dump() for item in itinerary],
        }

        created = PlanModel.create(
            db,
            plan_id,
            f"{payload.destination} adventure",
            plan_data,
        )
        return created

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate plan: {str(e)}",
        )
