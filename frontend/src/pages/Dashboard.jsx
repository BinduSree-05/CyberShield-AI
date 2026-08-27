import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function Dashboard({ onHome, onHistory }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/history")
      .then((res) => {
        setHistory(res.data);
      })
      .catch((error) => {
        console.error("Dashboard error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const stats = useMemo(() => {
    const total = history.length;

    const safe = history.filter(
      (scan) => scan.status === "Safe"
    ).length;

    const suspicious = history.filter(
      (scan) => scan.status === "Suspicious"
    ).length;

    const dangerous = history.filter(
      (scan) => scan.status === "Dangerous"
    ).length;

    const totalScore = history.reduce(
      (sum, scan) => sum + Number(scan.score || 0),
      0
    );

    const average =
      total > 0 ? Math.round(totalScore / total) : 0;

    return {
      total,
      safe,
      suspicious,
      dangerous,
      average,
    };
  }, [history]);

  const chartData = [
    {
      name: "Safe",
      value: stats.safe,
    },
    {
      name: "Suspicious",
      value: stats.suspicious,
    },
    {
      name: "Dangerous",
      value: stats.dangerous,
    },
  ];

  const getStatusStyle = (status) => {
    if (status === "Safe") {
      return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    }

    if (status === "Suspicious") {
      return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    }

    if (status === "Dangerous") {
      return "text-red-400 bg-red-400/10 border-red-400/20";
    }

    return "text-slate-400 bg-slate-800 border-slate-700";
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(34,211,238,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <Navbar
        onHome={onHome}
        onHistory={onHistory}
        onDashboard={() => {}}
      />

      <main className="relative max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="text-cyan-400 text-xs uppercase tracking-[0.2em] font-semibold">
            Security Intelligence
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mt-2">
            Threat Dashboard
          </h1>

          <p className="text-slate-400 mt-3">
            Monitor URL analysis activity and detected threats.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Total */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 hover:border-cyan-400/30 transition-all">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Total Scans
            </p>

            <p className="text-3xl font-bold mt-3">
              {stats.total}
            </p>
          </div>

          {/* Safe */}
          <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.03] p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Safe
            </p>

            <p className="text-3xl font-bold text-emerald-400 mt-3">
              {stats.safe}
            </p>
          </div>

          {/* Suspicious */}
          <div className="rounded-2xl border border-yellow-400/10 bg-yellow-400/[0.03] p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Suspicious
            </p>

            <p className="text-3xl font-bold text-yellow-400 mt-3">
              {stats.suspicious}
            </p>
          </div>

          {/* Dangerous */}
          <div className="rounded-2xl border border-red-400/10 bg-red-400/[0.03] p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Dangerous
            </p>

            <p className="text-3xl font-bold text-red-400 mt-3">
              {stats.dangerous}
            </p>
          </div>

          {/* Average */}
          <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Avg Risk
            </p>

            <p className="text-3xl font-bold text-cyan-400 mt-3">
              {stats.average}%
            </p>
          </div>
        </div>

        {/* Main Dashboard */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Threat Distribution */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-6">
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wider text-cyan-400">
                Threat Distribution
              </p>

              <h2 className="text-xl font-bold mt-1">
                Security Overview
              </h2>
            </div>

            {stats.total === 0 ? (
              <div className="h-72 flex items-center justify-center text-slate-500">
                No scan data available.
              </div>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={105}
                      paddingAngle={4}
                    >
                      <Cell fill="#34d399" />
                      <Cell fill="#facc15" />
                      <Cell fill="#f87171" />
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #1e293b",
                        borderRadius: "10px",
                        color: "#ffffff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="flex justify-center gap-6 text-xs">
              <span className="text-emerald-400">
                ● Safe
              </span>

              <span className="text-yellow-400">
                ● Suspicious
              </span>

              <span className="text-red-400">
                ● Dangerous
              </span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-cyan-400">
                  Activity
                </p>

                <h2 className="text-xl font-bold mt-1">
                  Recent Scans
                </h2>
              </div>

              <button
                onClick={onHistory}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition"
              >
                View all →
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-500">
                Loading activity...
              </div>
            ) : history.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                No scans yet.
              </div>
            ) : (
              <div className="space-y-3">
                {history.slice(0, 5).map((scan) => (
                  <div
                    key={scan.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 hover:border-cyan-400/20 transition-all"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm text-slate-300 truncate">
                          {scan.url}
                        </p>

                        <p className="text-xs text-slate-600 mt-1">
                          {scan.date}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="text-sm font-bold">
                          {scan.score}%
                        </span>

                        <span
                          className={`px-2 py-1 rounded-full border text-[10px] font-semibold ${getStatusStyle(
                            scan.status
                          )}`}
                        >
                          {scan.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Engine Status */}
        <div className="mt-6 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.02] p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

              <span className="text-sm text-slate-300">
                CyberShield Security Engine
              </span>
            </div>

            <div className="flex gap-5 text-xs text-slate-500">
              <span>✓ Rule Engine</span>
              <span>✓ ML Classifier</span>
              <span>✓ Threat Logging</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;