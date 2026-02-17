from typing import Annotated, Sequence, Literal, Dict, Any
import json
import logging
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, ToolMessage
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import Runnable
from ..governance.engine import evaluate_policy
from ..config import settings

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2, api_key=settings.openai_api_key or None)

@tool
def search_company_info(company_name: str) -> str:
    """Search for public information about a company (mocked for demo)."""
    return (f"{company_name} is a growing SaaS company with ~{len(company_name)*12} employees. "
            f"Recent news: Raised Series B in 2025. Tech stack includes Python, AWS, Salesforce.")

@tool
def get_contact_details(company_name: str, role: str = "VP Operations") -> str:
    """Look up contact details for a key decision maker (mocked)."""
    return f"Found {role} at {company_name}: sarah.chen@example.com. LinkedIn active."

@tool
def assess_deal_fit(company_size: int, budget_estimate: float) -> str:
    """Assess if the lead fits our ideal customer profile."""
    if company_size > 200 and budget_estimate > 50000:
        return "Strong fit - high priority. Proceed to proposal."
    elif company_size > 50:
        return "Medium fit - nurture with content."
    else:
        return "Low fit - disqualify politely."

tools_list = [search_company_info, get_contact_details, assess_deal_fit]
llm_with_tools = llm.bind_tools(tools_list)

system_prompt = """You are a high-performing sales qualification agent.
Use ReAct: Observe -> Reason -> Act (tool if needed) -> Observe.
Goal: Fully qualify lead, gather info, assess fit, recommend next steps.
Use tools for external data. Final answer format: [FINAL] Recommendation here."""

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    MessagesPlaceholder(variable_name="messages"),
])

agent_runnable: Runnable = prompt | llm_with_tools

class AgentState(dict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    pending_approval: bool = False
    approval_decision: str = ""

def agent_node(state: AgentState):
    messages = state["messages"]
    response = agent_runnable.invoke({"messages": messages})
    return {"messages": [response]}

governed_tool_node = ToolNode(tools_list)

def router(state: AgentState) -> Literal["tools", "__end__"]:
    if state.get("pending_approval", False):
        return END
    last_message = state["messages"][-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    if isinstance(last_message, AIMessage) and last_message.content:
        return END
    return "tools"

workflow = StateGraph(state_schema=AgentState)
workflow.add_node("agent", agent_node)
workflow.add_node("tools", governed_tool_node)
workflow.set_entry_point("agent")
workflow.add_conditional_edges("agent", router, {"tools": "tools", END: END})
workflow.add_edge("tools", "agent")
checkpointer = MemorySaver()
graph = workflow.compile(checkpointer=checkpointer)

def run_swarm_sync(initial_input: Dict) -> Dict:
    return graph.invoke(initial_input, config={"configurable": {"thread_id": "demo-thread-1"}})