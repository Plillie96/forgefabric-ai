"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, CheckCircle, Clock, AlertTriangle, Shield, DollarSign, Zap, Building2, Globe } from "lucide-react";

interface CompanyResearch {
  company: string;
  description: string;
  industry: string;
  estimated_size: string;
  estimated_revenue: string;
  recent_news: string;
  tech_stack_signals: string;
  ai_readiness: string;
}

interface QualifyResult {
  research: CompanyResearch;
  qualification: string;
  fit_score: string;
  reasoning: string;
  recommended_action: string;
  roi_estimate: number;
  governance_checks: Record<string, string>;
  duration_ms: number;
}

export default function ForgeFabricDashboard() {
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState<"idle" | "researching" | "qualifying" | "done" | "error">("idle");
  const [result, setResult] = useState<QualifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [budget, setBudget] = useState(0);

  const handleSearch = async () => {
    if (!company.trim()) return;
    setIsRunning(true);
    setStep("researching");
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/qualify/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: company.trim(),
          contact: contact.trim(),
          budget_estimate: budget,
          company_size: 0,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Backend unreachable. Run: cd backend && uvicorn src.main:app --port 8000" }));
        throw new Error(err.detail);
      }

      setStep("qualifying");
      const data: QualifyResult = await res.json();
      setResult(data);
      setStep("done");
    } catch (e: any) {
      setError(e.message);
      setStep("error");
    } finally {
      setIsRunning(false);
    }
  };

  const pipelineSteps = [
    { name: "Company Search", status: step === "idle" ? "pending" : "completed" },
    { name: "Research Agent", status: step === "idle" ? "pending" : step === "researching" ? "running" : "completed" },
    { name: "OPA Governance", status: step === "done" ? "completed" : step === "qualifying" ? "running" : "pending" },
    { name: "LLM Qualification", status: step === "done" ? "completed" : step === "qualifying" ? "running" : "pending" },
    { name: "ROI Calculation", status: step === "done" ? "completed" : "pending" },
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
          </div>
        </div>

        {/* Search */}
        <div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Search className="text-cyan-400" />
            Search & Qualify a Company
          </h2>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="text-xs text-zinc-400 block mb-2">Company Name</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g. Stripe, Snowflake, Shopify, Datadog..."
                className="w-full bg-zinc-950 border border-zinc-700 focus:border-cyan-500 rounded-2xl px-5 py-4 text-lg text-white placeholder-zinc-600 focus:outline-none transition-all"
              />
            </div>
            <div className="w-48">
              <label className="text-xs text-zinc-400 block mb-2">Contact (optional)</label>
              <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Name" className="w-full bg-zinc-950 border border-zinc-700 focus:border-cyan-500 rounded-2xl px-5 py-4 text-white placeholder-zinc-600 focus:outline-none transition-all" />
            </div>
            <div className="w-48">
              <label className="text-xs text-zinc-400 block mb-2">Budget ($)</label>
              <input type="number" value={budget || ""} onChange={(e) => setBudget(Number(e.target.value))} placeholder="150000" className="w-full bg-zinc-950 border border-zinc-700 focus:border-cyan-500 rounded-2xl px-5 py-4 text-white placeholder-zinc-600 focus:outline-none transition-all" />
            </div>
          </div>
          <button
            onClick={handleSearch}
            disabled={isRunning || !company.trim()}
            className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 hover:brightness-110 py-5 rounded-2xl font-semibold text-lg tracking-wide shadow-2xl shadow-cyan-500/30 transition-all active:scale-[0.985] disabled:opacity-50"
          >
            {isRunning ? (step === "researching" ? "Researching company..." : "Qualifying lead...") : "Search & Qualify"}
          </button>
        </div>

        {/* Pipeline */}
        <div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8 mb-8">
          <h3 className="text-lg font-semibold mb-6">Agent Pipeline</h3>
          <div className="flex items-center gap-2">
            {pipelineSteps.map((s, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm flex-1 ${s.status === "completed" ? "border-emerald-500/50 bg-emerald-500/5 text-emerald-400" : s.status === "running" ? "border-blue-500/50 bg-blue-500/5 text-blue-400 animate-pulse" : "border-zinc-700/50 bg-zinc-800/50 text-zinc-500"}`}>
                  {s.status === "completed" ? <CheckCircle className="w-4 h-4" /> : s.status === "running" ? <Clock className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span className="truncate">{s.name}</span>
                </div>
                {i < pipelineSteps.length - 1 && <span className="text-zinc-700">{"\u2192"}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            {/* Research */}
            <div className="lg:col-span-7 bg-zinc-900/70 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="text-cyan-400" />
                <h3 className="text-xl font-semibold">Company Research</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-3xl font-bold tracking-tight">{result.research.company}</h4>
                  <p className="text-cyan-400 text-sm mt-1">{result.research.industry}</p>
                </div>
                <p className="text-zinc-300 leading-relaxed">{result.research.description}</p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-zinc-800/50 rounded-xl p-4">
                    <span className="text-xs text-zinc-500 block mb-1">Size</span>
                    <span className="text-lg font-semibold">{result.research.estimated_size}</span>
                  </div>
                  <div className="bg-zinc-800/50 rounded-xl p-4">
                    <span className="text-xs text-zinc-500 block mb-1">Revenue</span>
                    <span className="text-lg font-semibold">{result.research.estimated_revenue}</span>
                  </div>
                  <div className="bg-zinc-800/50 rounded-xl p-4">
                    <span className="text-xs text-zinc-500 block mb-1">AI Readiness</span>
                    <span className={`text-lg font-semibold ${result.research.ai_readiness === "High" ? "text-emerald-400" : result.research.ai_readiness === "Medium" ? "text-yellow-400" : "text-red-400"}`}>{result.research.ai_readiness}</span>
                  </div>
                  <div className="bg-zinc-800/50 rounded-xl p-4">
                    <span className="text-xs text-zinc-500 block mb-1">Tech Stack</span>
                    <span className="text-sm">{result.research.tech_stack_signals}</span>
                  </div>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-4">
                  <span className="text-xs text-zinc-500 block mb-1">Recent News</span>
                  <p className="text-sm text-zinc-300">{result.research.recent_news}</p>
                </div>
              </div>
            </div>

            {/* Qualification + ROI */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Zap className="text-cyan-400" />
                    <h3 className="text-xl font-semibold">Qualification</h3>
                  </div>
                  <span className={`text-sm px-4 py-1.5 rounded-full font-medium ${result.qualification === "Qualified" ? "bg-emerald-500/10 text-emerald-400" : result.qualification === "Nurture" ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"}`}>
                    {result.qualification}
                  </span>
                </div>
                <div className={`text-3xl font-bold mb-4 ${result.fit_score === "Strong" ? "text-emerald-400" : result.fit_score === "Medium" ? "text-yellow-400" : "text-red-400"}`}>
                  {result.fit_score} Fit
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed mb-4">{result.reasoning}</p>
                <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4">
                  <span className="text-xs text-cyan-400 block mb-1">Recommended Action</span>
                  <p className="text-sm font-medium">{result.recommended_action}</p>
                </div>
              </div>

              <div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm text-zinc-400">Estimated ROI</h3>
                    <div className="text-5xl font-bold text-emerald-400 mt-2 tracking-tighter">${result.roi_estimate.toLocaleString()}</div>
                  </div>
                  <DollarSign className="w-10 h-10 text-emerald-400/30" />
                </div>
                <div className="text-xs text-zinc-500 mt-4">{result.duration_ms}ms response time</div>
              </div>
            </div>

            {/* Governance */}
            <div className="lg:col-span-12 bg-zinc-900/70 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="text-emerald-400" />
                <h3 className="text-xl font-semibold">Governance Checks</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(result.governance_checks).map(([key, value]) => (
                  <div key={key} className="bg-zinc-800/50 rounded-xl p-4 text-center">
                    <div className={`text-sm font-medium mb-1 ${value === "passed" || value === "compliant" || value === "approved" || value === "all_scoped" ? "text-emerald-400" : "text-yellow-400"}`}>{value}</div>
                    <div className="text-xs text-zinc-500">{key.replace(/_/g, " ")}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-950/50 border border-red-800/50 rounded-3xl p-8 mb-8">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Error</h3>
            <p className="text-red-300">{error}</p>
            <p className="text-sm text-zinc-500 mt-2">Start the backend: cd backend && uvicorn src.main:app --reload --port 8000</p>
          </div>
        )}
      </div>
    </div>
  );
}
