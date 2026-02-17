import pytest
from src.activities.sales_activities import execute_tool_activity


@pytest.mark.anyio
async def test_search_company_info():
    result = await execute_tool_activity({"name": "search_company_info", "args": {"company_name": "Acme"}, "id": "1", "high_value": False})
    assert result["role"] == "tool"
    assert "Acme" in result["content"]


@pytest.mark.anyio
async def test_get_contact_details():
    result = await execute_tool_activity({"name": "get_contact_details", "args": {"company_name": "Acme"}, "id": "2", "high_value": False})
    assert "VP Operations" in result["content"] or "contact" in result["content"]


@pytest.mark.anyio
async def test_assess_deal_strong_fit():
    result = await execute_tool_activity({"name": "assess_deal_fit", "args": {"company_size": 500, "budget_estimate": 100000}, "id": "3", "high_value": False})
    assert "Strong fit" in result["content"]


@pytest.mark.anyio
async def test_assess_deal_medium_fit():
    result = await execute_tool_activity({"name": "assess_deal_fit", "args": {"company_size": 100, "budget_estimate": 30000}, "id": "4", "high_value": False})
    assert "Medium fit" in result["content"]


@pytest.mark.anyio
async def test_assess_deal_low_fit():
    result = await execute_tool_activity({"name": "assess_deal_fit", "args": {"company_size": 10, "budget_estimate": 5000}, "id": "5", "high_value": False})
    assert "Low fit" in result["content"]


@pytest.mark.anyio
async def test_unknown_tool():
    result = await execute_tool_activity({"name": "nonexistent", "args": {}, "id": "6", "high_value": False})
    assert result["role"] == "tool"
    assert "nonexistent" in result["content"]


@pytest.mark.anyio
async def test_calculate_roi_strong_fit():
    from src.activities.sales_activities import calculate_roi_activity
    roi = await calculate_roi_activity({"lead_data": {"budget_estimate": 100000}, "state": {"messages": [{"role": "tool", "content": "Strong fit"}]}})
    assert roi > 0


@pytest.mark.anyio
async def test_calculate_roi_no_fit():
    from src.activities.sales_activities import calculate_roi_activity
    roi = await calculate_roi_activity({"lead_data": {"budget_estimate": 100000}, "state": {"messages": [{"role": "tool", "content": "No match"}]}})
    assert roi == 0.0
