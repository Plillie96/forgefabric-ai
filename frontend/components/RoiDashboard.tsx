interface RoiDashboardProps {
  data: number;
}

export function RoiDashboard({ data }: RoiDashboardProps) {
  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
      <h2 className="text-xl font-semibold mb-4">ROI Dashboard</h2>
      <div className="text-4xl font-bold text-green-400">
        ${data.toLocaleString()}
      </div>
      <p className="text-gray-400 mt-2">Estimated Value Created</p>
    </div>
  );
}