from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import time
from src.config import settings
from src.core.logging import setup_logging
from src.api.v1.router import api_router
from src.core.exceptions import AgentError, SwarmError, GovernanceError

logger = logging.getLogger("forgefabric")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting ForgeFabric AI backend", extra={"version": "1.0.0"})
    yield
    logger.info("Shutting down ForgeFabric AI backend")


app = FastAPI(
    title="ForgeFabric AI",
    description="Enterprise Agent Runtime + Governance Fabric",
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


# --- Global exception handlers ---


@app.exception_handler(GovernanceError)
async def governance_error_handler(request: Request, exc: GovernanceError):
    logger.warning("Governance violation: %s", exc, extra={"path": request.url.path})
    return JSONResponse(status_code=403, content={"error": "governance_violation", "detail": str(exc)})


@app.exception_handler(AgentError)
async def agent_error_handler(request: Request, exc: AgentError):
    logger.error("Agent error: %s", exc, extra={"path": request.url.path})
    return JSONResponse(status_code=500, content={"error": "agent_error", "detail": str(exc)})


@app.exception_handler(SwarmError)
async def swarm_error_handler(request: Request, exc: SwarmError):
    logger.error("Swarm error: %s", exc, extra={"path": request.url.path})
    return JSONResponse(status_code=500, content={"error": "swarm_error", "detail": str(exc)})


@app.exception_handler(Exception)
async def unhandled_error_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s", request.url.path)
    return JSONResponse(status_code=500, content={"error": "internal_error", "detail": "An unexpected error occurred"})


# --- Request logging middleware ---


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    elapsed_ms = round((time.perf_counter() - start) * 1000, 1)
    logger.info(
        "%s %s -> %s (%.1fms)",
        request.method,
        request.url.path,
        response.status_code,
        elapsed_ms,
    )
    response.headers["X-Request-Time-Ms"] = str(elapsed_ms)
    return response


# --- Routes ---

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"service": "ForgeFabric AI", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/ready")
async def readiness_check():
    checks = {}
    try:
        import httpx
        async with httpx.AsyncClient(timeout=2.0) as client:
            r = await client.get(f"{settings.opa_url}/health")
            checks["opa"] = r.status_code == 200
    except Exception:
        checks["opa"] = False
    try:
        from temporalio.client import Client
        c = await Client.connect(settings.temporal_host)
        checks["temporal"] = True
    except Exception:
        checks["temporal"] = False
    all_ok = all(checks.values())
    return JSONResponse(
        status_code=200 if all_ok else 503,
        content={"ready": all_ok, "checks": checks},
    )
