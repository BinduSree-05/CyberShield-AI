import { useState } from "react";
import Home from "./pages/Home";
import History from "./pages/History";
import Dashboard from "./pages/Dashboard";

function App() {
  const [page, setPage] = useState("home");

  if (page === "history") {
    return (
      <History
        onHome={() => setPage("home")}
        onDashboard={() => setPage("dashboard")}
      />
    );
  }

  if (page === "dashboard") {
    return (
      <Dashboard
        onHome={() => setPage("home")}
        onHistory={() => setPage("history")}
      />
    );
  }

  return (
    <Home
      onHistory={() => setPage("history")}
      onDashboard={() => setPage("dashboard")}
    />
  );
}

export default App;