import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";
import PageLoader from "./components/PageLoader";

/* ── helper: قراءة الـ role من الـ localStorage ── */
const getSavedRole = () => localStorage.getItem("role");

/* ── هل الـ role من مستوى إداري (admin أو super_admin)؟ ── */
const isAdminRole = (r) => r === "admin" || r === "super_admin";

function App() {
  // "login" | "register" | "logging-in" | "dashboard" | "admin" | "logging-out"
  const [page, setPage] = useState(() => {
    if (!localStorage.getItem("token")) return "login";
    return isAdminRole(getSavedRole()) ? "admin" : "dashboard";
  });

  // بعد نجاح اللوغين → loader → Dashboard أو AdminPanel حسب الـ role
  const handleLoginSuccess = async () => {
    setPage("logging-in");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      const role = data?.role ?? "student";
      localStorage.setItem("role", role);
      setTimeout(
        () => setPage(isAdminRole(role) ? "admin" : "dashboard"),
        2000,
      );
    } catch {
      localStorage.setItem("role", "student");
      setTimeout(() => setPage("dashboard"), 2000);
    }
  };

  // بعد الضغط على Logout → loader → Login
  const handleLogout = () => {
    localStorage.removeItem("role");
    setPage("logging-out");
    setTimeout(() => setPage("login"), 2000);
  };

  return (
    <div className="App">
      {page === "logging-in" && (
        <PageLoader message="Securing your workspace…" />
      )}
      {page === "logging-out" && (
        <PageLoader message="Signing you out safely…" />
      )}
      {page === "dashboard" && <Dashboard onLogout={handleLogout} />}
      {page === "admin" && <AdminPanel onLogout={handleLogout} />}
      {page === "login" && (
        <Login
          onSwitch={() => setPage("register")}
          onSuccess={handleLoginSuccess}
        />
      )}
      {page === "register" && <Register onSwitch={() => setPage("login")} />}
    </div>
  );
}

export default App;
