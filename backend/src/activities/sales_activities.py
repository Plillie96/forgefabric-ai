from temporalio import activity
from src.activities.types import AgentState, ToolCall
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
import httpx
import os

llm = ChatOpenAI(model="gpt-4o-mini", api_key=os.getenv("OPENAI_API_KEY") or None)

OPA_URL = os.getenv("OPA_URL", "http://localhost:8181")

@activity.defn
async def llm_reason_activity(state: AgentState) -> dict:
    prompt = "You are a sales qualification agent. Reason step-by-step...\n" + str(state.messages)
    response = await llm.ainvoke(prompt)
    return {
        "messages": [{"role": "assistant", "content": response.content}],
        "tool_calls": response.tool_calls if hasattr(response, "tool_calls") and response.tool_calls else [],
        "final_answer": response.content if "[FINAL]" in response.content else None
    }

@activity.defn
async def check_opa_activity(tool_call: ToolCall) -> dict:
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.post(
                f"{OPA_URL}/v1/data/forgefabric/allow_tool_call",
                json={"input": tool_call}
            )
            result = resp.json()
            return {"allow": result.get("result", {}).get("allow", False), "reason": result.get("result", {}).get("reason", "")}
    except Exception:
        return {"allow": True, "reason": "OPA unavailable - allowing in dev mode"}

@activity.defn
async def execute_tool_activity(tool_call: ToolCall) -> dict:
    name = tool_call.get("name", "")
    args = tool_call.get("args", {})
    if name == "search_company_info":
        company = args.get("company_name", "Unknown")
        return {"role": "tool", "content": f"{company} is a growing SaaS company with ~500 employees. Recent Series B."}
    elif name == "get_contact_details":
        return {"role": "tool", "content": f"Found VP Operations: contact@example.com. LinkedIn active."}
    elif name == "assess_deal_fit":
        size = args.get("company_size", 0)
        budget = args.get("budget_estimate", 0)
        if size > 200 and budget > 50000:
            return {"role": "tool", "content": "Strong fit - high priority. Proceed to proposal."}
        elif size > 50:
            return {"role": "tool", "content": "Medium fit - nurture with content."}
        return {"role": "tool", "content": "Low fit - disqualify politely."}
    return {"role": "tool", "content": f"Tool {name} executed"}

@activity.defn
async def calculate_roi_activity(input_data: dict) -> float:
    budget = input_data["lead_data"].get("budget_estimate", 0)
    messages = input_data.get("state", {})
    if isinstance(messages, AgentState):
        msgs_str = str(messages.messages)
    else:
        msgs_str = str(messages.get("messages", []))
    if "Strong fit" in msgs_str:
        return round(budget * 0.12 + 45000, 2)
    return 0.0