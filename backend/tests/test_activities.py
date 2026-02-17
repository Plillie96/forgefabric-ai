import pytest
from src.activities.types import AgentState, ToolCall


def test_agent_state_init():
    state = AgentState()
    assert state.messages == []


def test_agent_state_with_messages():
    msgs = [{"role": "user", "content": "hello"}]
    state = AgentState(messages=msgs)
    assert len(state.messages) == 1
    assert state.messages[0]["role"] == "user"


def test_tool_call_structure():
    tc: ToolCall = {"name": "search_company_info", "args": {"company_name": "Acme"}, "id": "tc-1", "high_value": False}
    assert tc["name"] == "search_company_info"
    assert tc["high_value"] is False


def test_roi_calculation():
    from src.services.roi_calculator import calculate_roi

    result = calculate_roi(
        actions=[{"time_saved": 2}, {"time_saved": 3}],
        deal_value=100000,
    )
    assert result.total > 0
    assert "time_saved_value" in result.breakdown
    assert "revenue_influence" in result.breakdown


def test_roi_low_deal_value():
    from src.services.roi_calculator import calculate_roi

    result = calculate_roi(actions=[{"time_saved": 1}], deal_value=10000)
    assert result.breakdown["revenue_influence"] == 0

