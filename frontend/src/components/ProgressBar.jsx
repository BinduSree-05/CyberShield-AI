function ProgressBar({ score, status }) {

  const numericScore = Number(score);

  const validScore =
    Number.isNaN(numericScore)
      ? 0
      : Math.min(Math.max(numericScore, 0), 100);

  let color = "bg-cyan-400";
  let glow = "shadow-[0_0_25px_rgba(34,211,238,0.5)]";

  if (status === "Safe") {
    color = "bg-emerald-400";
    glow = "shadow-[0_0_25px_rgba(52,211,153,0.5)]";
  }

  if (status === "Suspicious") {
    color = "bg-yellow-400";
    glow = "shadow-[0_0_25px_rgba(250,204,21,0.5)]";
  }

  if (status === "Dangerous") {
    color = "bg-red-400";
    glow = "shadow-[0_0_25px_rgba(248,113,113,0.5)]";
  }

  return (

    <div className="mt-6">

      <div className="flex justify-between items-center mb-3">

        <span className="text-xs uppercase tracking-widest text-slate-500">
          Threat Probability
        </span>

        <span className="text-sm font-semibold text-slate-300">
          {score === "--" ? "--" : `${validScore}%`}
        </span>

      </div>


      <div className="relative h-3 rounded-full bg-slate-800 overflow-hidden">

        <div
          className={`
            h-full
            rounded-full
            ${color}
            ${glow}
            transition-all
            duration-1000
            ease-out
          `}
          style={{
            width: `${validScore}%`
          }}
        />

      </div>


      <div className="flex justify-between mt-2">

        <span className="text-[10px] text-emerald-500/60">
          SAFE
        </span>

        <span className="text-[10px] text-yellow-500/60">
          SUSPICIOUS
        </span>

        <span className="text-[10px] text-red-500/60">
          DANGEROUS
        </span>

      </div>

    </div>
  );
}

export default ProgressBar;