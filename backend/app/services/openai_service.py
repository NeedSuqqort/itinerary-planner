import anyio
import openai
from openai import OpenAI
from typing import List
from app.config import OPENAI_API_KEY, OPENAI_API_BASE, OPENAI_MODEL
from app.models.schemas import ItineraryItem

class OpenAIService:
    def __init__(self):
        if OPENAI_API_KEY:
            openai.api_key = OPENAI_API_KEY

        if OPENAI_API_BASE:
            if hasattr(openai, "api_base"):
                openai.api_base = OPENAI_API_BASE
            elif hasattr(openai, "base_url"):
                openai.base_url = OPENAI_API_BASE

        client_kwargs = {}
        if OPENAI_API_KEY:
            client_kwargs["api_key"] = OPENAI_API_KEY

        self.client = OpenAI(**client_kwargs)

        if OPENAI_API_BASE:
            if hasattr(self.client, "api_base"):
                self.client.api_base = OPENAI_API_BASE
            elif hasattr(self.client, "base_url"):
                self.client.base_url = OPENAI_API_BASE

    async def generate_itinerary(
        self,
        destination: str,
        start_date: str,
        end_date: str,
        travelers: int,
        interests: List[str],
    ) -> List[ItineraryItem]:
        """Generate an itinerary using OpenAI API."""
        
        interests_str = ", ".join(interests)
        prompt = f"""
        Create a detailed day-by-day itinerary for a trip to {destination} from {start_date} to {end_date}.
        Group size: {travelers} traveler(s).
        Interests: {interests_str}
        
        Format the response as a JSON array where each object has:
        - day: number (1, 2, 3, etc.)
        - activities: array of activity strings
        - notes: optional string with recommendations
        
        Return ONLY valid JSON array, no additional text.
        """

        try:
            response = await self._call_openai(prompt)
            import json
            try:
                activities = json.loads(response)
            except json.JSONDecodeError:
                start = response.find("[")
                end = response.rfind("]")
                if start != -1 and end != -1 and end > start:
                    try:
                        activities = json.loads(response[start : end + 1])
                    except json.JSONDecodeError:
                        raise ValueError(f"OpenAI returned invalid JSON. raw response: {response!r}")
                else:
                    raise ValueError(f"OpenAI returned invalid JSON. raw response: {response!r}")

            if not isinstance(activities, list):
                raise ValueError(f"OpenAI response JSON must be a list, got {type(activities).__name__}. raw response: {response!r}")

            return [ItineraryItem(**item) for item in activities]
        except Exception as e:
            raise ValueError(f"Failed to generate itinerary: {str(e)}")

    async def _call_openai(self, prompt: str) -> str:
        """Call OpenAI API and return the response."""
        response = await anyio.to_thread.run_sync(
            lambda: self.client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=2000,
            )
        )

        try:
            text = response.choices[0].message.content.strip()
        except Exception as exc:
            raise ValueError(f"OpenAI returned an unexpected response shape: {exc}. response={response!r}")

        if not text:
            raise ValueError("OpenAI returned an empty response.")

        return text
