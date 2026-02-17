from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from src.config import settings
from src.core.logging import setup_logging
from src.api.v1.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.info("Starting ForgeFabric AI backend...")
    yield
    logging.info("Shutting down ForgeFabric AI backend...")


app = FastAPI(
    title="ForgeFabric AI",
    description="AI-powered sales orchestration with agent swarms, governance, and durable workflows.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_logging()

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"message": "ForgeFabric AI: Enterprise Agent Runtime + Governance Fabric"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}