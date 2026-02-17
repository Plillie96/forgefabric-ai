export function GovernancePanel() {
  const policies = [
    { name: "No PII can leave EU region", status: "active", checks: 142 },
    { name: "Proposals >$250k require finance approval", status: "active", checks: 87 },
    { name: "Hallucination score must be <5%", status: "active", checks: 203 },
    { name: "All API calls use scoped tokens", status: "active", checks: 356 },
    { name: "High-value actions require HITL", status: "active", checks: 24 },
  ];

  return (
    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Governance Policies</h2>
        <span className="text-xs bg-green-900 text-green-400 px-2 py-1 rounded-full">
          99.7% compliant
        </span>
      </div>
      <ul className="space-y-3">
        {policies.map((p, i) => (
          <li key={i} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-zinc-300">{p.name}</span>
            </div>
            <span className="text-zinc-600 text-xs">{p.checks} checks</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
