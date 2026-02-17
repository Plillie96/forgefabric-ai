"use client";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6">
            The Operating System<br />for Enterprise Agents
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto">
            Govern every action.<br />Prove every dollar.<br />Scale without limits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setShowDemo(true)} className="bg-blue-600 hover:bg-blue-700 px-10 py-5 rounded-2xl text-lg font-semibold transition-all">
              Launch Live Demo
            </button>
            <Link href="/dashboard" className="border border-white/30 hover:bg-white/10 px-10 py-5 rounded-2xl text-lg font-semibold transition-all text-center">
              Open Dashboard
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-16">Four Unbreakable Pillars</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: "Temporal-Native Orchestration", desc: "Durable multi-agent swarms with automatic retries, rollback, and state persistence across failures." },
            { title: "Runtime Governance Fabric", desc: "OPA policy enforcement before every tool call. Cryptographic audit trails for regulators." },
            { title: "Real-Time ROI Engine", desc: "Every action tagged with dollar impact. Live CFO dashboard proves value every second." },
            { title: "Enterprise-Grade Infrastructure", desc: "Multi-tenancy, JWT auth, SOC 2 controls, human-in-the-loop approvals for high-value actions." },
          ].map((pillar) => (
            <div key={pillar.title} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-3">{pillar.title}</h3>
              <p className="text-zinc-400">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
      {showDemo && (
        <div className="max-w-4xl mx-auto px-6 pb-24">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Live Agent Swarm</h2>
            <p className="text-zinc-400 mb-6">Click Open Dashboard to trigger a real governed agent swarm with Temporal orchestration, OPA governance, and ROI tracking.</p>
            <Link href="/dashboard" className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold transition-all">
              Open Dashboard &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
