from fastapi import APIRouter, Depends, HTTPException, status, Response
import sqlite3
from app.api.dependencies import get_database
from app.models.db import PlanModel
from app.services.export_service import ExportService

router = APIRouter(prefix="/plans", tags=["export"])


@router.get("/{plan_id}/export/json")
async def export_json(
    plan_id: str,
    db: sqlite3.Connection = Depends(get_database),
):
    """Export a travel plan as JSON."""
    try:
        plan = PlanModel.get_by_id(db, plan_id)
        if not plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Plan with ID {plan_id} not found",
            )

        json_content = ExportService.export_json(plan)
        return Response(
            content=json_content,
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename={plan_id}.json"},
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to export plan: {str(e)}",
        )


@router.get("/{plan_id}/export/csv")
async def export_csv(
    plan_id: str,
    db: sqlite3.Connection = Depends(get_database),
):
    """Export a travel plan as CSV."""
    try:
        plan = PlanModel.get_by_id(db, plan_id)
        if not plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Plan with ID {plan_id} not found",
            )

        csv_content = ExportService.export_csv(plan)
        return Response(
            content=csv_content,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={plan_id}.csv"},
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to export plan: {str(e)}",
        )


@router.get("/{plan_id}/export/markdown")
async def export_markdown(
    plan_id: str,
    db: sqlite3.Connection = Depends(get_database),
):
    """Export a travel plan as Markdown."""
    try:
        plan = PlanModel.get_by_id(db, plan_id)
        if not plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Plan with ID {plan_id} not found",
            )

        md_content = ExportService.export_markdown(plan)
        return Response(
            content=md_content,
            media_type="text/markdown",
            headers={"Content-Disposition": f"attachment; filename={plan_id}.md"},
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to export plan: {str(e)}",
        )
