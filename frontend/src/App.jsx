// App.jsx
import { useState } from "react";
import Login      from "./components/Login";
import Register   from "./components/Register";
import Dashboard  from "./components/Dashboard";
import PageLoader from "./components/PageLoader";

function App() {
  // "login" | "register" | "logging-in" | "dashboard" | "logging-out"
  const [page, setPage] = useState(
    localStorage.getItem("token") ? "dashboard" : "login"
  );

  // بعد نجاح اللوغين → loader → Dashboard
  const handleLoginSuccess = () => {
    setPage("logging-in");
    setTimeout(() => setPage("dashboard"), 2000);
  };

  // بعد الضغط على Logout → loader → Login
  const handleLogout = () => {
    setPage("logging-out");
    setTimeout(() => setPage("login"), 2000);
  };

  return (
    <div className="App">
      {page === "logging-in"  && <PageLoader message="Securing your workspace…" />}
      {page === "logging-out" && <PageLoader message="Signing you out safely…"  />}
      {page === "dashboard"   && <Dashboard  onLogout={handleLogout} />}
      {page === "login"       && <Login      onSwitch={() => setPage("register")} onSuccess={handleLoginSuccess} />}
      {page === "register"    && <Register   onSwitch={() => setPage("login")} />}
    </div>
  );
}

export default App;