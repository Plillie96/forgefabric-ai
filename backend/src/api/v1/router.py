from fastapi import APIRouter
from .endpoints import agents, health
from .endpoints.observability import router as observability_router

api_router = APIRouter()
api_router.include_router(agents.router, prefix="/agents", tags=["agents"])
api_router.include_router(health.router, tags=["health"])
api_router.include_router(observability_router)

try:
    from src.mcp.server import router as mcp_router
    api_router.include_router(mcp_router)
except ImportError:
    pass
