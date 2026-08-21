import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routers.items import router as items_router

app = FastAPI(title="Inventory Management API", version="0.1.0")

# CORS policy - get allowed origins from environment variable
# Supports comma-separated list of origins (e.g., "http://localhost:5173,http://frontend:80")
ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    # create_all is idempotent — safe to call every time
    Base.metadata.create_all(bind=engine)


@app.get("/api/v1/health")
def health_check():
    return {"status": "ok"}


app.include_router(items_router, prefix="/api/v1/items", tags=["items"])
