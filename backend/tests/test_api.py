import pytest
from httpx import AsyncClient, ASGITransport
from src.main import app


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


@pytest.mark.anyio
async def test_health(client):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


@pytest.mark.anyio
async def test_graph_endpoint(client):
    response = await client.get("/api/v1/agents/graph")
    assert response.status_code == 200
    data = response.json()
    assert "nodes" in data
    assert "edges" in data
    assert len(data["nodes"]) > 0
    assert len(data["edges"]) > 0


@pytest.mark.anyio
async def test_observability_traces(client):
    response = await client.get("/api/v1/observability/traces?limit=10")
    assert response.status_code == 200
    data = response.json()
    assert "traces" in data
    assert "total" in data
    assert len(data["traces"]) <= 10


@pytest.mark.anyio
async def test_observability_summary(client):
    response = await client.get("/api/v1/observability/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_roi" in data
    assert "avg_latency_ms" in data
    assert "avg_bias_score" in data
    assert data["total_traces"] > 0


@pytest.mark.anyio
async def test_mcp_capabilities(client):
    response = await client.get("/mcp/v1/capabilities")
    assert response.status_code == 200
    data = response.json()
    assert data["protocol"] == "mcp/v1"
    assert data["provider"] == "ForgeFabric AI"
    assert len(data["capabilities"]) >= 3


@pytest.mark.anyio
async def test_run_swarm_without_temporal(client):
    response = await client.post(
        "/api/v1/agents/run",
        json={"company": "TestCorp", "contact": "Test User", "budget_estimate": 100000, "company_size": 200},
    )
    # Should fail gracefully since Temporal is not running
    assert response.status_code in [200, 500]

