import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function History({ onHome, onDashboard }) {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const loadHistory = () => {

    setLoading(true);

    api.get("/api/history")
      .then((res) => {
        setHistory(res.data);
      })
      .catch((error) => {
        console.error("History error:", error);
      })
      .finally(() => {
        setLoading(false);
      });

  };


  useEffect(() => {
    loadHistory();
  }, []);


  const clearHistory = async () => {

    const confirmed = window.confirm(
      "Are you sure you want to delete all scan history?"
    );

    if (!confirmed) {
      return;
    }

    try {

      setClearing(true);

      await api.delete("/api/history");

      setHistory([]);

    } catch (error) {

      console.error("Clear history error:", error);

      alert("Could not clear history.");

    } finally {

      setClearing(false);

    }
  };


  const getStatusStyle = (status) => {

    if (status === "Safe") {
      return "bg-emerald-400/10 text-emerald-400 border-emerald-400/20";
    }

    if (status === "Suspicious") {
      return "bg-yellow-400/10 text-yellow-400 border-yellow-400/20";
    }

    if (status === "Dangerous") {
      return "bg-red-400/10 text-red-400 border-red-400/20";
    }

    return "bg-slate-800 text-slate-400 border-slate-700";
  };


  return (

    <div className="
      relative
      min-h-screen
      bg-[#020617]
      text-white
      overflow-hidden
    ">

      {/* Cyber background */}

      <div className="
        absolute
        inset-0
        cyber-grid
        pointer-events-none
      " />

      <div className="
        absolute
        top-20
        right-20
        w-72
        h-72
        bg-cyan-500/5
        rounded-full
        blur-[100px]
        pointer-events-none
      " />


      <Navbar
        onHome={onHome}
        onHistory={() => {}}
        onDashboard={onDashboard}
      />


      <main className="
        relative
        max-w-7xl
        mx-auto
        px-6
        py-10
      ">

        {/* Header */}

        <div className="
          flex
          flex-col
          md:flex-row
          md:items-end
          md:justify-between
          gap-5
          mb-10
        ">

          <div>

            <p className="
              text-cyan-400
              text-xs
              uppercase
              tracking-[0.2em]
              font-semibold
            ">
              Security Logs
            </p>

            <h1 className="
              text-4xl
              md:text-5xl
              font-bold
              mt-2
            ">
              Scan History
            </h1>

            <p className="
              text-slate-400
              mt-3
            ">
              Review previously analyzed URLs and detected threats.
            </p>

          </div>


          {/* Clear button */}

          <button
            onClick={clearHistory}
            disabled={clearing || history.length === 0}
            className="
              px-5
              py-3
              rounded-xl
              border
              border-red-400/20
              bg-red-400/5
              text-red-400
              text-sm
              font-semibold
              hover:bg-red-400/10
              hover:border-red-400/40
              disabled:opacity-30
              disabled:cursor-not-allowed
              transition-all
              duration-300
            "
          >

            {clearing
              ? "Clearing..."
              : "Clear History"
            }

          </button>

        </div>


        {/* Statistics */}

        <div className="
          grid
          grid-cols-2
          md:grid-cols-4
          gap-4
          mb-8
        ">

          <div className="
            rounded-xl
            border border-slate-800
            bg-slate-900/60
            p-5
          ">

            <p className="text-xs text-slate-500 uppercase">
              Total Scans
            </p>

            <p className="
              text-3xl
              font-bold
              mt-2
            ">
              {history.length}
            </p>

          </div>


          <div className="
            rounded-xl
            border border-emerald-400/10
            bg-emerald-400/[0.03]
            p-5
          ">

            <p className="text-xs text-slate-500 uppercase">
              Safe
            </p>

            <p className="
              text-3xl
              font-bold
              text-emerald-400
              mt-2
            ">
              {
                history.filter(
                  scan => scan.status === "Safe"
                ).length
              }
            </p>

          </div>


          <div className="
            rounded-xl
            border border-yellow-400/10
            bg-yellow-400/[0.03]
            p-5
          ">

            <p className="text-xs text-slate-500 uppercase">
              Suspicious
            </p>

            <p className="
              text-3xl
              font-bold
              text-yellow-400
              mt-2
            ">
              {
                history.filter(
                  scan => scan.status === "Suspicious"
                ).length
              }
            </p>

          </div>


          <div className="
            rounded-xl
            border border-red-400/10
            bg-red-400/[0.03]
            p-5
          ">

            <p className="text-xs text-slate-500 uppercase">
              Dangerous
            </p>

            <p className="
              text-3xl
              font-bold
              text-red-400
              mt-2
            ">
              {
                history.filter(
                  scan => scan.status === "Dangerous"
                ).length
              }
            </p>

          </div>

        </div>


        {/* History */}

        <div className="
          rounded-2xl
          border border-slate-800
          bg-slate-900/70
          backdrop-blur-xl
          overflow-hidden
        ">

          {/* Table header */}

          <div className="
            hidden
            md:grid
            grid-cols-[minmax(0,2fr)_120px_160px_180px]
            gap-4
            px-6
            py-4
            border-b
            border-slate-800
            text-xs
            uppercase
            tracking-wider
            text-slate-600
          ">

            <span>URL</span>
            <span>Risk</span>
            <span>Status</span>
            <span>Date & Time</span>

          </div>


          {/* Loading */}

          {loading ? (

            <div className="
              py-20
              text-center
              text-slate-500
            ">
              Loading security logs...
            </div>

          ) : history.length === 0 ? (

            <div className="
              py-20
              text-center
            ">

              <div className="text-5xl mb-5">
                🛡️
              </div>

              <h2 className="
                text-xl
                font-semibold
              ">
                No scan history
              </h2>

              <p className="
                text-slate-500
                mt-2
              ">
                Analyze a URL to create your first security log.
              </p>

            </div>

          ) : (

            <div>

              {history.map((scan) => (

                <div
                  key={scan.id}
                  className="
                    grid
                    md:grid-cols-[minmax(0,2fr)_120px_160px_180px]
                    gap-4
                    px-6
                    py-5
                    border-b
                    border-slate-800
                    last:border-b-0
                    hover:bg-slate-800/30
                    transition-all
                    duration-300
                  "
                >

                  {/* URL */}

                  <div className="min-w-0">

                    <p className="
                      text-sm
                      text-slate-200
                      break-all
                    ">
                      {scan.url}
                    </p>

                    <p className="
                      md:hidden
                      text-xs
                      text-slate-600
                      mt-2
                    ">
                      {scan.date}
                    </p>

                  </div>


                  {/* Score */}

                  <div className="
                    flex
                    items-center
                  ">

                    <span className="
                      text-sm
                      font-bold
                    ">
                      {scan.score}%
                    </span>

                  </div>


                  {/* Status */}

                  <div className="
                    flex
                    items-center
                  ">

                    <span
                      className={`
                        px-3
                        py-1
                        rounded-full
                        border
                        text-xs
                        font-semibold
                        ${getStatusStyle(scan.status)}
                      `}
                    >
                      {scan.status}
                    </span>

                  </div>


                  {/* Date */}

                  <div className="
                    hidden
                    md:flex
                    items-center
                    text-xs
                    text-slate-500
                  ">
                    {scan.date}
                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default History;