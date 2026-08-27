import { useState } from "react";

function UrlInput({ onAnalyze, loading }) {

  const [url, setUrl] = useState("");

  const handleSubmit = () => {

    if (!url.trim()) {
      alert("Please enter a URL");
      return;
    }

    onAnalyze(url.trim());
  };

  return (

    <section className="max-w-4xl mx-auto px-6">

      <div className="
        relative
        rounded-2xl
        border border-cyan-400/20
        bg-slate-900/80
        backdrop-blur-xl
        p-2
        rounded-2xl
        border border-cyan-400/20
        bg-slate-900/80
        backdrop-blur-xl
        p-2
        scanner-pulse
        shadow-[0_0_40px_rgba(34,211,238,0.06)]
        focus-within:border-cyan-400/50
        focus-within:shadow-[0_0_40px_rgba(34,211,238,0.12)]
        transition-all duration-500
      ">

        <div className="flex flex-col md:flex-row gap-2">

          <div className="flex-1 flex items-center">

            <span className="pl-4 text-cyan-400">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Enter a suspicious URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  handleSubmit();
                }
              }}
              disabled={loading}
              className="
                w-full
                px-4
                py-4
                bg-transparent
                outline-none
                text-white
                placeholder:text-slate-600
              "
            />

          </div>


          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              md:w-48
              py-4
              rounded-xl
              bg-cyan-400
              text-slate-950
              font-bold
              hover:bg-cyan-300
              disabled:opacity-60
              disabled:cursor-not-allowed
              shadow-[0_0_20px_rgba(34,211,238,0.15)]
              hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]
              transition-all
              duration-300
            "
          >

            {loading ? (

              <span className="flex items-center justify-center gap-2">

                <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />

                Scanning...

              </span>

            ) : (

              "Analyze URL →"

            )}

          </button>

        </div>

      </div>


      <p className="text-center text-xs text-slate-600 mt-4">
        Analysis combines rule-based security heuristics with machine learning.
      </p>

    </section>
  );
}

export default UrlInput;