import json
from typing import BinaryIO
from app.models.schemas import TravelPlan


class ExportService:
    @staticmethod
    def export_json(plan: TravelPlan) -> str:
        """Export a travel plan as JSON string."""
        return json.dumps(
            {
                "id": plan.id,
                "title": plan.title,
                "destination": plan.destination,
                "startDate": plan.start_date,
                "endDate": plan.end_date,
                "travelers": plan.travelers,
                "interests": plan.interests,
                "itinerary": [
                    {
                        "day": item.day,
                        "activities": item.activities,
                        "notes": item.notes,
                    }
                    for item in plan.itinerary
                ],
                "createdAt": plan.created_at,
            },
            indent=2,
        )

    @staticmethod
    def export_csv(plan: TravelPlan) -> str:
        """Export a travel plan as CSV."""
        lines = [
            f"Trip: {plan.title}",
            f"Destination: {plan.destination}",
            f"Dates: {plan.start_date} to {plan.end_date}",
            f"Travelers: {plan.travelers}",
            f"Interests: {', '.join(plan.interests)}",
            "",
            "Day,Activities,Notes",
        ]

        for item in plan.itinerary:
            activities = "; ".join(item.activities)
            notes = item.notes or ""
            lines.append(f'{item.day},"{activities}","{notes}"')

        return "\n".join(lines)

    @staticmethod
    def export_markdown(plan: TravelPlan) -> str:
        """Export a travel plan as Markdown."""
        md = f"""# {plan.title}

**Destination:** {plan.destination}  
**Dates:** {plan.start_date} to {plan.end_date}  
**Travelers:** {plan.travelers}  
**Interests:** {', '.join(plan.interests)}

---

## Itinerary

"""
        for item in plan.itinerary:
            md += f"### Day {item.day}\n\n"
            for activity in item.activities:
                md += f"- {activity}\n"
            if item.notes:
                md += f"\n*{item.notes}*\n"
            md += "\n"

        return md
