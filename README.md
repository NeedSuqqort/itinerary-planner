# Smart Itinerary Planner

A travel planning app that generates itinerary plans with OpenAI, stores saved trips in SQLite, and provides a React + Chakra UI frontend for review, editing, and export.

## Project Overview

Smart Itinerary Planner helps users:
- enter trip preferences and dates
- generate a day-by-day itinerary using OpenAI
- save plans locally or to the backend database
- preview, edit, and export itineraries

## Tech Stack

- Frontend: React 18, TypeScript, Vite, Chakra UI, Tailwind CSS
- Backend: FastAPI, Python, SQLite, OpenAI
- Testing: Jest for frontend, PyTest for backend

## Setup

### Backend

1. Create and activate a Python virtual environment.
2. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. Create a `.env` file in `backend/` and add the following values:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_MODEL=gpt-4o-mini
   OPENAI_API_BASE=https://api.openai.com/v1
   API_URL=http://localhost:8000
   DATABASE_URL=sqlite:///./itinerary_planner.db
   DEBUG=True
   CORS_ORIGINS=http://localhost:4173,http://localhost:3000
   ```

### Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Create a `.env` file in `frontend/` and add:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

## Running Locally

### Start the backend

```bash
cd backend
python -m uvicorn app.main:app --reload
```

### Start the frontend

```bash
cd frontend
npm run dev
```

Open the UI at `http://localhost:5173` and the backend docs at `http://localhost:8000/docs`.

## Features

- Generate travel itineraries with OpenAI
- Save plans to SQLite
- Browse and preview saved plans
- Edit itinerary activities and days
- Export plan details
- LocalStorage fallback when backend is unavailable

## Environment Variables

### Backend
- `OPENAI_API_KEY` — OpenAI API key
- `OPENAI_MODEL` — model name
- `OPENAI_API_BASE` — optional custom OpenAI endpoint
- `API_URL` — backend base URL
- `DATABASE_URL` — SQLite connection URI
- `DEBUG` — enable debug mode
- `CORS_ORIGINS` — allowed frontend origins

### Frontend
- `VITE_API_URL` — backend base URL used by the frontend

## Testing

### Frontend

```bash
cd frontend
npm test
```

### Backend

```bash
cd backend
pytest tests/ -v
```

## Notes

- The frontend uses Chakra UI and Tailwind-inspired styling with React hooks.
- The backend uses FastAPI with a SQLite DB and an OpenAI integration service.
- The app supports editing saved plans and saving updates back to the database.

## Conventions

- Avoid using `any`; prefer `unknown` and proper type narrowing.
- Keep user feedback and error handling clear.
- Do not hardcode `model` or `api_url`; use environment variables instead.
