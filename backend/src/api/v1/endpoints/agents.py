from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from temporalio.client import Client
from src.workflows.sales_agent_workflow import SalesAgentWorkflow
from src.core.security import get_current_user
from src.services.billing import OutcomeBilling, bill_outcome
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


class BillInput(BaseModel):
    workflow_id: str
    outcome_value: float
    customer_email: str = "demo@forgefabric.ai"


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


@router.get("/graph")
async def get_graph_state(thread_id: Optional[str] = None):
    nodes = [
        {"id": "start", "position": {"x": 0, "y": 100}, "data": {"label": "Lead Input", "status": "completed"}},
        {"id": "qualifier", "position": {"x": 200, "y": 0}, "data": {"label": "Lead Qualifier", "status": "completed"}},
        {"id": "researcher", "position": {"x": 200, "y": 200}, "data": {"label": "Research Agent", "status": "completed"}},
        {"id": "opa", "position": {"x": 400, "y": 100}, "data": {"label": "OPA Governance", "status": "running"}},
        {"id": "drafter", "position": {"x": 600, "y": 0}, "data": {"label": "Proposal Drafter", "status": "pending"}},
        {"id": "compliance", "position": {"x": 600, "y": 200}, "data": {"label": "Compliance Check", "status": "pending"}},
        {"id": "closer", "position": {"x": 800, "y": 100}, "data": {"label": "Negotiation Agent", "status": "pending"}},
        {"id": "roi", "position": {"x": 1000, "y": 100}, "data": {"label": "ROI Engine", "status": "pending"}},
    ]
    edges = [
        {"id": "e1", "source": "start", "target": "qualifier", "animated": True},
        {"id": "e2", "source": "start", "target": "researcher", "animated": True},
        {"id": "e3", "source": "qualifier", "target": "opa", "animated": True},
        {"id": "e4", "source": "researcher", "target": "opa", "animated": True},
        {"id": "e5", "source": "opa", "target": "drafter"},
        {"id": "e6", "source": "opa", "target": "compliance"},
        {"id": "e7", "source": "drafter", "target": "closer"},
        {"id": "e8", "source": "compliance", "target": "closer"},
        {"id": "e9", "source": "closer", "target": "roi"},
    ]
    return {"nodes": nodes, "edges": edges}


@router.post("/billing/outcome")
async def bill_outcome_endpoint(bill: BillInput, user=Depends(get_current_user)):
    try:
        result = await bill_outcome(OutcomeBilling(
            thread_id=bill.workflow_id,
            outcome_value_dollars=bill.outcome_value,
            customer_email=bill.customer_email,
        ))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
