export interface LeadInput {
  company: string;
  contact: string;
  budget_estimate: number;
  company_size: number;
}

export interface SwarmResult {
  status: string;
  workflow_id?: string;
  final_output?: string;
  roi?: number;
  pending_approval?: boolean;
}

export interface ApprovalInput {
  workflow_id: string;
  decision: "approved" | "rejected";
  notes?: string;
}