export function GovernancePanel() {
  const policies = [
    { name: "No PII can leave EU region", status: "active" },
    { name: "No proposal above $250k without finance approval", status: "active" },
    { name: "All content checked for hallucination score < 5%", status: "active" },
    { name: "All external API calls use scoped tokens", status: "active" },
  ];

  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
      <h2 className="text-xl font-semibold mb-4">Governance Policies</h2>
      <ul className="space-y-2">
        {policies.map((p, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            {p.name}
          </li>
        ))}
      </ul>
    </div>
  );
}