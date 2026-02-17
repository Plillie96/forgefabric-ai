"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

interface Trace {
  trace_id: string;
  timestamp: string;
  agent: string;
  action: string;
  duration_ms: number;
  roi_estimate: number;
  bias_score: number;
  hallucination_score: number;
}

export default function ObservabilityDashboard() {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTraces = async () => {
      try {
        const res = await fetch("/api/v1/observability/traces");
        const data = await res.json();
        setTraces(data.traces || []);
      } catch {
        setTraces([]);
      }
      setLoading(false);
    };
    fetchTraces();
    const interval = setInterval(fetchTraces, 3000);
    return () => clearInterval(interval);
  }, []);

  const totalRoi = traces.reduce((sum, t) => sum + t.roi_estimate, 0);
  const avgLatency = traces.length
    ? Math.round(traces.reduce((sum, t) => sum + t.duration_ms, 0) / traces.length)
    : 0;
  const avgBias = traces.length
    ? (traces.reduce((sum, t) => sum + t.bias_score, 0) / traces.length) * 100
    : 0;
  const biasAlertRate = traces.length
    ? (traces.filter((t) => t.bias_score > 0.3).length / traces.length) * 100
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-xl text-zinc-500">Loading traces...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Observability Center</h1>
          <div className="text-right">
            <div className="flex items-center gap-2 text-xl font-mono text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live &bull; {traces.length} traces
            </div>
            <div className="text-sm text-zinc-500">
              Avg Bias:{" "}
              <span className={avgBias > 15 ? "text-red-500" : "text-green-500"}>
                {avgBias.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total ROI This Hour</CardTitle>
            </CardHeader>
            <CardContent className="text-4xl font-bold text-green-400">
              ${totalRoi.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Avg Response Time</CardTitle>
            </CardHeader>
            <CardContent className="text-4xl font-bold text-white">
              {avgLatency}ms
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Bias Alert Rate</CardTitle>
            </CardHeader>
            <CardContent className="text-4xl font-bold text-orange-400">
              {biasAlertRate.toFixed(1)}%
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Agent Traces (Live)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {traces.map((trace) => (
                <div
                  key={trace.trace_id}
                  className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 hover:border-zinc-600 transition-colors"
                >
                  <div>
                    <div className="font-mono text-xs text-zinc-500">
                      {trace.trace_id} &bull; {trace.timestamp.slice(11, 19)}
                    </div>
                    <div className="font-semibold">
                      {trace.agent}{" "}
                      <span className="text-zinc-500 font-normal">&bull; {trace.action}</span>
                    </div>
                    <div className="text-xs text-zinc-600">{trace.duration_ms}ms</div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-semibold">
                      +${trace.roi_estimate.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-xs text-zinc-500">
                      Bias:{" "}
                      <span className={trace.bias_score > 0.2 ? "text-orange-400" : "text-green-500"}>
                        {(trace.bias_score * 100).toFixed(1)}%
                      </span>
                      {" "}&bull; Halluc:{" "}
                      <span
                        className={
                          trace.hallucination_score > 0.05 ? "text-red-400" : "text-green-500"
                        }
                      >
                        {(trace.hallucination_score * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
