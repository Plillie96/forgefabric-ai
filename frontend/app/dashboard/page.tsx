"use client";
import { useState } from "react";
import { AgentGraph } from "../../components/AgentGraph";
import { GovernancePanel } from "../../components/GovernancePanel";
import { RoiDashboard } from "../../components/RoiDashboard";

export default function Dashboard() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [pendingWorkflow, setPendingWorkflow] = useState<string | null>(null);
  const [leadData, setLeadData] = useState({
    company: "Nova Dynamics",
    contact: "Alex Rivera",
    budget_estimate: 150000,
    company_size: 450,
  });

  const triggerSwarm = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agents/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });
      const data = await res.json();
      setResult(data);
      if (data.status === "started") setPendingWorkflow(data.workflow_id);
    } catch {
      setResult({ error: "Failed to trigger swarm" });
    } finally {
      setLoading(false);
    }
  };

  const approve = async (decision: "approved" | "rejected") => {
    if (!pendingWorkflow) return;
    await fetch("/api/agents/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workflow_id: pendingWorkflow, decision }),
    });
    setPendingWorkflow(null);
    setResult({ status: "resumed", decision });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">ForgeFabric Dashboard</h1>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            System Online
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
            <h2 className="text-xl font-semibold mb-4">Trigger Deal Swarm</h2>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Company"
                value={leadData.company}
                onChange={(e) => setLeadData({ ...leadData, company: e.target.value })}
                className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg"
              />
              <input
                type="text"
                placeholder="Contact"
                value={leadData.contact}
                onChange={(e) => setLeadData({ ...leadData, contact: e.target.value })}
                className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg"
              />
              <input
                type="number"
                placeholder="Budget"
                value={leadData.budget_estimate}
                onChange={(e) => setLeadData({ ...leadData, budget_estimate: Number(e.target.value) })}
                className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg"
              />
              <input
                type="number"
                placeholder="Company Size"
                value={leadData.company_size}
                onChange={(e) => setLeadData({ ...leadData, company_size: Number(e.target.value) })}
                className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg"
              />
            </div>
            <button
              onClick={triggerSwarm}
              disabled={loading}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold disabled:opacity-50 transition-all"
            >
              {loading ? "Launching Swarm..." : "Launch Deal Swarm"}
            </button>
          </div>

          <RoiDashboard data={result?.roi || 0} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <AgentGraph />
          </div>
          <GovernancePanel />
        </div>

        {result && (
          <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 mb-6">
            <h2 className="text-xl font-semibold mb-4">Swarm Result</h2>
            <pre className="whitespace-pre-wrap text-sm text-zinc-300 overflow-auto max-h-64">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {pendingWorkflow && (
          <div className="flex gap-4 mb-8">
            <button onClick={() => approve("approved")} className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl font-semibold transition-all">
              Approve & Proceed
            </button>
            <button onClick={() => approve("rejected")} className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-xl font-semibold transition-all">
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
