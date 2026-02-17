import pytest
from httpx import AsyncClient, ASGITransport
from src.main import app


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.mark.anyio
async def test_root(client: AsyncClient):
    resp = await client.get("/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["service"] == "ForgeFabric AI"
    assert "version" in data


@pytest.mark.anyio
async def test_health(client: AsyncClient):
    resp = await client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "healthy"


@pytest.mark.anyio
async def test_readiness_returns_status(client: AsyncClient):
    resp = await client.get("/ready")
    data = resp.json()
    assert "ready" in data
    assert "checks" in data


@pytest.mark.anyio
async def test_run_agent_requires_body(client: AsyncClient):
    resp = await client.post("/api/v1/agents/run", json={})
    assert resp.status_code == 422


@pytest.mark.anyio
async def test_run_agent_valid_payload(client: AsyncClient):
    resp = await client.post(
        "/api/v1/agents/run",
        json={
            "company": "TestCorp",
            "contact": "Jane Doe",
            "budget_estimate": 100000,
            "company_size": 300,
        },
    )
    assert resp.status_code in (200, 500)
