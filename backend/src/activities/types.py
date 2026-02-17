from typing import TypedDict, Optional, List

class ToolCall(TypedDict):
    name: str
    args: dict
    id: str
    high_value: bool

class AgentState:
    def __init__(self, messages: list = None):
        self.messages = messages or []

class ApprovalSignal(TypedDict):
    decision: str
    notes: Optional[str]