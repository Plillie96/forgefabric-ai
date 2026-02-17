from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from temporalio.client import Client
from src.workflows.sales_agent_workflow import SalesAgentWorkflow
from src.core.security import get_current_user
from src.config import settings
import uuid


router = APIRouter()


class LeadInput(BaseModel):
    company: str
    contact: str
    budget_estimate: float = 0
    company_size: int = 0


class ApprovalInput(BaseModel):
    workflow_id: str
    decision: str
    notes: Optional[str] = None


@router.post("/run")
async def run_swarm(lead: LeadInput, user=Depends(get_current_user)):
    try:
        client = await Client.connect(settings.temporal_host)
        workflow_id = f"deal-{lead.company}-{uuid.uuid4().hex[:8]}"
        handle = await client.start_workflow(
            SalesAgentWorkflow.run,
            lead.model_dump(),
            id=workflow_id,
            task_queue="forgefabric-queue",
        )
        return {"workflow_id": handle.id, "status": "started"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/approve")
async def approve_decision(approval: ApprovalInput, user=Depends(get_current_user)):
    try:
        client = await Client.connect(settings.temporal_host)
        handle = client.get_workflow_handle(approval.workflow_id)
        await handle.signal(SalesAgentWorkflow.approve, approval.decision)
        return {"status": "signaled", "decision": approval.decision}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status/{workflow_id}")
async def get_status(workflow_id: str, user=Depends(get_current_user)):
    try:
        client = await Client.connect(settings.temporal_host)
        handle = client.get_workflow_handle(workflow_id)
        result = await handle.result()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))