from src.schemas.agent import RoiMetrics


def calculate_roi(actions: list, deal_value: float) -> RoiMetrics:
    time_saved = sum(a.get("time_saved", 0) for a in actions)
    cost_saved = time_saved * 150
    revenue_influence = deal_value * 0.12 if deal_value > 50000 else 0
    return RoiMetrics(
        total=cost_saved + revenue_influence,
        breakdown={"time_saved_value": cost_saved, "revenue_influence": revenue_influence},
    )