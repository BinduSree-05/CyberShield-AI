function Hero() {
  return (
    <section className="relative overflow-hidden">

      {/* Background glow */}

      <div className="absolute top-0 left-1/2
                      -translate-x-1/2
                      w-[600px] h-[300px]
                      bg-cyan-500/10
                      blur-[120px]
                      rounded-full
                      pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">

        {/* Status */}

        <div className="inline-flex items-center gap-2
                        px-4 py-2
                        rounded-full
                        border border-emerald-400/20
                        bg-emerald-400/5
                        text-emerald-400
                        text-xs
                        tracking-wider
                        uppercase">

          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

          Security Engine Online

        </div>


        {/* Heading */}

        <h1 className="mt-7 text-5xl md:text-7xl font-bold tracking-tight">

          Detect Threats.

          <br />

          <span className="text-cyan-400">
            Before They Harm You.
          </span>

        </h1>


        {/* Description */}

        <p className="max-w-2xl mx-auto mt-6
                      text-lg
                      text-slate-400
                      leading-relaxed">

          CyberShield AI analyzes suspicious URLs using
          <span className="text-slate-200">
            {" "}cybersecurity heuristics
          </span>
          {" "}and
          <span className="text-slate-200">
            {" "}machine learning
          </span>
          {" "}to identify potential threats.

        </p>


        {/* Feature indicators */}

        <div className="flex flex-wrap justify-center gap-3 mt-8">

          <div className="px-4 py-2 rounded-lg
                          bg-slate-900
                          border border-slate-800
                          text-sm text-slate-400">
            ⚡ Real-time Analysis
          </div>

          <div className="px-4 py-2 rounded-lg
                          bg-slate-900
                          border border-slate-800
                          text-sm text-slate-400">
            🧠 ML Detection
          </div>

          <div className="px-4 py-2 rounded-lg
                          bg-slate-900
                          border border-slate-800
                          text-sm text-slate-400">
            🛡️ Threat Scoring
          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;