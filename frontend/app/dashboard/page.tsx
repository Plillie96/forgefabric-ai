"use client";
import { useState } from "react";
import Link from "next/link";
import { Play, CheckCircle, Clock, AlertTriangle, Shield, DollarSign, Zap } from "lucide-react";

interface QualifyResult {
  qualification: string;
  fit_score: string;
  reasoning: string;
  recommended_action: string;
  roi_estimate: number;
  governance_checks: Record<string, string>;
  duration_ms: number;
}

export default function ForgeFabricDashboard() {
  const [isLaunching, setIsLaunching] = useState(false);
  const [swarmStatus, setSwarmStatus] = useState<"idle" | "running" | "completed" | "error">("idle");
  const [result, setResult] = useState<QualifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [leadData, setLeadData] = useState({
    company: "Nova Dynamics",
    contact: "Alex Rivera",
    budget_estimate: 150000,
    company_size: 450,
  });

  const handleLaunchSwarm = async () => {
    setIsLaunching(true);
    setSwarmStatus("running");
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/qualify/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Backend unreachable" }));
        throw new Error(err.detail || "Request failed");
      }

      const data: QualifyResult = await res.json();
      setResult(data);
      setSwarmStatus("completed");
    } catch (e: any) {
      setError(e.message);
      setSwarmStatus("error");
    } finally {
      setIsLaunching(false);
    }
  };

  const pipelineAgents = [
    { name: "Lead Qualifier", getStatus: () => swarmStatus === "idle" ? "pending" : "completed" },
    { name: "Research Agent", getStatus: () => swarmStatus === "idle" ? "pending" : swarmStatus === "running" ? "running" : "completed" },
    { name: "OPA Governance", getStatus: () => swarmStatus === "completed" ? "completed" : swarmStatus === "running" ? "running" : "pending" },
    { name: "LLM Reasoning", getStatus: () => swarmStatus === "completed" ? "completed" : swarmStatus === "running" ? "running" : "pending" },
    { name: "ROI Engine", getStatus: () => swarmStatus === "completed" ? "completed" : "pending" },
    { name: "Qualification", getStatus: () => swarmStatus === "completed" ? "completed" : "pending" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold">F</span>
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-tighter">ForgeFabric</h1>
              <p className="text-zinc-500 text-sm">Agent Runtime OS</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">Home</Link>
            <Link href="/observability" className="text-sm text-zinc-400 hover:text-white transition-colors">Observability</Link>
            <div className="flex items-center gap-3 bg-zinc-900 px-5 py-2 rounded-2xl border border-zinc-700">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 font-medium text-sm">Live</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Trigger */}
          <div className="lg:col-span-7 bg-zinc-900/70 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Play className="text-cyan-400" />
              Qualify a Lead
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-zinc-400 block mb-2">Company</label>
                <input type="text" value={leadData.company} onChange={(e) => setLeadData({ ...leadData, company: e.target.value })} className="w-full bg-zinc-950 border border-zinc-700 focus:border-cyan-500 rounded-2xl px-5 py-3.5 text-white focus:outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-2">Contact</label>
                <input type="text" value={leadData.contact} onChange={(e) => setLeadData({ ...leadData, contact: e.target.value })} className="w-full bg-zinc-950 border border-zinc-700 focus:border-cyan-500 rounded-2xl px-5 py-3.5 text-white focus:outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-2">Budget Estimate ($)</label>
                <input type="number" value={leadData.budget_estimate} onChange={(e) => setLeadData({ ...leadData, budget_estimate: Number(e.target.value) })} className="w-full bg-zinc-950 border border-zinc-700 focus:border-cyan-500 rounded-2xl px-5 py-3.5 text-white focus:outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-2">Company Size</label>
                <input type="number" value={leadData.company_size} onChange={(e) => setLeadData({ ...leadData, company_size: Number(e.target.value) })} className="w-full bg-zinc-950 border border-zinc-700 focus:border-cyan-500 rounded-2xl px-5 py-3.5 text-white focus:outline-none transition-all" />
              </div>
            </div>
            <button onClick={handleLaunchSwarm} disabled={isLaunching} className="mt-8 w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 hover:brightness-110 py-5 rounded-2xl font-semibold text-lg tracking-wide shadow-2xl shadow-cyan-500/30 transition-all active:scale-[0.985] disabled:opacity-70">
              {isLaunching ? "Running Agent..." : "Run Qualification Agent"}
            </button>
          </div>

          {/* ROI */}
          <div className="lg:col-span-5 bg-zinc-900/70 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-sm text-zinc-400">Estimated Value Created</h3>
                <div className="text-6xl font-semibold text-emerald-400 mt-3 tracking-tighter">${(result?.roi_estimate || 0).toLocaleString()}</div>
              </div>
              <DollarSign className="w-12 h-12 text-emerald-400/30" />
            </div>
            {result && (
              <div className="mt-auto space-y-3">
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>Response Time</span>
                  <span className="text-cyan-400">{result.duration_ms}ms</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>Fit Score</span>
                  <span className={result.fit_score === "Strong" ? "text-emerald-400" : result.fit_score === "Medium" ? "text-yellow-400" : "text-red-400"}>{result.fit_score}</span>
                </div>
              </div>
            )}
          </div>

          {/* Pipeline */}
          <div className="lg:col-span-12 bg-zinc-900/70 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-8">Agent Pipeline</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
              <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent z-0" />
              {pipelineAgents.map((agent, i) => {
                const status = agent.getStatus();
                return (
                  <div key={i} className="relative z-10 bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 hover:border-zinc-500/50 transition-all">
                    <div className={`w-10 h-10 rounded-2xl mb-4 flex items-center justify-center ${status === "completed" ? "bg-emerald-500/10 text-emerald-400" : status === "running" ? "bg-blue-500/10 text-blue-400 animate-pulse" : "bg-zinc-800 text-zinc-400"}`}>
                      {status === "completed" ? <CheckCircle /> : status === "running" ? <Clock /> : <AlertTriangle />}
                    </div>
                    <h4 className="font-semibold mb-1 text-sm">{agent.name}</h4>
                    <p className={`text-xs uppercase tracking-widest ${status === "completed" ? "text-emerald-400" : status === "running" ? "text-blue-400" : "text-zinc-500"}`}>{status}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* LLM Result */}
          {result && (
            <div className="lg:col-span-12 bg-zinc-900/70 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="text-cyan-400" />
                <h3 className="text-xl font-semibold">Agent Output</h3>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${result.qualification === "Qualified" ? "bg-emerald-500/10 text-emerald-400" : result.qualification === "Nurture" ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"}`}>
                  {result.qualification}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm text-zinc-400 mb-2">Reasoning</h4>
                  <p className="text-zinc-200 leading-relaxed">{result.reasoning}</p>
                  <h4 className="text-sm text-zinc-400 mt-6 mb-2">Recommended Action</h4>
                  <p className="text-cyan-400 font-medium">{result.recommended_action}</p>
                </div>
                <div>
                  <h4 className="text-sm text-zinc-400 mb-3">Governance Checks</h4>
                  <div className="space-y-2">
                    {Object.entries(result.governance_checks).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center text-sm">
                        <span className="text-zinc-400">{key.replace(/_/g, " ")}</span>
                        <span className={value === "passed" || value === "compliant" || value === "approved" || value === "all_scoped" ? "text-emerald-400" : "text-yellow-400"}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="lg:col-span-12 bg-red-950/50 border border-red-800/50 rounded-3xl p-8">
              <h3 className="text-lg font-semibold text-red-400 mb-2">Error</h3>
              <p className="text-red-300">{error}</p>
              <p className="text-sm text-zinc-500 mt-2">Make sure the backend is running: cd backend && uvicorn src.main:app --reload --port 8000</p>
            </div>
          )}

          {/* Governance */}
          <div className="lg:col-span-12 bg-zinc-900/70 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-semibold">Governance Policies</h3>
              <div className="bg-emerald-500/10 text-emerald-400 text-sm px-5 py-2 rounded-full font-medium">Active</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-sm">
              {["No PII can leave EU region", "Proposals > $250k require finance approval", "Hallucination score must be <5%", "All API calls use scoped tokens", "High-value actions require HITL"].map((policy, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <Shield className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{policy}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
