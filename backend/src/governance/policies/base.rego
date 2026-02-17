package forgefabric

default allow = false

allow {
    input.tool == "search_company_info"
}

allow {
    input.tool == "get_contact_details"
}

allow {
    input.tool == "assess_deal_fit"
}

allow {
    input.tool == "check_budget_fit"
}