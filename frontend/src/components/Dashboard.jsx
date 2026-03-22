import { useState, useEffect } from "react";
import "../styles/dashboard.css";

/* ─── Icons ─── */
const Ico = {
  Shield: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  User: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  Mail: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Calendar: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  LogOut: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Home: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  File: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  Settings: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Lock: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
};

const NAV_ITEMS = [
  { key: "home", label: "Dashboard", icon: <Ico.Home /> },
  { key: "files", label: "My Files", icon: <Ico.File /> },
  { key: "settings", label: "Settings", icon: <Ico.Settings /> },
];

export default function Dashboard({ onLogout }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [active, setActive] = useState("home");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch("http://127.0.0.1:8000/api/user", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then((r) => {
        if (r.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        return r.json();
      })
      .then((data) => setUser(data))
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    const token = localStorage.getItem("token");
    try {
      await fetch("http://127.0.0.1:8000/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
    } finally {
      localStorage.removeItem("token");
      setLoggingOut(false);
      onLogout?.();
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const joined = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="db-wrap">
      {/* Sidebar */}
      <aside className="db-sidebar">
        <div className="db-logo">
          <div className="db-logo-icon">
            <Ico.Shield />
          </div>
          <span className="db-logo-name">SecureVault</span>
        </div>

        <nav className="db-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`db-nav-item${active === item.key ? " active" : ""}`}
              onClick={() => setActive(item.key)}
            >
              <span className="db-nav-icon">{item.icon}</span>
              <span className="db-nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="db-sidebar-footer">
          <div className="db-mini-avatar">{initials}</div>
          <div className="db-mini-info">
            <div className="db-mini-name">{user?.name ?? "…"}</div>
            <div className="db-mini-role">Member</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="db-main">
        <header className="db-header">
          <div className="db-header-left">
            <h1 className="db-header-title">
              {active === "home" && "Overview"}
              {active === "files" && "My Files"}
              {active === "settings" && "Settings"}
            </h1>
            <p className="db-header-sub">
              {active === "home" && "Welcome back to your secure workspace."}
              {active === "files" && "All your encrypted files in one place."}
              {active === "settings" && "Manage your account preferences."}
            </p>
          </div>
          <button
            className="db-logout-btn"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <span className="db-spinner" />
            ) : (
              <>
                <Ico.LogOut />
                <span>Logout</span>
              </>
            )}
          </button>
        </header>

        <div className="db-content">
          {loading && (
            <div className="db-loading">
              <span className="db-spinner large" />
              <p>Loading your profile…</p>
            </div>
          )}

          {error && !loading && <div className="db-error-box">{error}</div>}

          {!loading && !error && active === "home" && (
            <>
              <div className="db-profile-card">
                <div className="db-profile-avatar">{initials}</div>
                <div className="db-profile-info">
                  <h2 className="db-profile-name">{user?.name}</h2>
                  <div className="db-profile-fields">
                    <div className="db-pf-row">
                      <span className="db-pf-icon">
                        <Ico.Mail />
                      </span>
                      <span className="db-pf-val">{user?.email}</span>
                    </div>
                    <div className="db-pf-row">
                      <span className="db-pf-icon">
                        <Ico.Calendar />
                      </span>
                      <span className="db-pf-val">Joined {joined}</span>
                    </div>
                    <div className="db-pf-row">
                      <span className="db-pf-icon">
                        <Ico.Lock />
                      </span>
                      <span className="db-pf-val">AES-256 Protected</span>
                    </div>
                  </div>
                </div>
                <div className="db-profile-badge">
                  <div className="db-pb-icon">
                    <Ico.Shield />
                  </div>
                  <span>Secure</span>
                </div>
              </div>

              <div className="db-cards">
                {[
                  {
                    label: "Account Status",
                    value: "Active",
                    color: "#22c55e",
                  },
                  { label: "Encryption", value: "AES-256", color: "#6366f1" },
                  { label: "Audit Logs", value: "Enabled", color: "#f59e0b" },
                ].map((c) => (
                  <div className="db-card" key={c.label}>
                    <div
                      className="db-card-dot"
                      style={{ background: c.color }}
                    />
                    <div className="db-card-label">{c.label}</div>
                    <div className="db-card-value" style={{ color: c.color }}>
                      {c.value}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && !error && active === "files" && (
            <div className="db-empty-state">
              <div className="db-empty-icon">
                <Ico.File />
              </div>
              <h3>No files yet</h3>
              <p>Upload your first encrypted file to get started.</p>
              <button className="db-upload-btn">Upload File</button>
            </div>
          )}

          {!loading && !error && active === "settings" && (
            <div className="db-empty-state">
              <div className="db-empty-icon">
                <Ico.Settings />
              </div>
              <h3>Settings</h3>
              <p>Account settings coming soon.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
