from fastapi import APIRouter, Depends, HTTPException, status
import sqlite3
from uuid import uuid4
from app.api.dependencies import get_database
from app.models.schemas import TravelPlan
from app.models.db import PlanModel

router = APIRouter(prefix="/plans", tags=["plans"])


@router.get("", response_model=list[TravelPlan])
async def list_plans(db: sqlite3.Connection = Depends(get_database)):
    """Retrieve all saved travel plans."""
    try:
        plans = PlanModel.get_all(db)
        return plans
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve plans: {str(e)}",
        )


@router.get("/{plan_id}", response_model=TravelPlan)
async def get_plan(plan_id: str, db: sqlite3.Connection = Depends(get_database)):
    """Retrieve a specific travel plan by ID."""
    try:
        plan = PlanModel.get_by_id(db, plan_id)
        if not plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Plan with ID {plan_id} not found",
            )
        return plan
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve plan: {str(e)}",
        )


@router.post("", response_model=TravelPlan)
async def create_plan(plan: TravelPlan, db: sqlite3.Connection = Depends(get_database)):
    """Save a travel plan."""
    try:
        created = PlanModel.create(db, plan.id, plan.title, plan.model_dump())
        return created
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save plan: {str(e)}",
        )


@router.put("/{plan_id}", response_model=TravelPlan)
async def update_plan(
    plan_id: str,
    plan_update: dict,
    db: sqlite3.Connection = Depends(get_database),
):
    """Update an existing travel plan."""
    try:
        existing = PlanModel.get_by_id(db, plan_id)
        if not existing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Plan with ID {plan_id} not found",
            )
        from app.models.schemas import UpdatePlanPayload
        update_payload = UpdatePlanPayload(**plan_update)
        updated = PlanModel.update(db, plan_id, update_payload)
        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update plan: {str(e)}",
        )


@router.delete("/{plan_id}")
async def delete_plan(plan_id: str, db: sqlite3.Connection = Depends(get_database)):
    """Delete a travel plan."""
    try:
        deleted = PlanModel.delete(db, plan_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Plan with ID {plan_id} not found",
            )
        return {"message": "Plan deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete plan: {str(e)}",
        )
