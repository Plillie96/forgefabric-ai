"use client";
import { useState } from "react";

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
      const res = await fetch("/api/run-deal", {
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
    await fetch("/api/run-deal", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workflow_id: pendingWorkflow, decision }),
    });
    setPendingWorkflow(null);
    setResult({ status: "resumed", decision });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">ForgeFabric Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-xl font-semibold mb-4">Trigger Deal Swarm</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Company"
              value={leadData.company}
              onChange={(e) => setLeadData({ ...leadData, company: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
            />
            <input
              type="text"
              placeholder="Contact"
              value={leadData.contact}
              onChange={(e) => setLeadData({ ...leadData, contact: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
            />
            <input
              type="number"
              placeholder="Budget Estimate"
              value={leadData.budget_estimate}
              onChange={(e) => setLeadData({ ...leadData, budget_estimate: Number(e.target.value) })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
            />
            <input
              type="number"
              placeholder="Company Size"
              value={leadData.company_size}
              onChange={(e) => setLeadData({ ...leadData, company_size: Number(e.target.value) })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
            />
            <button
              onClick={triggerSwarm}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {loading ? "Launching Swarm..." : "Launch Deal Swarm"}
            </button>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-xl font-semibold mb-4">ROI Dashboard</h2>
          <div className="text-4xl font-bold text-green-400">
            ${result?.roi?.toLocaleString() || "0"}
          </div>
          <p className="text-gray-400 mt-2">Estimated Value Created</p>
        </div>
      </div>

      {result && (
        <div className="mt-8 p-6 bg-gray-900 rounded-2xl border border-gray-800">
          <h2 className="text-xl font-semibold mb-4">Swarm Result</h2>
          <pre className="whitespace-pre-wrap text-sm text-gray-300 overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {pendingWorkflow && (
        <div className="mt-6 flex gap-4">
          <button onClick={() => approve("approved")} className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl font-semibold">
            Approve & Proceed
          </button>
          <button onClick={() => approve("rejected")} className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-xl font-semibold">
            Reject
          </button>
        </div>
      )}
    </div>
  );
}