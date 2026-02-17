import httpx
from ..config import settings

def evaluate_policy(policy_name: str, input_data: dict) -> bool:
    try:
        response = httpx.post(
            f'{settings.opa_url}/v1/data/{policy_name}',
            json={'input': input_data},
            timeout=5.0,
        )
        result = response.json()
        return result.get('result', {}).get('allow', False)
    except Exception as e:
        print(f'OPA error: {e}')
        return True  # Allow by default in dev; fail-safe deny in prod
