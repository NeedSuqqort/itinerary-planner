import os
from dotenv import load_dotenv

load_dotenv()

# API Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
OPENAI_API_BASE = os.getenv("OPENAI_API_BASE", "")
API_URL = os.getenv("API_URL", "http://localhost:8000")

# Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./itinerary_planner.db")

# Server Configuration
DEBUG = os.getenv("DEBUG", "False").lower() == "true"
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:4173,http://localhost:3000").split(",")
