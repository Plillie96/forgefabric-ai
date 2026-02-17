from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from temporalio.client import Client
from src.config import settings
from src.workflows.sales_agent_workflow import SalesAgentWorkflow
import uuid

router = APIRouter(prefix="/mcp/v1", tags=["mcp"])


class McpExecuteRequest(BaseModel):
    action: str
    params: dict = {}
    context: Optional[dict] = None


@router.post("/execute")
async def mcp_execute(request: McpExecuteRequest):
    """MCP protocol endpoint for cross-platform agent interoperability."""
    if request.action == "qualify_lead":
        try:
            client = await Client.connect(settings.temporal_host)
            workflow_id = f"mcp-{uuid.uuid4().hex[:8]}"
            handle = await client.start_workflow(
                SalesAgentWorkflow.run,
                request.params,
                id=workflow_id,
                task_queue="forgefabric-queue",
            )
            return {"status": "started", "workflow_id": handle.id, "protocol": "mcp/v1"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    return {
        "status": "ok",
        "action": request.action,
        "protocol": "mcp/v1",
        "capabilities": ["qualify_lead", "check_compliance", "calculate_roi"],
    }


@router.get("/capabilities")
async def mcp_capabilities():
    """Advertise ForgeFabric capabilities to external agent platforms."""
    return {
        "protocol": "mcp/v1",
        "provider": "ForgeFabric AI",
        "capabilities": [
            {"action": "qualify_lead", "description": "Run governed sales qualification swarm"},
            {"action": "check_compliance", "description": "OPA policy check on any action"},
            {"action": "calculate_roi", "description": "Real-time ROI attribution"},
        ],
    }
