export function AgentGraph() {
  const nodes = [
    { id: "qualifier", label: "Lead Qualifier", status: "completed" },
    { id: "researcher", label: "Research Agent", status: "completed" },
    { id: "drafter", label: "Proposal Drafter", status: "running" },
    { id: "compliance", label: "Compliance Check", status: "pending" },
    { id: "closer", label: "Negotiation Agent", status: "pending" },
  ];

  const statusColors: Record<string, string> = {
    completed: "border-green-500 bg-green-950",
    running: "border-blue-500 bg-blue-950 animate-pulse",
    pending: "border-gray-600 bg-gray-900",
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
      <h2 className="text-xl font-semibold mb-4">Agent Swarm</h2>
      <div className="flex flex-wrap gap-4">
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`px-4 py-2 rounded-xl border-2 ${statusColors[node.status]}`}
          >
            <div className="font-mono text-sm">{node.label}</div>
            <div className="text-xs opacity-75">{node.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}