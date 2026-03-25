import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";
import PageLoader from "./components/PageLoader";

/* ── helpers ── */
const getSavedRole = () => localStorage.getItem("role");
const isAdminRole = (r) => r === "admin" || r === "super_admin";
const hasToken = () => !!localStorage.getItem("token");

/* ── حماية المسارات ── */
const PrivateRoute = ({ children }) => {
  return hasToken() ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  if (!hasToken()) return <Navigate to="/login" replace />;
  return isAdminRole(getSavedRole())
    ? children
    : <Navigate to="/dashboard" replace />;
};

function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");

  /* ── بعد تسجيل الدخول ── */
  const handleLoginSuccess = async () => {
    setLoadingMsg("Securing your workspace…");
    setLoading(true);

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

      setTimeout(() => {
        setLoading(false);
        navigate(isAdminRole(role) ? "/admin" : "/dashboard");
      }, 1500);
    } catch {
      localStorage.setItem("role", "student");
      setTimeout(() => {
        setLoading(false);
        navigate("/dashboard");
      }, 1500);
    }
  };

  /* ── تسجيل الخروج ── */
  const handleLogout = () => {
    localStorage.removeItem("role");
    setLoadingMsg("Signing you out safely…");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1500);
  };

  if (loading) return <PageLoader message={loadingMsg} />;

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login onSwitch={() => navigate("/register")} onSuccess={handleLoginSuccess} />}
      />
      <Route
        path="/register"
        element={<Register onSwitch={() => navigate("/login")} />}
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard onLogout={handleLogout} />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPanel onLogout={handleLogout} />
          </AdminRoute>
        }
      />

      {/* الصفحة الافتراضية */}
      <Route
        path="/"
        element={
          hasToken()
            ? <Navigate to={isAdminRole(getSavedRole()) ? "/admin" : "/dashboard"} />
            : <Navigate to="/login" />
        }
      />
    </Routes>
  );
}

export default App;