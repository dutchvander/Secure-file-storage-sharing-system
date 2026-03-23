import { useState, useEffect } from "react";
import "../styles/dashboard.css";

const API = "http://127.0.0.1:8000/api";

/* ═══════════════════════════════════════
   ICONS
═══════════════════════════════════════ */
const Ico = {
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  Mail: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  LogOut: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Home: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  File: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Eye: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  Badge: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  ),
};

/* ═══════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════ */
const NAV_ITEMS = [
  { key: "home",     label: "Dashboard", icon: <Ico.Home /> },
  { key: "files",    label: "My Files",  icon: <Ico.File /> },
  { key: "settings", label: "Settings",  icon: <Ico.Settings /> },
];

const ROLE_META = {
  student:     { label: "Student",     color: "#6366f1", bg: "rgba(99,102,241,0.08)",  border: "rgba(99,102,241,0.2)"  },
  professor:   { label: "Professor",   color: "#0ea5e9", bg: "rgba(14,165,233,0.08)",  border: "rgba(14,165,233,0.2)"  },
  admin:       { label: "Admin",       color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.2)"  },
  super_admin: { label: "Super Admin", color: "#ef4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.2)"   },
};

/* ═══════════════════════════════════════
   SHARED HELPERS
═══════════════════════════════════════ */
function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function authHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

/* ── Alert Banner ── */
function Alert({ type, msg, onClose }) {
  if (!msg) return null;
  const ok = type === "success";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "12px 16px", borderRadius: 10,
      background: ok ? "#f0fdf4" : "#fef2f2",
      border: `1px solid ${ok ? "#bbf7d0" : "#fecaca"}`,
      color: ok ? "#166534" : "#991b1b",
      fontSize: 13.5, fontWeight: 500,
      animation: "ssFadeIn .3s ease",
    }}>
      <span style={{ width: 15, height: 15, flexShrink: 0 }}>{ok ? <Ico.Check /> : "⚠"}</span>
      <span style={{ flex: 1 }}>{msg}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "inherit", opacity: .5, lineHeight: 1 }}>×</button>
    </div>
  );
}

/* ── Password Input ── */
function PwInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={inputSt}
      />
      <button type="button" onClick={() => setShow((s) => !s)}
        style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", width: 17, height: 17, padding: 0 }}>
        {show ? <Ico.EyeOff /> : <Ico.Eye />}
      </button>
    </div>
  );
}

/* ── Shared inline styles ── */
const inputSt = {
  width: "100%", boxSizing: "border-box",
  padding: "11px 14px", borderRadius: 10,
  border: "1.5px solid #e5e7eb", background: "#fafafa",
  fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "#111827",
  outline: "none", transition: "border-color .18s, box-shadow .18s",
};
const labelSt = {
  display: "block", fontSize: 12, fontWeight: 600,
  color: "#6b7280", textTransform: "uppercase",
  letterSpacing: ".07em", marginBottom: 7,
};
const cardSt = {
  background: "#fff", border: "1.5px solid #e5e7eb",
  borderRadius: 16, overflow: "hidden",
  boxShadow: "0 1px 6px rgba(0,0,0,.04)",
};
const cardHeadSt = {
  padding: "18px 26px 16px",
  borderBottom: "1px solid #f3f4f6",
  display: "flex", alignItems: "center", gap: 10,
};
const cardBodySt = { padding: "22px 26px" };
const saveBtnSt = {
  display: "inline-flex", alignItems: "center", gap: 7,
  padding: "10px 22px", borderRadius: 10, border: "none",
  background: "linear-gradient(135deg,#4f46e5,#6366f1,#7c3aed)",
  color: "#fff", fontFamily: "'Outfit',sans-serif",
  fontSize: 13.5, fontWeight: 600, cursor: "pointer",
  boxShadow: "0 4px 14px rgba(99,102,241,.32)",
  transition: "opacity .2s, transform .15s",
};

