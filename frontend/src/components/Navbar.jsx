function Navbar({ onHome, onHistory, onDashboard }) {
  const navButton =
    "relative px-4 py-2 text-sm font-medium text-slate-400 transition-all duration-300 hover:text-cyan-400 group";

  return (
    <nav className="border-b border-cyan-400/20 bg-[#020617]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <button
          onClick={onHome}
          className="group flex items-center gap-3"
        >
          <span className="w-11 h-11 rounded-xl border border-cyan-400/30 bg-cyan-400/10 flex items-center justify-center text-2xl transition-all duration-300 group-hover:border-cyan-400 group-hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]">
            🛡️
          </span>

          <div className="text-left">
            <div className="text-lg font-black tracking-wide group-hover:text-cyan-400 transition-colors duration-300">
              CyberShield
            </div>

            <div className="text-cyan-400 text-[9px] tracking-[0.3em] font-semibold">
              AI SECURITY
            </div>
          </div>
        </button>

        <div className="flex items-center gap-1">

          <button onClick={onHome} className={navButton}>
            Home
            <span className="absolute left-3 right-3 bottom-0 h-[2px] bg-cyan-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          </button>

          <button onClick={onHistory} className={navButton}>
            History
            <span className="absolute left-3 right-3 bottom-0 h-[2px] bg-cyan-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          </button>

          <button onClick={onDashboard} className={navButton}>
            Dashboard
            <span className="absolute left-3 right-3 bottom-0 h-[2px] bg-cyan-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          </button>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;

