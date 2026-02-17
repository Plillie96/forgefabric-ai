const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error(`API Error: ${endpoint}`, error);
    return { error: (error as Error).message };
  }
}

export async function runDealWorkflow(payload: object) {
  return apiRequest("/api/v1/agents/run", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function approveDeal(workflowId: string, decision: string) {
  return apiRequest("/api/v1/agents/approve", {
    method: "POST",
    body: JSON.stringify({ workflow_id: workflowId, decision }),
  });
}