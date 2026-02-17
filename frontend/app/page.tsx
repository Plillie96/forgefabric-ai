"use client";
import { useState } from "react";
import Link from "next/link";

const pillars = [
  {
    icon: "\u26A1",
    title: "Temporal-Native Orchestration",
    desc: "Durable multi-agent swarms with automatic retries, rollback, and state persistence. Agents never get stuck \u2014 even across crashes and week-long human approvals.",
  },
  {
    icon: "\uD83D\uDEE1\uFE0F",
    title: "Runtime Governance Fabric",
    desc: "OPA policy enforcement before every tool call. Cryptographic audit trails, bias detection, hallucination guardrails, and kill-switches \u2014 all at runtime.",
  },
  {
    icon: "\uD83D\uDCB0",
    title: "Real-Time ROI Engine",
    desc: "Every action tagged with dollar impact. Live CFO dashboard: \u201CThis swarm generated $2.4M pipeline this quarter with 99.7% compliance.\u201D",
  },
  {
    icon: "\uD83C\uDFE2",
    title: "Enterprise-Grade Infrastructure",
    desc: "Multi-tenancy, JWT auth, SOC 2 controls, human-in-the-loop approvals. Built for regulated industries from day one.",
  },
];

const metrics = [
  { value: "2\u20134\u00D7", label: "Pipeline Velocity" },
  { value: "99.7%", label: "Compliance Score" },
  { value: "<60s", label: "Cold Lead to Proposal" },
  { value: "$0", label: "Until Value Delivered" },
];

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-blue-500">\u25C6</span> ForgeFabric
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-sm font-medium transition-all"
            >
              Launch Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-transparent to-transparent" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-sm text-zinc-400 mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Now live \u2014 Temporal-native agent runtime
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 leading-[0.9]">
            The Operating System
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              for Enterprise Agents
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Govern every action. Prove every dollar. Scale without limits.
            <br />
            <span className="text-zinc-500">
              The neutral runtime that makes every agent platform enterprise-safe.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowDemo(true)}
              className="bg-blue-600 hover:bg-blue-700 hover:scale-105 px-10 py-5 rounded-2xl text-lg font-semibold transition-all shadow-lg shadow-blue-600/20"
            >
              Launch Live Demo
            </button>
            <Link
              href="/dashboard"
              className="border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900 px-10 py-5 rounded-2xl text-lg font-semibold transition-all text-center"
            >
              Open Dashboard \u2192
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="border-y border-zinc-800 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {m.value}
              </div>
              <div className="text-sm text-zinc-500">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center mb-4">
          Four Unbreakable Pillars
        </h2>
        <p className="text-zinc-500 text-center mb-16 max-w-2xl mx-auto">
          Built for the exact gap the market is screaming for: neutral,
          runtime-first, dollar-proven agent infrastructure.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="group bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-8 transition-all hover:bg-zinc-900"
            >
              <div className="text-3xl mb-4">{p.icon}</div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors">
                {p.title}
              </h3>
              <p className="text-zinc-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-zinc-800 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto px-6 py-24">
          <h2 className="text-4xl font-bold text-center mb-16">
            From Cold Lead to Closed Deal
          </h2>
          <div className="space-y-8">
            {[
              ["Trigger", "Submit a lead from the dashboard or API"],
              [
                "Orchestrate",
                "Temporal spins up a durable ReAct swarm with qualifier, researcher, and closer agents",
              ],
              [
                "Govern",
                "Every tool call passes OPA policy checks at runtime \u2014 no rogue actions",
              ],
              [
                "Approve",
                "High-value decisions pause for human-in-the-loop approval",
              ],
              [
                "Prove",
                "Real-time ROI attribution: time saved, revenue influenced, cost avoided",
              ],
              [
                "Bill",
                "Outcome value invoiced via Stripe \u2014 you only pay when agents deliver",
              ],
            ].map(([step, desc], i) => (
              <div key={step} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600/20 border border-blue-600/40 flex items-center justify-center text-blue-400 font-bold text-sm">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{step}</h3>
                  <p className="text-zinc-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to govern your agents?
        </h2>
        <p className="text-xl text-zinc-400 mb-10">
          Start a free 90-day pilot. See measurable ROI from day 30.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-blue-600 hover:bg-blue-700 hover:scale-105 px-12 py-5 rounded-2xl text-lg font-semibold transition-all shadow-lg shadow-blue-600/20"
        >
          Launch Your First Swarm \u2192
        </Link>
      </section>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Live Agent Swarm</h2>
              <button
                onClick={() => setShowDemo(false)}
                className="text-zinc-500 hover:text-white text-2xl"
              >
                \u00D7
              </button>
            </div>
            <p className="text-zinc-400 mb-6">
              Click below to open the full dashboard and trigger a real governed
              agent swarm with Temporal orchestration, OPA governance, and
              real-time ROI tracking.
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold transition-all"
            >
              Open Dashboard \u2192
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-zinc-500 text-sm">
            \u00A9 2026 ForgeFabric. Built in Salt Lake City.
          </span>
          <div className="flex gap-6 text-sm text-zinc-500">
            <a
              href="https://github.com/Plillie96/forgefabric-ai"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <Link
              href="/dashboard"
              className="hover:text-white transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