/* ═══════════════════════════════════════
   SETTINGS PAGE
═══════════════════════════════════════ */
function SettingsPage({ user, onUserUpdate }) {
  const [name, setName]           = useState(user?.name || "");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameAlert, setNameAlert] = useState({ type: "", msg: "" });

  const [curPw, setCurPw]   = useState("");
  const [newPw, setNewPw]   = useState("");
  const [conPw, setConPw]   = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwAlert, setPwAlert]     = useState({ type: "", msg: "" });

  const roleMeta = ROLE_META[user?.role] || ROLE_META.student;
  const initials = getInitials(user?.name);

  /* ── Update name ── */
  const saveName = async () => {
    if (!name.trim() || name.trim() === user?.name) return;
    setNameLoading(true);
    setNameAlert({ type: "", msg: "" });
    try {
      const res = await fetch(`${API}/settings/name`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      onUserUpdate(data.user);
      setNameAlert({ type: "success", msg: "Name updated successfully!" });
    } catch (e) {
      setNameAlert({ type: "error", msg: e.message });
    } finally {
      setNameLoading(false);
    }
  };

  /* ── Update password ── */
  const savePw = async () => {
    if (!curPw || !newPw || !conPw) {
      setPwAlert({ type: "error", msg: "Please fill in all fields." }); return;
    }
    if (newPw !== conPw) {
      setPwAlert({ type: "error", msg: "New passwords do not match." }); return;
    }
    if (newPw.length < 8) {
      setPwAlert({ type: "error", msg: "Password must be at least 8 characters." }); return;
    }
    setPwLoading(true);
    setPwAlert({ type: "", msg: "" });
    try {
      const res = await fetch(`${API}/settings/password`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          current_password: curPw,
          password: newPw,
          password_confirmation: conPw,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      setPwAlert({ type: "success", msg: "Password changed successfully!" });
      setCurPw(""); setNewPw(""); setConPw("");
    } catch (e) {
      setPwAlert({ type: "error", msg: e.message });
    } finally {
      setPwLoading(false);
    }
  };

  const pwStrength = newPw.length >= 12 ? 2 : newPw.length >= 8 ? 1 : 0;
  const pwColors   = ["#ef4444", "#f59e0b", "#22c55e"];
  const pwLabels   = ["Weak", "Fair", "Strong"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "ssFadeIn .4s ease" }}>

      {/* ── Account Info ── */}
      <div style={cardSt}>
        <div style={{ height: 3, background: "linear-gradient(90deg,#4f46e5,#6366f1,#10b981)" }} />
        <div style={cardHeadSt}>
          <span style={{ width: 17, height: 17, color: "#6366f1" }}><Ico.Badge /></span>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>
            Account Information
          </h3>
        </div>
        <div style={{ ...cardBodySt, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{
            width: 58, height: 58, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg,#6366f1,#10b981)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 700, color: "#fff",
            boxShadow: "0 0 0 4px rgba(99,102,241,.12)",
          }}>{initials}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 14, height: 14, color: "#6366f1" }}><Ico.Mail /></span>
              <span style={{ fontSize: 13.5, color: "#374151", fontWeight: 500 }}>{user?.email}</span>
              <span style={{ fontSize: 11, color: "#9ca3af", background: "#f3f4f6", padding: "2px 8px", borderRadius: 6 }}>read-only</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 14, height: 14, color: roleMeta.color }}><Ico.Shield /></span>
              <span style={{
                padding: "3px 12px", borderRadius: 20,
                background: roleMeta.bg, border: `1px solid ${roleMeta.border}`,
                color: roleMeta.color, fontSize: 12, fontWeight: 600,
              }}>{roleMeta.label}</span>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>assigned by admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Update Name ── */}
      <div style={cardSt}>
        <div style={cardHeadSt}>
          <span style={{ width: 17, height: 17, color: "#6366f1" }}><Ico.User /></span>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>Display Name</h3>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "2px 0 0" }}>Update how your name appears across the platform</p>
          </div>
        </div>
        <div style={cardBodySt}>
          {nameAlert.msg && <><Alert type={nameAlert.type} msg={nameAlert.msg} onClose={() => setNameAlert({ type: "", msg: "" })} /><div style={{ height: 14 }} /></>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "end" }}>
            <div>
              <label style={labelSt}>Full Name</label>
              <input
                style={inputSt}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                onKeyDown={(e) => e.key === "Enter" && saveName()}
              />
            </div>
            <button
              style={{ ...saveBtnSt, opacity: (nameLoading || !name.trim() || name.trim() === user?.name) ? .5 : 1 }}
              onClick={saveName}
              disabled={nameLoading || !name.trim() || name.trim() === user?.name}
            >
              {nameLoading
                ? <span className="db-spinner" />
                : <><span style={{ width: 13, height: 13 }}><Ico.Check /></span> Save</>}
            </button>
          </div>
          {name.trim() && name.trim() !== user?.name && (
            <p style={{ fontSize: 12, color: "#6366f1", marginTop: 8, fontStyle: "italic" }}>
              Preview: <strong>{name.trim()}</strong>
            </p>
          )}
        </div>
      </div>

      {/* ── Change Password ── */}
      <div style={cardSt}>
        <div style={cardHeadSt}>
          <span style={{ width: 17, height: 17, color: "#6366f1" }}><Ico.Lock /></span>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>Change Password</h3>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "2px 0 0" }}>Use a strong password of at least 8 characters</p>
          </div>
        </div>
        <div style={cardBodySt}>
          {pwAlert.msg && <><Alert type={pwAlert.type} msg={pwAlert.msg} onClose={() => setPwAlert({ type: "", msg: "" })} /><div style={{ height: 14 }} /></>}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelSt}>Current Password</label>
              <PwInput value={curPw} onChange={(e) => setCurPw(e.target.value)} placeholder="Enter current password" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={labelSt}>New Password</label>
                <PwInput value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="At least 8 characters" />
              </div>
              <div>
                <label style={labelSt}>Confirm New Password</label>
                <PwInput value={conPw} onChange={(e) => setConPw(e.target.value)} placeholder="Repeat new password" />
              </div>
            </div>

            {/* Strength bar */}
            {newPw && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{
                    height: 4, flex: 1, borderRadius: 4,
                    background: i <= pwStrength ? pwColors[pwStrength] : "#e5e7eb",
                    transition: "background .3s",
                  }} />
                ))}
                <span style={{ fontSize: 11.5, color: "#6b7280", whiteSpace: "nowrap" }}>{pwLabels[pwStrength]}</span>
              </div>
            )}

            {/* Match indicator */}
            {conPw && newPw && (
              <p style={{ fontSize: 12, margin: 0, color: newPw === conPw ? "#16a34a" : "#dc2626" }}>
                {newPw === conPw ? "✓ Passwords match" : "✗ Passwords do not match"}
              </p>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button style={{ ...saveBtnSt, opacity: pwLoading ? .5 : 1 }} onClick={savePw} disabled={pwLoading}>
                {pwLoading
                  ? <span className="db-spinner" />
                  : <><span style={{ width: 13, height: 13 }}><Ico.Lock /></span> Update Password</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════ */
export default function Dashboard({ onLogout }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [active, setActive]   = useState("home");
  const [loggingOut, setLoggingOut] = useState(false);

  /* ── Fetch user ── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/login"; return; }

    fetch(`${API}/user`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then((r) => {
        if (r.status === 401) { localStorage.removeItem("token"); window.location.href = "/login"; return; }
        return r.json();
      })
      .then((data) => setUser(data))
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  /* ── Logout ── */
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch(`${API}/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, Accept: "application/json" },
      });
    } finally {
      localStorage.removeItem("token");
      setLoggingOut(false);
      onLogout?.();
    }
  };

  const initials = getInitials(user?.name);
  const joined   = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  return (
    <>
      <style>{`
        @keyframes ssFadeIn { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
        .settings-input-focus:focus { border-color:#6366f1 !important; box-shadow:0 0 0 3px rgba(99,102,241,.1) !important; background:#fff !important; }
        .ss-save-hover:hover:not(:disabled) { opacity:.88 !important; transform:translateY(-1px) !important; }
      `}</style>

      <div className="db-wrap">
        {/* ── Sidebar ── */}
        <aside className="db-sidebar">
          <div className="db-logo">
            <div className="db-logo-icon"><Ico.Shield /></div>
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
              <div className="db-mini-role">{ROLE_META[user?.role]?.label || "Member"}</div>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="db-main">
          <header className="db-header">
            <div className="db-header-left">
              <h1 className="db-header-title">
                {active === "home"     && "Overview"}
                {active === "files"    && "My Files"}
                {active === "settings" && "Settings"}
              </h1>
              <p className="db-header-sub">
                {active === "home"     && "Welcome back to your secure workspace."}
                {active === "files"    && "All your encrypted files in one place."}
                {active === "settings" && "Manage your account preferences."}
              </p>
            </div>
            <button className="db-logout-btn" onClick={handleLogout} disabled={loggingOut}>
              {loggingOut ? <span className="db-spinner" /> : <><Ico.LogOut /><span>Logout</span></>}
            </button>
          </header>

          <div className="db-content">
            {loading && (
              <div className="db-loading">
                <span className="db-spinner large" /><p>Loading your profile…</p>
              </div>
            )}

            {error && !loading && <div className="db-error-box">{error}</div>}

            {/* ── HOME ── */}
            {!loading && !error && active === "home" && (
              <>
                <div className="db-profile-card">
                  <div className="db-profile-avatar">{initials}</div>
                  <div className="db-profile-info">
                    <h2 className="db-profile-name">{user?.name}</h2>
                    <div className="db-profile-fields">
                      <div className="db-pf-row">
                        <span className="db-pf-icon"><Ico.Mail /></span>
                        <span className="db-pf-val">{user?.email}</span>
                      </div>
                      <div className="db-pf-row">
                        <span className="db-pf-icon"><Ico.Calendar /></span>
                        <span className="db-pf-val">Joined {joined}</span>
                      </div>
                      <div className="db-pf-row">
                        <span className="db-pf-icon"><Ico.Lock /></span>
                        <span className="db-pf-val">AES-256 Protected</span>
                      </div>
                    </div>
                  </div>
                  <div className="db-profile-badge">
                    <div className="db-pb-icon"><Ico.Shield /></div>
                    <span>Secure</span>
                  </div>
                </div>

                <div className="db-cards">
                  {[
                    { label: "Account Status", value: "Active",   color: "#22c55e" },
                    { label: "Encryption",     value: "AES-256",  color: "#6366f1" },
                    { label: "Audit Logs",     value: "Enabled",  color: "#f59e0b" },
                  ].map((c) => (
                    <div className="db-card" key={c.label}>
                      <div className="db-card-dot" style={{ background: c.color }} />
                      <div className="db-card-label">{c.label}</div>
                      <div className="db-card-value" style={{ color: c.color }}>{c.value}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── FILES ── */}
            {!loading && !error && active === "files" && (
              <div className="db-empty-state">
                <div className="db-empty-icon"><Ico.File /></div>
                <h3>No files yet</h3>
                <p>Upload your first encrypted file to get started.</p>
                <button className="db-upload-btn">Upload File</button>
              </div>
            )}

            {/* ── SETTINGS ── */}
            {!loading && !error && active === "settings" && (
              <SettingsPage
                user={user}
                onUserUpdate={(updatedUser) => setUser(updatedUser)}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
}