"use client";
import { useState } from "react";
import Link from "next/link";
import { AgentGraph } from "../components/AgentGraph";

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-blue-500">{"\u25C6"}</span> ForgeFabric
          </span>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/observability" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Observability
            </Link>
            <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-sm font-medium transition-all">
              Launch Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:40px_40px]" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="mb-8 flex justify-center">
            <img src="/logo.svg" alt="ForgeFabric" className="h-16" />
          </div>

          <h1 className="text-7xl font-bold tracking-tighter mb-6">
            The Operating System
            <br />
            for Enterprise Agents
          </h1>

          <p className="text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto">
            Govern every action.
            <br />
            Prove every dollar.
            <br />
            Scale without limits.
          </p>

          <div className="flex gap-6 justify-center">
            <button
              onClick={() => setShowDemo(true)}
              className="bg-blue-600 hover:bg-blue-700 px-12 py-6 rounded-2xl text-xl font-semibold transition-all"
            >
              Launch Live Demo
            </button>
            <a
              href="#pilot"
              className="border border-white/30 hover:bg-white/10 px-12 py-6 rounded-2xl text-xl font-semibold transition-all"
            >
              Book Free Pilot
            </a>
          </div>
        </div>

        {/* Background logos */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-12 opacity-40">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Salesforce_logo.svg/2560px-Salesforce_logo.svg.png"
            className="h-8"
            alt="Salesforce"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/SAP_2011_logo.svg/2560px-SAP_2011_logo.svg.png"
            className="h-8"
            alt="SAP"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Snowflake_Logo.svg/2560px-Snowflake_Logo.svg.png"
            className="h-8"
            alt="Snowflake"
          />
        </div>
      </div>

      {/* Live Demo Section */}
      {showDemo && (
        <div className="max-w-6xl mx-auto px-6 py-24">
          <AgentGraph />
          <p className="text-center mt-6 text-zinc-500">
            Live swarm running {"\u2014"} watch governance, ROI, and human approval in real time
          </p>
        </div>
      )}
    </div>
  );
}

