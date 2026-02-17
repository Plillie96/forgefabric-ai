from src.governance.engine import evaluate_policy


def test_evaluate_policy_returns_bool():
    # Without OPA running, should return True (dev mode fallback)
    result = evaluate_policy("forgefabric/allow_tool_call", {"tool_name": "search_company_info"})
    assert isinstance(result, bool)


def test_evaluate_policy_dev_fallback():
    # OPA not running - should allow in dev mode
    result = evaluate_policy("forgefabric/allow_tool_call", {"tool_name": "unknown_tool"})
    assert result is True

