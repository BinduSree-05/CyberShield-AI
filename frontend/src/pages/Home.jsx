import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Home({ onHistory, onDashboard }) {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanStage, setScanStage] = useState(0);

  const stages = [
    "URL Structure",
    "Domain Analysis",
    "Threat Patterns",
    "ML Classification",
  ];

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setScanStage((current) => (current + 1) % stages.length);
    }, 600);

    return () => clearInterval(interval);
  }, [loading]);

  const analyzeUrl = async () => {
    const enteredUrl = url.trim();

    if (!enteredUrl) {
      setResult({
        score: 0,
        status: "Error",
        reasons: ["Please enter a URL to analyze."],
        ml_prediction: "Unavailable",
      });
      return;
    }

    setLoading(true);
    setResult(null);
    setScanStage(0);

    const startTime = Date.now();
    const minimumScanTime = 2500;

    try {
      const response = await api.post("/api/analyze", {
        url: enteredUrl,
      });

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(
        0,
        minimumScanTime - elapsed
      );

      await new Promise((resolve) =>
        setTimeout(resolve, remaining)
      );

      setResult(response.data);
    } catch (error) {
      console.error("Analysis error:", error);

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(
        0,
        minimumScanTime - elapsed
      );

      await new Promise((resolve) =>
        setTimeout(resolve, remaining)
      );

      setResult({
        success: false,
        score: 0,
        status: "Error",
        reasons: [
          "Could not connect to the backend.",
        ],
        ml_prediction: "Unavailable",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !loading) {
      analyzeUrl();
    }
  };

  const getStatusStyle = (status) => {
    if (status === "Safe") {
      return {
        text: "text-emerald-400",
        border: "border-emerald-400/30",
        bg: "bg-emerald-400/10",
      };
    }

    if (status === "Suspicious") {
      return {
        text: "text-yellow-400",
        border: "border-yellow-400/30",
        bg: "bg-yellow-400/10",
      };
    }

    return {
      text: "text-red-400",
      border: "border-red-400/30",
      bg: "bg-red-400/10",
    };
  };

  const statusStyle = getStatusStyle(
    result?.status || "Safe"
  );

  const score = Number(result?.score || 0);

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden">

      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.08) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Background glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <Navbar
        onHome={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        onHistory={onHistory}
        onDashboard={onDashboard}
      />

      <main className="relative max-w-6xl mx-auto px-5 sm:px-8 py-14">

        {/* HERO */}
        <section className="text-center max-w-4xl mx-auto">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AI Security Engine Online
          </div>

          <h1 className="mt-6 text-5xl sm:text-6xl font-black tracking-tight">
            Detect Phishing URLs
            <span className="block mt-2 text-cyan-400">
              Before They Harm You
            </span>
          </h1>

          <p className="max-w-2xl mx-auto mt-6 text-slate-400 text-base sm:text-lg leading-relaxed">
            Analyze suspicious URLs using security heuristics
            and machine learning to identify potentially
            malicious websites.
          </p>

        </section>

        {/* INPUT */}
        <section className="mt-12">

          <div
            className={`relative max-w-4xl mx-auto rounded-3xl border border-cyan-400/15 bg-slate-900/80 backdrop-blur-xl p-4 shadow-2xl ${
              loading
                ? "shadow-cyan-500/20"
                : "shadow-cyan-950/20"
            }`}
          >

            {loading && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-400 animate-pulse rounded-t-3xl" />
            )}

            <div className="flex flex-col sm:flex-row gap-3">

              <div className="relative flex-1">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400">
                  🔗
                </span>

                <input
                  type="text"
                  value={url}
                  onChange={(event) =>
                    setUrl(event.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  placeholder="Enter URL to analyze..."
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 text-white placeholder-slate-600 py-4 pl-12 pr-4 outline-none focus:border-cyan-400/50 disabled:opacity-50"
                />

              </div>

              <button
                onClick={analyzeUrl}
                disabled={loading}
                className="min-w-[150px] rounded-2xl bg-cyan-400 px-7 py-4 font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-slate-950/30 border-t-slate-950 animate-spin" />
                    Scanning
                  </span>
                ) : (
                  "Analyze URL"
                )}
              </button>

            </div>

            <div className="flex gap-5 px-2 pt-4 text-[11px] text-slate-600">
              <span>✓ URL Heuristics</span>
              <span>✓ ML Classification</span>
              <span>✓ Threat Analysis</span>
            </div>

          </div>

        </section>

        {/* SCANNING PANEL */}
        {loading && (

          <section className="max-w-4xl mx-auto mt-8">

            <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-950/95 p-7 shadow-2xl shadow-cyan-950/30">

              <div className="absolute top-0 left-0 right-0 h-[2px] bg-cyan-400 animate-pulse" />

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
                    CyberShield AI
                  </p>

                  <h2 className="text-xl font-bold mt-1">
                    Security Scan In Progress
                  </h2>
                </div>

                <div className="w-10 h-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />

              </div>

              <div className="mt-6 rounded-xl border border-slate-800 bg-black/30 p-4">

                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Target URL
                </p>

                <p className="mt-2 text-sm text-slate-300 break-all">
                  {url}
                </p>

              </div>

              <div className="mt-6 grid sm:grid-cols-2 gap-3">

                {stages.map((stage, index) => {

                  const active = scanStage === index;
                  const completed = scanStage > index;

                  return (
                    <div
                      key={stage}
                      className={`rounded-xl border p-4 transition-all duration-300 ${
                        active
                          ? "border-cyan-400/50 bg-cyan-400/10"
                          : completed
                          ? "border-emerald-400/20 bg-emerald-400/5"
                          : "border-slate-800 bg-slate-900/30"
                      }`}
                    >

                      <div className="flex items-center gap-3">

                        <div
                          className={`w-9 h-9 rounded-full border flex items-center justify-center text-xs font-bold ${
                            completed
                              ? "border-emerald-400 text-emerald-400"
                              : active
                              ? "border-cyan-400 text-cyan-400"
                              : "border-slate-700 text-slate-600"
                          }`}
                        >
                          {completed ? "✓" : `0${index + 1}`}
                        </div>

                        <div>

                          <p className="text-sm font-semibold">
                            {stage}
                          </p>

                          <p
                            className={`text-[10px] mt-1 ${
                              active
                                ? "text-cyan-400 animate-pulse"
                                : completed
                                ? "text-emerald-400"
                                : "text-slate-600"
                            }`}
                          >
                            {completed
                              ? "COMPLETED"
                              : active
                              ? "PROCESSING"
                              : "WAITING"}
                          </p>

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>

              <div className="mt-7">

                <div className="flex justify-between text-[10px] uppercase tracking-wider">

                  <span className="text-slate-600">
                    Security Engine
                  </span>

                  <span className="text-cyan-400">
                    {Math.min(
                      25 + scanStage * 25,
                      95
                    )}
                    %
                  </span>

                </div>

                <div className="mt-2 h-2 rounded-full bg-slate-800 overflow-hidden">

                  <div
                    className="h-full bg-cyan-400 transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        25 + scanStage * 25,
                        95
                      )}%`,
                    }}
                  />

                </div>

              </div>

              <p className="mt-5 text-center text-xs text-slate-600 animate-pulse">
                Running heuristic checks and machine-learning classification...
              </p>

            </div>

          </section>

        )}

        {/* RESULT */}
        {result && !loading && (

          <section className="max-w-4xl mx-auto mt-10">

            <div
              className={`rounded-3xl border ${statusStyle.border} bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl`}
            >

              {/* Result header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

                <div>

                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                    Analysis Report
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-bold mt-2">
                    Security Assessment
                  </h2>

                </div>

                <div
                  className={`self-start px-4 py-2 rounded-full border ${statusStyle.border} ${statusStyle.bg} ${statusStyle.text} text-sm font-bold`}
                >
                  {result.status}
                </div>

              </div>

              {/* Score + findings */}
              <div className="grid md:grid-cols-[200px_1fr] gap-8 items-center">

                <div className="flex justify-center">

                  <div
                    className={`w-44 h-44 rounded-full border-4 ${statusStyle.border} ${statusStyle.bg} flex items-center justify-center`}
                  >

                    <div className="text-center">

                      <div
                        className={`text-5xl font-black ${statusStyle.text}`}
                      >
                        {score}
                      </div>

                      <div className="text-xs uppercase tracking-widest text-slate-500 mt-1">
                        Risk Score
                      </div>

                    </div>

                  </div>

                </div>

                <div>

                  <h3 className="text-lg font-bold mb-4">
                    Security Findings
                  </h3>

                  {result.reasons &&
                  result.reasons.length > 0 ? (

                    <div className="space-y-3">

                      {result.reasons.map(
                        (reason, index) => (

                          <div
                            key={index}
                            className="rounded-xl border border-slate-800 bg-slate-950/50 p-3"
                          >
                            <span className="text-cyan-400 mr-2">
                              •
                            </span>

                            <span className="text-sm text-slate-300">
                              {reason}
                            </span>

                          </div>

                        )
                      )}

                    </div>

                  ) : (

                    <p className="text-sm text-slate-500">
                      No significant security indicators detected.
                    </p>

                  )}

                </div>

              </div>

              {/* ML result */}
              <div className="mt-8 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] p-5">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                  <div>

                    <p className="text-xs uppercase tracking-wider text-cyan-400">
                      Machine Learning Classification
                    </p>

                    <p className="mt-2 text-xl font-bold">
                      {result.ml_prediction || "Unavailable"}
                    </p>

                  </div>

                  {result.ml_confidence !== undefined && (

                    <div className="text-left sm:text-right">

                      <p className="text-3xl font-black text-cyan-400">
                        {result.ml_confidence}%
                      </p>

                      <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Confidence
                      </p>

                    </div>

                  )}

                </div>

              </div>

              {/* Rule score */}
              {result.rule_score !== undefined && (

                <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">

                  <div className="flex justify-between">

                    <span className="text-sm text-slate-400">
                      Rule-Based Risk
                    </span>

                    <span className="font-bold text-cyan-400">
                      {result.rule_score}/100
                    </span>

                  </div>

                </div>

              )}

              {/* URL */}
              <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">

                <p className="text-[10px] uppercase tracking-wider text-slate-600 mb-2">
                  Scanned URL
                </p>

                <p className="text-sm text-slate-300 break-all">
                  {url}
                </p>

              </div>

            </div>

          </section>

        )}

        {/* FEATURES */}
        <section className="grid md:grid-cols-3 gap-5 mt-16">

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">

            <div className="text-2xl mb-4">
              🧠
            </div>

            <h3 className="font-bold text-lg">
              ML Detection
            </h3>

            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Machine learning classifies URLs into benign,
              phishing, malware and defacement categories.
            </p>

          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">

            <div className="text-2xl mb-4">
              🛡️
            </div>

            <h3 className="font-bold text-lg">
              Security Rules
            </h3>

            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              URL characteristics are checked for common
              phishing and malicious indicators.
            </p>

          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">

            <div className="text-2xl mb-4">
              📊
            </div>

            <h3 className="font-bold text-lg">
              Threat History
            </h3>

            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Previous URL analyses are stored for monitoring
              and dashboard insights.
            </p>

          </div>

        </section>

        {/* FOOTER */}
        <div className="mt-14 flex justify-center">

          <div className="flex items-center gap-2 text-xs text-slate-600">

            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

            CyberShield AI Security Engine Operational

          </div>

        </div>

      </main>

    </div>
  );
}

export default Home;