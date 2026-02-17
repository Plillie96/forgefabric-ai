export function AgentGraph() {
  const nodes = [
    { id: "qualifier", label: "Lead Qualifier", status: "completed" },
    { id: "researcher", label: "Research Agent", status: "completed" },
    { id: "governance", label: "OPA Governance", status: "running" },
    { id: "drafter", label: "Proposal Drafter", status: "pending" },
    { id: "compliance", label: "Compliance Check", status: "pending" },
    { id: "closer", label: "Negotiation Agent", status: "pending" },
    { id: "roi", label: "ROI Engine", status: "pending" },
  ];

  const statusColors: Record<string, string> = {
    completed: "border-green-500 bg-green-950",
    running: "border-blue-500 bg-blue-950 animate-pulse",
    pending: "border-zinc-600 bg-zinc-800",
  };

  const statusIcons: Record<string, string> = {
    completed: "\u2705",
    running: "\u26A1",
    pending: "\u23F3",
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
      <h2 className="text-xl font-semibold mb-4">Agent Swarm Pipeline</h2>
      <div className="flex flex-wrap gap-3">
        {nodes.map((node, i) => (
          <div key={node.id} className="flex items-center gap-2">
            <div
              className={`px-4 py-3 rounded-xl border-2 transition-all ${statusColors[node.status]}`}
            >
              <div className="font-mono text-sm flex items-center gap-2">
                <span>{statusIcons[node.status]}</span>
                {node.label}
              </div>
              <div className="text-xs opacity-60 mt-1">{node.status}</div>
            </div>
            {i < nodes.length - 1 && (
              <span className="text-zinc-600 text-lg">\u2192</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
