from temporalio import activity
from src.activities.types import AgentState, ToolCall
from langchain_openai import ChatOpenAI
from opa_client.opa import OpaClient
import os

llm = ChatOpenAI(model="gpt-4o-mini")

opa = OpaClient("http://localhost:8181")

@activity.defn
async def llm_reason_activity(state: AgentState) -> dict:
    prompt = "You are a sales qualification agent. Reason step-by-step...\n" + str(state.messages)
    response = await llm.ainvoke(prompt)
    return {
        "messages": [{"role": "assistant", "content": response.content}],
        "tool_calls": response.tool_calls if hasattr(response, "tool_calls") else [],
        "final_answer": response.content if "[FINAL]" in response.content else None
    }

@activity.defn
async def check_opa_activity(tool_call: ToolCall) -> dict:
    decision = opa.check_policy_rule(tool_call, "forgefabric.allow_tool_call")
    return {"allow": decision.get("result", {}).get("allow", False), "reason": decision.get("result", {}).get("reason")}

@activity.defn
async def execute_tool_activity(tool_call: ToolCall) -> dict:
    if tool_call["name"] == "search_company_info":
        return {"role": "tool", "content": f"Found info for {tool_call['args']['company_name']}"}
    return {"role": "tool", "content": "Tool executed"}

@activity.defn
async def calculate_roi_activity(input_data: dict) -> float:
    budget = input_data["lead_data"].get("budget_estimate", 0)
    if "Strong fit" in str(input_data["state"].messages[-1]):
        return round(budget * 0.12 + 45000, 2)
    return 0.0