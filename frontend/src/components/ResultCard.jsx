import ProgressBar from "./ProgressBar";

function ResultCard({ result }) {

  const status = result?.status || "Waiting for Analysis";

  const statusConfig = {
    Safe: {
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
      icon: "✓",
      label: "LOW THREAT"
    },

    Suspicious: {
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      border: "border-yellow-400/20",
      icon: "!",
      label: "MEDIUM THREAT"
    },

    Dangerous: {
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-red-400/20",
      icon: "!",
      label: "HIGH THREAT"
    },

    Error: {
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-red-400/20",
      icon: "×",
      label: "SYSTEM ERROR"
    },

    "Waiting for Analysis": {
      color: "text-slate-400",
      bg: "bg-slate-800",
      border: "border-slate-700",
      icon: "•",
      label: "AWAITING SCAN"
    }
  };

  const config =
    statusConfig[status] ||
    statusConfig["Waiting for Analysis"];


  const mlPrediction =
    result?.ml_prediction || "Not Available";

  const isMalicious =
    String(mlPrediction)
      .toLowerCase()
      .includes("malicious");


  /* Dynamic score color */

  let scoreColor = "text-white";

  if (status === "Safe") {
    scoreColor = "text-emerald-400";
  }

  if (status === "Suspicious") {
    scoreColor = "text-yellow-400";
  }

  if (status === "Dangerous") {
    scoreColor = "text-red-400";
  }


  return (

    <section className="max-w-4xl mx-auto px-6 mt-12 mb-20">

      <div
        className="
          relative
          overflow-hidden
          rounded-2xl
          fade-up
          border border-slate-800
          bg-slate-900/80
          backdrop-blur-xl
          shadow-2xl
        "
      >

        {/* Top cyber line */}

        <div className="
          absolute
          top-0
          left-0
          right-0
          h-px
          bg-cyan-400/30
        " />


        {/* Header */}

        <div className="
          p-6
          border-b
          border-slate-800
        ">

          <div className="
            flex
            items-center
            justify-between
            gap-4
          ">

            <div>

              <p className="
                text-cyan-400
                text-xs
                uppercase
                tracking-[0.2em]
              ">
                Threat Analysis
              </p>

              <h2 className="
                text-2xl
                font-bold
                mt-1
              ">
                Analysis Report
              </h2>

            </div>


            <div className="
              hidden
              sm:block
              text-slate-600
              text-xs
              font-mono
            ">
              CYBERSHIELD // SCAN
            </div>

          </div>

        </div>


        {/* Main result */}

        <div className="p-6">

          <div className="
            grid
            md:grid-cols-2
            gap-8
          ">


            {/* Risk Score */}

            <div>

              <p className="
                text-sm
                text-slate-500
                uppercase
                tracking-wider
              ">
                Risk Score
              </p>


              <div className="
                flex
                items-end
                gap-2
                mt-2
              ">

                <span
                  className={`
                    text-6xl
                    font-bold
                    transition-all
                    duration-500
                    ${scoreColor}
                  `}
                >
                  {result?.score ?? "--"}
                </span>

                <span className="
                  text-slate-500
                  mb-2
                ">
                  / 100
                </span>

              </div>


              {/* Dynamic progress bar */}

              <ProgressBar
                score={result?.score}
                status={result?.status}
              />

            </div>


            {/* Threat Status */}

            <div
              className={`
                rounded-xl
                border
                ${config.border}
                ${config.bg}
                p-6
                flex
                flex-col
                justify-center
              `}
            >

              <div className="
                flex
                items-center
                gap-4
              ">

                <div
                  className={`
                    w-12
                    h-12
                    rounded-full
                    flex
                    items-center
                    justify-center
                    ${config.bg}
                    border
                    ${config.border}
                    ${config.color}
                    text-xl
                    font-bold
                  `}
                >
                  {config.icon}
                </div>


                <div>

                  <p className="
                    text-xs
                    text-slate-500
                    tracking-wider
                  ">
                    THREAT STATUS
                  </p>

                  <p
                    className={`
                      text-2xl
                      font-bold
                      ${config.color}
                    `}
                  >
                    {status}
                  </p>

                </div>

              </div>


              <p
                className={`
                  text-xs
                  mt-4
                  ${config.color}
                `}
              >
                {config.label}
              </p>

            </div>

          </div>


          {/* Detection Engines */}

          <div className="
            grid
            md:grid-cols-2
            gap-4
            mt-8
          ">


            {/* Rule Based */}

            <div className="
              rounded-xl
              bg-slate-950/60
              border border-slate-800
              p-5
              hover:border-cyan-400/20
              transition-all
              duration-300
            ">

              <div className="
                flex
                items-center
                justify-between
              ">

                <div>

                  <p className="
                    text-xs
                    text-slate-500
                    uppercase
                    tracking-wider
                  ">
                    Detection Engine
                  </p>

                  <p className="
                    font-semibold
                    mt-1
                  ">
                    Rule-Based Analysis
                  </p>

                </div>

                <span className="
                  text-cyan-400
                  text-xl
                ">
                  ◈
                </span>

              </div>


              <p className="
                text-sm
                text-slate-500
                mt-3
              ">
                URL structure, protocol, domain and
                suspicious-pattern heuristics.
              </p>

            </div>


            {/* Machine Learning */}

            <div className="
              rounded-xl
              bg-slate-950/60
              border border-slate-800
              p-5
              hover:border-cyan-400/20
              transition-all
              duration-300
            ">

              <div className="
                flex
                items-center
                justify-between
              ">

                <div>

                  <p className="
                    text-xs
                    text-slate-500
                    uppercase
                    tracking-wider
                  ">
                    Machine Learning
                  </p>

                  <p className="
                    font-semibold
                    mt-1
                  ">
                    {mlPrediction}
                  </p>

                </div>


                <span
                  className={
                    isMalicious
                      ? "text-red-400 text-xl"
                      : "text-emerald-400 text-xl"
                  }
                >
                  {isMalicious ? "⚠" : "✓"}
                </span>

              </div>


              <p className="
                text-sm
                text-slate-500
                mt-3
              ">
                Phishing URL classification model.
              </p>

            </div>

          </div>


          {/* Security Findings */}

          <div className="mt-8">

            <div className="
              flex
              items-center
              justify-between
              mb-4
            ">

              <h3 className="
                font-semibold
                text-lg
              ">
                Security Findings
              </h3>


              <span className="
                text-xs
                text-slate-600
              ">
                {result?.reasons?.length || 0} indicators
              </span>

            </div>


            {result?.reasons?.length > 0 ? (

              <div className="space-y-2">

                {result.reasons.map(
                  (reason, index) => (

                    <div
                      key={index}
                      className="
                        flex
                        items-start
                        gap-3
                        rounded-lg
                        bg-slate-950/50
                        border border-slate-800
                        p-4
                        hover:border-cyan-400/20
                        transition-all
                        duration-300
                      "
                    >

                      <span className="
                        text-cyan-400
                        mt-0.5
                        font-bold
                      ">
                        ›
                      </span>


                      <span className="
                        text-sm
                        text-slate-300
                      ">
                        {reason}
                      </span>

                    </div>

                  )
                )}

              </div>

            ) : (

              <div className="
                text-slate-500
                text-sm
              ">
                No findings available.
              </div>

            )}

          </div>

        </div>

      </div>

    </section>
  );
}

export default ResultCard;