import pytest
from src.governance.engine import evaluate_policy


def test_evaluate_policy_returns_bool():
    result = evaluate_policy("forgefabric.allow_tool_call", {"tool_name": "search_company_info", "args": {}})
    assert isinstance(result, bool)


def test_evaluate_policy_opa_unavailable_allows_in_dev():
    result = evaluate_policy("nonexistent.policy", {"tool_name": "test"})
    assert result is True


def test_roi_calculator():
    from src.services.roi_calculator import calculate_roi
    result = calculate_roi([{"time_saved": 4}], 100000)
    assert result.total > 0
    assert "time_saved_value" in result.breakdown


def test_roi_calculator_low_deal():
    from src.services.roi_calculator import calculate_roi
    result = calculate_roi([], 10000)
    assert result.total == 0
