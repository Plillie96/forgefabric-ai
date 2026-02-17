interface RoiDashboardProps {
  data: number;
}

export function RoiDashboard({ data }: RoiDashboardProps) {
  const formattedValue = data > 0 ? `$${data.toLocaleString()}` : "$0";
  const isPositive = data > 0;

  return (
    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
      <h2 className="text-xl font-semibold mb-4">ROI Dashboard</h2>
      <div className={`text-4xl font-bold ${isPositive ? "text-green-400" : "text-zinc-500"}`}>
        {formattedValue}
      </div>
      <p className="text-zinc-400 mt-2">Estimated Value Created</p>
      {isPositive && (
        <div className="mt-4 text-sm text-zinc-500 space-y-1">
          <div className="flex justify-between">
            <span>Revenue Influence (12%)</span>
            <span className="text-green-400">${Math.round(data * 0.75).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Time Saved Value</span>
            <span className="text-green-400">${Math.round(data * 0.25).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
