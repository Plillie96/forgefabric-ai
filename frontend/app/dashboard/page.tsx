"use client";
import { useState } from "react";
import { Play, CheckCircle, Clock, AlertTriangle, Shield, DollarSign } from "lucide-react";

export default function ForgeFabricDashboard() {
  const [isLaunching, setIsLaunching] = useState(false);
  const [swarmStatus, setSwarmStatus] = useState<"idle" | "running" | "completed">("idle");
  const [roiValue, setRoiValue] = useState(0);

  const handleLaunchSwarm = () => {
    setIsLaunching(true);
    setSwarmStatus("running");
    setTimeout(() => {
      setIsLaunching(false);
      setSwarmStatus("completed");
      setRoiValue(48750);
    }, 2800);
  };

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
          <div className="flex items-center gap-3 bg-zinc-900 px-5 py-2 rounded-2xl border border-zinc-700">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 font-medium">System Online</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Trigger Deal Swarm */}
          <div className="lg:col-span-7 bg-zinc-900/70 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Play className="text-cyan-400" />
              Trigger Deal Swarm
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-zinc-400 block mb-2">Company</label>
                <input type="text" defaultValue="Nova Dynamics" className="w-full bg-zinc-950 border border-zinc-700 focus:border-cyan-500 rounded-2xl px-5 py-3.5 text-white placeholder-zinc-500 focus:outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-2">Contact</label>
                <input type="text" defaultValue="Alex Rivera" className="w-full bg-zinc-950 border border-zinc-700 focus:border-cyan-500 rounded-2xl px-5 py-3.5 text-white placeholder-zinc-500 focus:outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-2">Budget Estimate</label>
                <input type="text" defaultValue="150000" className="w-full bg-zinc-950 border border-zinc-700 focus:border-cyan-500 rounded-2xl px-5 py-3.5 text-white placeholder-zinc-500 focus:outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-2">Company Size</label>
                <input type="text" defaultValue="450" className="w-full bg-zinc-950 border border-zinc-700 focus:border-cyan-500 rounded-2xl px-5 py-3.5 text-white placeholder-zinc-500 focus:outline-none transition-all" />
              </div>
            </div>
            <button
              onClick={handleLaunchSwarm}
              disabled={isLaunching}
              className="mt-8 w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 hover:brightness-110 py-5 rounded-2xl font-semibold text-lg tracking-wide shadow-2xl shadow-cyan-500/30 transition-all active:scale-[0.985] disabled:opacity-70"
            >
              {isLaunching ? "Launching Swarm..." : "Launch Deal Swarm"}
            </button>
          </div>

          {/* ROI Dashboard */}
          <div className="lg:col-span-5 bg-zinc-900/70 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-sm text-zinc-400">Estimated Value Created</h3>
                <div className="text-6xl font-semibold text-emerald-400 mt-3 tracking-tighter">
                  ${roiValue.toLocaleString()}
                </div>
              </div>
              <DollarSign className="w-12 h-12 text-emerald-400/30" />
            </div>
            <div className="mt-auto text-emerald-400 text-sm flex items-center gap-2">
              {"\u2191"} 32% from last swarm
            </div>
          </div>

          {/* Agent Swarm Pipeline */}
          <div className="lg:col-span-12 bg-zinc-900/70 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-8">Agent Swarm Pipeline</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
              <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent z-0" />
              {[
                { name: "Lead Qualifier", status: "completed" },
                { name: "Research Agent", status: "completed" },
                { name: "OPA Governance", status: swarmStatus === "running" ? "running" : swarmStatus === "completed" ? "completed" : "pending" },
                { name: "Proposal Drafter", status: swarmStatus === "completed" ? "completed" : "pending" },
                { name: "Compliance Check", status: swarmStatus === "completed" ? "completed" : "pending" },
                { name: "Negotiation Agent", status: swarmStatus === "completed" ? "completed" : "pending" },
              ].map((agent, index) => (
                <div
                  key={index}
                  className="relative z-10 bg-zinc-900 border border-zinc-700/50 rounded-2xl p-6 hover:border-zinc-500/50 transition-all group"
                >
                  <div
                    className={`w-10 h-10 rounded-2xl mb-4 flex items-center justify-center ${
                      agent.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : agent.status === "running"
                        ? "bg-blue-500/10 text-blue-400 animate-pulse"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {agent.status === "completed" ? (
                      <CheckCircle />
                    ) : agent.status === "running" ? (
                      <Clock />
                    ) : (
                      <AlertTriangle />
                    )}
                  </div>
                  <h4 className="font-semibold mb-1">{agent.name}</h4>
                  <p
                    className={`text-xs uppercase tracking-widest ${
                      agent.status === "completed"
                        ? "text-emerald-400"
                        : agent.status === "running"
                        ? "text-blue-400"
                        : "text-zinc-500"
                    }`}
                  >
                    {agent.status}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Governance Policies */}
          <div className="lg:col-span-12 bg-zinc-900/70 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-semibold">Governance Policies</h3>
              <div className="bg-emerald-500/10 text-emerald-400 text-sm px-5 py-2 rounded-full font-medium">
                99.7% Compliant
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-sm">
              {[
                "No PII can leave EU region",
                "Proposals > $250k require finance approval",
                "Hallucination score must be <5%",
                "All API calls use scoped tokens",
                "High-value actions require HITL",
              ].map((policy, i) => (
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
