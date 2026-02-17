package forgefabric

default allow_tool_call = false

allow_tool_call {
    input.tool_name == "search_company_info"
}

allow_tool_call {
    input.tool_name == "get_contact_details"
    not input.context.high_value
}

allow_tool_call {
    input.tool_name == "assess_deal_fit"
    not input.context.high_value
}

allow_tool_call {
    input.tool_name == "check_budget_fit"
}