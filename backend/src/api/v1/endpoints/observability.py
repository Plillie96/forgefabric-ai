from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from src.auth.clerk import get_current_tenant
import random
from datetime import datetime, timezone, timedelta

router = APIRouter(prefix="/observability", tags=["observability"])


class TraceEvent(BaseModel):
    trace_id: str
    timestamp: str
    agent: str
    action: str
    duration_ms: int
    roi_estimate: float
    bias_score: float
    hallucination_score: float
    tenant_id: str


AGENTS = ["SalesQualifier", "ResearchAgent", "ComplianceCheck", "ProposalDrafter", "NegotiationAgent", "ROIEngine"]
ACTIONS = ["assess_deal_fit", "search_company_info", "check_compliance", "draft_proposal", "negotiate_terms", "calculate_roi"]


def _generate_traces(tenant_id, count=25):
    now = datetime.now(timezone.utc)
    traces = []
    for i in range(count):
        idx = i % len(AGENTS)
        traces.append(TraceEvent(
            trace_id="tr-" + str(1000 + i).zfill(4),
            timestamp=(now - timedelta(seconds=i * 12)).isoformat() + "Z",
            agent=AGENTS[idx],
            action=ACTIONS[idx],
            duration_ms=random.randint(180, 3200),
            roi_estimate=round(random.uniform(5000, 85000), 2),
            bias_score=round(random.uniform(0.01, 0.25), 3),
            hallucination_score=round(random.uniform(0.005, 0.08), 3),
            tenant_id=tenant_id,
        ))
    return traces


@router.get("/traces")
async def get_traces(limit: int = 50, tenant_id: str = Depends(get_current_tenant)):
    traces = _generate_traces(tenant_id, count=min(limit, 100))
    return {"traces": [t.model_dump() for t in traces], "total": len(traces)}


@router.get("/summary")
async def get_summary(tenant_id: str = Depends(get_current_tenant)):
    traces = _generate_traces(tenant_id, count=50)
    total_roi = sum(t.roi_estimate for t in traces)
    avg_latency = sum(t.duration_ms for t in traces) / len(traces)
    avg_bias = sum(t.bias_score for t in traces) / len(traces)
    bias_alerts = len([t for t in traces if t.bias_score > 0.3])
    return {
        "total_roi": round(total_roi, 2),
        "avg_latency_ms": round(avg_latency),
        "avg_bias_score": round(avg_bias, 3),
        "bias_alert_count": bias_alerts,
        "total_traces": len(traces),
        "tenant_id": tenant_id,
    }
