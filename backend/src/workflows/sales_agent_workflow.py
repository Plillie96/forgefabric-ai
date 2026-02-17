from temporalio import workflow, activity
from temporalio.exceptions import ApplicationError
from datetime import timedelta
import json
from src.activities.sales_activities import (
    llm_reason_activity,
    execute_tool_activity,
    check_opa_activity,
    calculate_roi_activity,
)
from src.activities.types import AgentState, ToolCall, ApprovalSignal


@workflow.defn(name="SalesAgentWorkflow")
class SalesAgentWorkflow:
    def __init__(self) -> None:
        self.state = AgentState(messages=[])
        self.pending_approval = False
        self.approval_decision = ""

    @workflow.run
    async def run(self, lead_data: dict) -> dict:
        workflow.logger.info(f"Starting sales swarm for: {lead_data['company']}")

        self.state.messages.append({
            "role": "user",
            "content": f"Qualify and close this lead: {json.dumps(lead_data)}"
        })

        max_iterations = 15
        for i in range(max_iterations):
            reasoning_result = await workflow.execute_activity(
                llm_reason_activity,
                self.state,
                start_to_close_timeout=timedelta(seconds=30),
                retry_policy=workflow.RetryPolicy(maximum_attempts=3)
            )

            self.state.messages.extend(reasoning_result["messages"])

            if reasoning_result.get("final_answer"):
                roi = await workflow.execute_activity(
                    calculate_roi_activity,
                    {"state": self.state, "lead_data": lead_data}
                )
                return {"status": "completed", "final_output": reasoning_result["final_answer"], "roi": roi}

            for tool_call in reasoning_result.get("tool_calls", []):
                opa_result = await workflow.execute_activity(
                    check_opa_activity,
                    tool_call,
                    start_to_close_timeout=timedelta(seconds=5)
                )
                if not opa_result["allow"]:
                    self.state.messages.append({
                        "role": "system",
                        "content": f"Policy denied: {opa_result['reason']}"
                    })
                    continue

                if tool_call.get("high_value", False):
                    self.pending_approval = True
                    approval = await workflow.wait_condition(
                        lambda: self.approval_decision != "",
                        timeout=timedelta(hours=24)
                    )
                    if approval == "rejected":
                        return {"status": "rejected", "reason": "Human rejected high-value action"}

                tool_result = await workflow.execute_activity(
                    execute_tool_activity,
                    tool_call,
                    start_to_close_timeout=timedelta(minutes=2),
                    retry_policy=workflow.RetryPolicy(maximum_attempts=5, backoff_coefficient=2.0)
                )
                self.state.messages.append(tool_result)

        return {"status": "max_iterations_reached", "final_output": "Could not complete in time"}

    @workflow.signal
    def approve(self, decision: str):
        self.approval_decision = decision