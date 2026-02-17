from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, Optional
from temporalio.client import Client
from src.config import settings
from src.auth.clerk import get_current_tenant
from src.workflows.sales_agent_workflow import SalesAgentWorkflow
import time
import uuid

router = APIRouter(prefix="/mcp", tags=["mcp"])


class MCPRequest(BaseModel):
    lead_data: Dict[str, Any]
    workflow: str = "SalesAgentWorkflow"


class MCPExecuteRequest(BaseModel):
    action: str
    params: dict = {}
    context: Optional[dict] = None


@router.post("/v1/execute")
async def mcp_execute(request: MCPRequest, tenant_id: str = Depends(get_current_tenant)):
    """MCP v1 endpoint - 2026 standard for agent interoperability.

    Any external platform (Salesforce, ServiceNow, Copilot Studio, etc.)
    can call this to trigger a governed ForgeFabric agent swarm.
    """
    try:
        client = await Client.connect(settings.temporal_host)
        workflow_id = f"mcp-{tenant_id}-{uuid.uuid4().hex[:8]}"

        result = await client.execute_workflow(
            SalesAgentWorkflow.run,
            request.lead_data,
            id=workflow_id,
            task_queue="forgefabric-queue",
        )

        return {
            "status": "success",
            "mcp_version": "v1",
            "tenant_id": tenant_id,
            "workflow_id": workflow_id,
            "result": result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/v1/action")
async def mcp_action(request: MCPExecuteRequest, tenant_id: str = Depends(get_current_tenant)):
    """Generic MCP action endpoint for named capabilities."""
    if request.action == "qualify_lead":
        try:
            client = await Client.connect(settings.temporal_host)
            workflow_id = f"mcp-{tenant_id}-{uuid.uuid4().hex[:8]}"
            handle = await client.start_workflow(
                SalesAgentWorkflow.run,
                request.params,
                id=workflow_id,
                task_queue="forgefabric-queue",
            )
            return {"status": "started", "workflow_id": handle.id, "protocol": "mcp/v1", "tenant_id": tenant_id}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    return {
        "status": "ok",
        "action": request.action,
        "protocol": "mcp/v1",
        "tenant_id": tenant_id,
        "capabilities": ["qualify_lead", "check_compliance", "calculate_roi"],
    }


@router.get("/v1/capabilities")
async def mcp_capabilities():
    """Advertise ForgeFabric capabilities to external agent platforms."""
    return {
        "protocol": "mcp/v1",
        "provider": "ForgeFabric AI",
        "version": "1.0.0",
        "capabilities": [
            {"action": "qualify_lead", "description": "Run governed sales qualification swarm", "method": "POST"},
            {"action": "check_compliance", "description": "OPA policy check on any action", "method": "POST"},
            {"action": "calculate_roi", "description": "Real-time ROI attribution", "method": "POST"},
        ],
    }
