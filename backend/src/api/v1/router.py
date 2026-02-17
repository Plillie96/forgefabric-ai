from fastapi import APIRouter
from .endpoints import agents, health

api_router = APIRouter()
api_router.include_router(agents.router, prefix="/agents", tags=["agents"])
api_router.include_router(health.router, tags=["health"])

# MCP interoperability endpoint
try:
    from src.mcp.server import router as mcp_router
    api_router.include_router(mcp_router)
except ImportError:
    pass
