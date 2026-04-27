from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import DEBUG, CORS_ORIGINS
from app.db.database import init_db
from app.api.routes import itineraries, plans_generation, exports

# Initialize database
init_db()

# Create FastAPI app
app = FastAPI(
    title="Smart Itinerary Planner API",
    description="API for generating and managing travel itineraries",
    version="1.0.0",
    debug=DEBUG,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(itineraries.router)
app.include_router(plans_generation.router)
app.include_router(exports.router)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "itinerary-planner"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=DEBUG)
