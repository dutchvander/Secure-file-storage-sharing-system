import { useState, useEffect, useMemo } from "react";
import "../styles/admin.css";
import AlertsList from "./AlertsList";

/* ═══════════════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════════════ */
const Ico = {
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  LayoutDashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  LogOut: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  LogIn: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  ),
  UserPlus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  ),
  AlertOctagon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
      <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Ban: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  CheckCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  UserCheck: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" />
    </svg>
  ),
  UserEdit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" /><path d="M23 11l-6 6M20 8l3 3" />
    </svg>
  ),
  GraduationCap: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  ),
  ShieldCheck: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  Crown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h20M4 20L2 8l6 4 4-6 4 6 6-4-2 12" />
    </svg>
  ),
  FileText: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  XCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  RefreshCw: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  Upload: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  Download: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Share2: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  Eye: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  BellAlert: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      <line x1="12" y1="2" x2="12" y2="4" />
    </svg>
  ),
  Virus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  ),
};

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════ */
const API = "http://127.0.0.1:8000/api";
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  Accept: "application/json",
  "Content-Type": "application/json",
});

const initials = (name = "") =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

const avatarColor = (role) => {
  if (role === "super_admin") return "linear-gradient(135deg,#7c3aed,#4f46e5)";
  if (role === "admin")       return "linear-gradient(135deg,#ef4444,#dc2626)";
  if (role === "professor")   return "linear-gradient(135deg,#f59e0b,#d97706)";
  return "linear-gradient(135deg,#6366f1,#10b981)";
};

const ROLE_LABEL = {
  student: "Student", professor: "Professor",
  admin: "Admin", super_admin: "Super Admin",
};

const PAGE_SIZE = 8;

const NAV = [
  { key: "overview", label: "Overview",      icon: <Ico.LayoutDashboard /> },
  { key: "users",    label: "Users",          icon: <Ico.Users /> },
  { key: "logs",     label: "Audit Logs",     icon: <Ico.FileText /> },
  { key: "attacks",  label: "Attack Logs",    icon: <Ico.AlertOctagon /> },
  { key: "alerts",   label: "Alerts",         icon: <Ico.BellAlert /> },
];

const ROLES_FOR = {
  super_admin: [
    { value: "student",   label: "Student",   color: "#0ea5e9" },
    { value: "professor", label: "Professor", color: "#f59e0b" },
    { value: "admin",     label: "Admin",     color: "#ef4444" },
  ],
  admin: [
    { value: "student",   label: "Student",   color: "#0ea5e9" },
    { value: "professor", label: "Professor", color: "#f59e0b" },
  ],
};

const ACTION_META = {
  upload_file:               { label: "Upload",           color: "#6366f1", bg: "rgba(99,102,241,.08)",  icon: <Ico.Upload /> },
  download_file:             { label: "Download",         color: "#059669", bg: "rgba(5,150,105,.08)",   icon: <Ico.Download /> },
  delete_file:               { label: "Delete File",      color: "#dc2626", bg: "rgba(220,38,38,.08)",   icon: <Ico.Trash /> },
  share_file:                { label: "Share",            color: "#f59e0b", bg: "rgba(245,158,11,.08)",  icon: <Ico.Share2 /> },
  revoke_share:              { label: "Revoke",           color: "#6b7280", bg: "rgba(107,114,128,.08)", icon: <Ico.XCircle /> },
  scan_file:                 { label: "Malware Scan",     color: "#6366f1", bg: "rgba(99,102,241,.08)",  icon: <Ico.ShieldCheck /> },
  scan_infected:             { label: "Virus Blocked",    color: "#dc2626", bg: "rgba(220,38,38,.12)",   icon: <Ico.Virus /> },
  unauthorized_share_attempt:{ label: "Unauthorized Share",color:"#b45309", bg: "rgba(180,83,9,.1)",     icon: <Ico.Ban /> },
  login:                     { label: "Login",            color: "#0ea5e9", bg: "rgba(14,165,233,.08)",  icon: <Ico.LogIn /> },
  logout:                    { label: "Logout",           color: "#8b5cf6", bg: "rgba(139,92,246,.08)",  icon: <Ico.LogOut /> },
  register:                  { label: "Register",         color: "#10b981", bg: "rgba(16,185,129,.08)",  icon: <Ico.UserPlus /> },
  login_failed:              { label: "Login Failed",     color: "#ef4444", bg: "rgba(239,68,68,.08)",   icon: <Ico.AlertOctagon /> },
  login_blocked:             { label: "Blocked",          color: "#b45309", bg: "rgba(180,83,9,.08)",    icon: <Ico.Ban /> },
  LOGIN:                     { label: "Login",            color: "#0ea5e9", bg: "rgba(14,165,233,.08)",  icon: <Ico.LogIn /> },
  LOGOUT:                    { label: "Logout",           color: "#8b5cf6", bg: "rgba(139,92,246,.08)",  icon: <Ico.LogOut /> },
  REGISTER:                  { label: "Register",         color: "#10b981", bg: "rgba(16,185,129,.08)",  icon: <Ico.UserPlus /> },
  LOGIN_FAILED:              { label: "Login Failed",     color: "#ef4444", bg: "rgba(239,68,68,.08)",   icon: <Ico.AlertOctagon /> },
};

const getActionMeta = (action) =>
  ACTION_META[action] ?? { label: action, color: "#6b7280", bg: "rgba(107,114,128,.08)", icon: <Ico.FileText /> };

const ACTION_FILTERS = [
  { key: "all",                      label: "All" },
  { key: "login",                    label: "Login" },
  { key: "logout",                   label: "Logout" },
  { key: "register",                 label: "Register" },
  { key: "login_failed",             label: "Failed Login" },
  { key: "login_blocked",            label: "Blocked" },
  { key: "upload_file",              label: "Upload" },
  { key: "download_file",            label: "Download" },
  { key: "delete_file",              label: "Delete" },
  { key: "share_file",               label: "Share" },
  { key: "revoke_share",             label: "Revoke" },
  { key: "scan_file",                label: "Scan" },
  { key: "scan_infected",            label: "Virus" },
  { key: "unauthorized_share_attempt", label: "Unauth. Share" },
];

/* ═══════════════════════════════════════════════════════════════
   TOAST  ← MODIFICATION 3 : durée 5s + support type "danger"
═══════════════════════════════════════════════════════════════ */
function Toast({ toast, onDone }) {
  useEffect(() => {
    if (!toast) return;
    // 5 secondes pour laisser l'admin lire l'IP et le type d'attaque
    const t = setTimeout(onDone, 5000);
    return () => clearTimeout(t);
  }, [toast, onDone]);

  if (!toast) return null;

  const isDanger = toast.type === "danger";

  return (
    <div
      className={`ad-toast ${toast.type}`}
      style={isDanger ? {
        background: "#dc2626",
        border: "1.5px solid #b91c1c",
        color: "#ffffff",
        boxShadow: "0 4px 24px rgba(220,38,38,0.5)",
      } : {}}
    >
      {isDanger ? (
        <span style={{ fontSize: "18px" }}>⚠️</span>
      ) : toast.type === "success" ? (
        <Ico.CheckCircle />
      ) : (
        <Ico.XCircle />
      )}
      <span style={{ fontWeight: "600" }}>{toast.msg}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DELETE MODAL
═══════════════════════════════════════════════════════════════ */
function DeleteModal({ user, onCancel, onConfirm, loading }) {
  if (!user) return null;
  return (
    <div className="ad-modal-overlay" onClick={onCancel}>
      <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ad-modal-icon"><Ico.AlertTriangle /></div>
        <h2 className="ad-modal-title">Delete User</h2>
        <p className="ad-modal-desc">
          You are about to permanently delete <strong>{user.name}</strong>. This action cannot be undone.
        </p>
        <div className="ad-modal-actions">
          <button className="ad-modal-cancel" onClick={onCancel} disabled={loading}>Cancel</button>
          <button className="ad-modal-confirm" onClick={onConfirm} disabled={loading}>
            {loading ? <span className="ad-spinner" /> : <><Ico.Trash /> Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   UPDATE ROLE MODAL
═══════════════════════════════════════════════════════════════ */
function UpdateRoleModal({ user, viewerRole, onCancel, onConfirm, loading }) {
  const [selected, setSelected] = useState(user?.role ?? "student");
  if (!user) return null;
  const options = ROLES_FOR[viewerRole] ?? ROLES_FOR.admin;
  const isLocked = !options.some((o) => o.value === user.role);
  return (
    <div className="ad-modal-overlay" onClick={onCancel}>
      <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ad-modal-icon ad-modal-icon--indigo"><Ico.UserEdit /></div>
        <h2 className="ad-modal-title">Update Role</h2>
        <p className="ad-modal-desc">Change the role for <strong>{user.name}</strong>.</p>
        {isLocked ? (
          <div className="ad-role-locked">
            <span className="ad-role-locked-icon"><Ico.Lock /></span>
            <div>
              <p className="ad-role-locked-title">Permission restricted</p>
              <p className="ad-role-locked-desc">Only a Super Admin can modify a <strong>{ROLE_LABEL[user.role]}</strong>.</p>
            </div>
          </div>
        ) : (
          <div className="ad-role-options">
            {options.map((r) => (
              <button
                key={r.value}
                className={`ad-role-option ${r.value}${selected === r.value ? " selected" : ""}`}
                style={{ "--role-color": r.color }}
                onClick={() => setSelected(r.value)}
              >
                <span className="ad-role-option-dot" />
                <span className="ad-role-option-label">{r.label}</span>
                {selected === r.value && <span className="ad-role-option-check"><Ico.Check /></span>}
              </button>
            ))}
          </div>
        )}
        {viewerRole === "super_admin" && (
          <p className="ad-role-note"><Ico.Crown /> You have full role control as Super Admin.</p>
        )}
        <div className="ad-modal-actions">
          <button className="ad-modal-cancel" onClick={onCancel} disabled={loading}>
            {isLocked ? "Close" : "Cancel"}
          </button>
          {!isLocked && (
            <button
              className="ad-modal-confirm ad-modal-confirm--indigo"
              onClick={() => onConfirm(selected)}
              disabled={loading || selected === user.role}
            >
              {loading ? <span className="ad-spinner" /> : <><Ico.UserEdit /> Update Role</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LOGOUT DIALOG
═══════════════════════════════════════════════════════════════ */
function LogoutDialog({ onCancel, onConfirm, loading }) {
  return (
    <div className="ad-modal-overlay" onClick={onCancel}>
      <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ad-modal-icon"><Ico.LogOut /></div>
        <h2 className="ad-modal-title">Confirm Logout</h2>
        <p className="ad-modal-desc">Are you sure you want to leave the admin panel?</p>
        <div className="ad-modal-actions">
          <button className="ad-modal-cancel" onClick={onCancel} disabled={loading}>Stay</button>
          <button className="ad-modal-confirm" onClick={onConfirm} disabled={loading}>
            {loading ? <span className="ad-spinner" /> : "Yes, Logout"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   OVERVIEW TAB
═══════════════════════════════════════════════════════════════ */
function OverviewTab({ users }) {
  const total      = users.length;
  const students   = users.filter((u) => u.role === "student").length;
  const professors = users.filter((u) => u.role === "professor").length;
  const admins     = users.filter((u) => u.role === "admin" || u.role === "super_admin").length;

  const stats = [
    { label: "Total Users",  value: total,      icon: <Ico.Users />,         color: "#6366f1", bg: "rgba(99,102,241,.08)",  trend: "+12%" },
    { label: "Students",     value: students,   icon: <Ico.GraduationCap />, color: "#0ea5e9", bg: "rgba(14,165,233,.08)",  trend: "+8%"  },
    { label: "Professors",   value: professors, icon: <Ico.UserCheck />,     color: "#f59e0b", bg: "rgba(245,158,11,.08)",  trend: "+3%"  },
    { label: "Admins",       value: admins,     icon: <Ico.ShieldCheck />,   color: "#ef4444", bg: "rgba(239,68,68,.08)",   trend: "stable" },
  ];

  return (
    <>
      <div className="ad-stats">
        {stats.map((s) => (
          <div className="ad-stat" key={s.label} style={{ "--stat-color": s.color, "--stat-bg": s.bg }}>
            <div className="ad-stat-top">
              <div className="ad-stat-icon">{s.icon}</div>
              {s.trend !== "stable" && <span className="ad-stat-trend">{s.trend}</span>}
            </div>
            <div className="ad-stat-value">{s.value}</div>
            <div className="ad-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="ad-table-section">
        <div className="ad-table-header">
          <div>
            <div className="ad-table-title">Recent Registrations</div>
            <div className="ad-table-count">Last 5 users who joined</div>
          </div>
        </div>
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {[...users]
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 5)
                .map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="ad-user-cell">
                        <div className="ad-user-avatar" style={{ background: avatarColor(u.role) }}>{initials(u.name)}</div>
                        <div>
                          <div className="ad-user-name">{u.name}</div>
                          <div className="ad-user-id">ID #{u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: "#6b7280" }}>{u.email}</td>
                    <td>
                      <span className={`ad-role ${u.role}`}>
                        <span className="ad-role-icon" />{ROLE_LABEL[u.role]}
                      </span>
                    </td>
                    <td style={{ color: "#9ca3af", fontSize: "13px" }}>
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                        : "—"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   USERS TAB
═══════════════════════════════════════════════════════════════ */
function UsersTab({ users, viewerRole, onDelete, onUpdate }) {
  const [search, setSearch]         = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage]             = useState(1);

  const filtered = useMemo(
    () => users.filter((u) => {
      const matchRole   = roleFilter === "all" || u.role === roleFilter;
      const matchSearch = !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      return matchRole && matchSearch;
    }),
    [users, search, roleFilter],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const canDelete = (u) => viewerRole === "super_admin" ? u.role !== "super_admin" : u.role === "student" || u.role === "professor";
  const canUpdate = (u) => viewerRole === "super_admin" ? u.role !== "super_admin" : u.role === "student" || u.role === "professor";

  const FILTERS = [
    { key: "all",         label: "All" },
    { key: "student",     label: "Students" },
    { key: "professor",   label: "Professors" },
    { key: "admin",       label: "Admins" },
    ...(viewerRole === "super_admin" ? [{ key: "super_admin", label: "Super Admins" }] : []),
  ];

  return (
    <div className="ad-table-section">
      <div className="ad-table-header">
        <div>
          <div className="ad-table-title">User Management</div>
          <div className="ad-table-count">{filtered.length} user{filtered.length !== 1 ? "s" : ""} found</div>
        </div>
      </div>
      <div className="ad-table-toolbar">
        <div className="ad-search-wrap">
          <span className="ad-search-icon"><Ico.Search /></span>
          <input
            className="ad-search" placeholder="Search by name or email…"
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="ad-filter-pills">
          {FILTERS.map((f) => (
            <button key={f.key} className={`ad-pill ${f.key} ${roleFilter === f.key ? "active" : ""}`}
              onClick={() => { setRoleFilter(f.key); setPage(1); }}>{f.label}</button>
          ))}
        </div>
      </div>
      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead>
            <tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={5}><div className="ad-table-empty"><Ico.Users /><p>No users match your search.</p></div></td></tr>
            ) : paginated.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="ad-user-cell">
                    <div className="ad-user-avatar" style={{ background: avatarColor(u.role) }}>{initials(u.name)}</div>
                    <div>
                      <div className="ad-user-name">
                        {u.name}
                        {u.role === "super_admin" && <span className="ad-crown-badge" title="Super Admin"><Ico.Crown /></span>}
                      </div>
                      <div className="ad-user-id">ID #{u.id}</div>
                    </div>
                  </div>
                </td>
                <td style={{ color: "#6b7280" }}>{u.email}</td>
                <td>
                  <span className={`ad-role ${u.role}`}>
                    <span className="ad-role-icon" />{ROLE_LABEL[u.role]}
                  </span>
                </td>
                <td style={{ color: "#9ca3af", fontSize: "13px" }}>
                  {u.created_at
                    ? new Date(u.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                    : "—"}
                </td>
                <td>
                  <div className="ad-actions-cell">
                    {canUpdate(u) ? (
                      <button className="ad-upd-btn" onClick={() => onUpdate(u)} title="Update role">
                        <Ico.UserEdit /> Update
                      </button>
                    ) : (
                      <span className="ad-action-locked" title="Cannot update this role"><Ico.Lock /></span>
                    )}
                    {canDelete(u) ? (
                      <button className="ad-del-btn" onClick={() => onDelete(u)} title="Delete user">
                        <Ico.Trash /> Delete
                      </button>
                    ) : (
                      <span className="ad-action-locked" title="Cannot delete this role"><Ico.Lock /></span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="ad-pagination">
          <span className="ad-page-info">
            Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="ad-page-btns">
            <button className="ad-page-btn" onClick={() => setPage((p) => p - 1)} disabled={safePage === 1}><Ico.ChevronLeft /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} className={`ad-page-btn${safePage === n ? " active" : ""}`} onClick={() => setPage(n)}>{n}</button>
            ))}
            <button className="ad-page-btn" onClick={() => setPage((p) => p + 1)} disabled={safePage === totalPages}><Ico.ChevronRight /></button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AUDIT LOGS TAB
═══════════════════════════════════════════════════════════════ */
function LogsTab() {
  const [logs, setLogs]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [search, setSearch]           = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [total, setTotal]             = useState(0);

  const fetchLogs = async (p = 1, act = actionFilter, q = search) => {
    setLoading(true); setError(null);
    try {
      const params = new URLSearchParams({ page: p });
      if (act !== "all") params.append("action", act);
      if (q.trim()) params.append("search", q.trim());
      const res = await fetch(`${API}/admin/audit-logs?${params}`, { headers: authHeaders() });
      if (!res.ok) throw new Error("Failed to fetch logs");
      const data = await res.json();
      setLogs(data.logs ?? []); setTotalPages(data.pages ?? 1);
      setTotal(data.total ?? 0); setPage(data.page ?? 1);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLogs(1, "all", ""); }, []);

  return (
    <div className="ad-table-section">
      <div className="ad-table-header">
        <div>
          <div className="ad-table-title">Audit Logs</div>
          <div className="ad-table-count">{total} event{total !== 1 ? "s" : ""} recorded</div>
        </div>
        <button className="ad-refresh-btn" onClick={() => fetchLogs(page, actionFilter, search)} disabled={loading}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 14, height: 14, display: "flex" }}><Ico.RefreshCw /></span>Refresh
          </span>
        </button>
      </div>
      <div className="ad-table-toolbar" style={{ flexWrap: "wrap", gap: 8 }}>
        <div className="ad-search-wrap">
          <span className="ad-search-icon"><Ico.Search /></span>
          <input className="ad-search" placeholder="Search by user or IP…" value={search}
            onChange={(e) => { setSearch(e.target.value); fetchLogs(1, actionFilter, e.target.value); }} />
        </div>
        <div className="ad-filter-pills" style={{ flexWrap: "wrap" }}>
          {ACTION_FILTERS.map((f) => (
            <button key={f.key} className={`ad-pill ${f.key === "all" ? "all" : ""} ${actionFilter === f.key ? "active" : ""}`}
              onClick={() => { setActionFilter(f.key); fetchLogs(1, f.key, search); }}>{f.label}</button>
          ))}
        </div>
      </div>
      <div className="ad-table-wrap">
        {loading ? (
          <div className="ad-loading" style={{ padding: "48px" }}><span className="ad-spinner dark" /><p>Loading logs…</p></div>
        ) : error ? (
          <div className="ad-error-box" style={{ margin: "24px" }}>{error}</div>
        ) : logs.length === 0 ? (
          <div className="ad-table-empty" style={{ padding: "56px" }}><Ico.FileText /><p>No audit logs found.</p></div>
        ) : (
          <table className="ad-table">
            <thead>
              <tr><th>#</th><th>User</th><th>Action</th><th>File</th><th>IP Address</th><th>Date & Time</th></tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => {
                const meta = getActionMeta(log.action);
                return (
                  <tr key={log.id}>
                    <td style={{ color: "#9ca3af", fontSize: "12px" }}>{(page - 1) * 15 + idx + 1}</td>
                    <td>
                      {log.user ? (
                        <div className="ad-user-cell">
                          <div className="ad-user-avatar" style={{ background: avatarColor(log.user.role), width: 30, height: 30, fontSize: 11 }}>
                            {initials(log.user.name)}
                          </div>
                          <div>
                            <div className="ad-user-name" style={{ fontSize: 13 }}>{log.user.name}</div>
                            <div className="ad-user-id">{log.user.email}</div>
                          </div>
                        </div>
                      ) : <span style={{ color: "#9ca3af", fontSize: 13 }}>Unknown / Deleted</span>}
                    </td>
                    <td>
                      <span className="ad-log-action-badge" style={{ background: meta.bg, color: meta.color, borderColor: meta.color + "33" }}>
                        <span style={{ width: 12, height: 12, display: "flex", flexShrink: 0 }}>{meta.icon}</span>
                        {meta.label}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: "#374151", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {log.file?.original_name ?? <span style={{ color: "#d1d5db" }}>—</span>}
                    </td>
                    <td><code className="ad-log-ip">{log.ip_address ?? "—"}</code></td>
                    <td style={{ color: "#9ca3af", fontSize: "12.5px", whiteSpace: "nowrap" }}>
                      {log.created_at
                        ? new Date(log.created_at).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {totalPages > 1 && !loading && (
        <div className="ad-pagination">
          <span className="ad-page-info">Page {page} of {totalPages} · {total} total</span>
          <div className="ad-page-btns">
            <button className="ad-page-btn" onClick={() => fetchLogs(page - 1)} disabled={page === 1}><Ico.ChevronLeft /></button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const n = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i;
              return <button key={n} className={`ad-page-btn${page === n ? " active" : ""}`} onClick={() => fetchLogs(n)}>{n}</button>;
            })}
            <button className="ad-page-btn" onClick={() => fetchLogs(page + 1)} disabled={page === totalPages}><Ico.ChevronRight /></button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ATTACKS TAB
═══════════════════════════════════════════════════════════════ */
const ATTACK_TYPE_FILTERS = [
  { key: "all",           label: "All Types" },
  { key: "XSS",           label: "XSS" },
  { key: "SQLi",          label: "SQLi" },
  { key: "CMDi",          label: "CMD Injection" },
  { key: "PathTraversal", label: "Path Traversal" },
  { key: "FileInclusion", label: "File Inclusion" },
  { key: "Scanner",       label: "Scanner / Bot" },
];
const STATUS_FILTERS = [
  { key: "all",     label: "All" },
  { key: "blocked", label: "Blocked" },
  { key: "allowed", label: "Allowed" },
];
const SOURCE_FILTERS = [
  { key: "all",   label: "All Sources" },
  { key: "rules", label: "Rules" },
  { key: "ai",    label: "AI" },
];
const ATTACK_META = {
  XSS:           { color: "#ef4444", bg: "rgba(239,68,68,.08)",   icon: <Ico.AlertOctagon /> },
  SQLi:          { color: "#f59e0b", bg: "rgba(245,158,11,.08)",  icon: <Ico.AlertTriangle /> },
  CMDi:          { color: "#dc2626", bg: "rgba(220,38,38,.1)",    icon: <Ico.Ban /> },
  PathTraversal: { color: "#b45309", bg: "rgba(180,83,9,.08)",    icon: <Ico.FileText /> },
  FileInclusion: { color: "#7c3aed", bg: "rgba(124,58,237,.08)",  icon: <Ico.Eye /> },
  Scanner:       { color: "#6b7280", bg: "rgba(107,114,128,.08)", icon: <Ico.Search /> },
};
const getAttackMeta = (type) =>
  ATTACK_META[type] ?? { color: "#6b7280", bg: "rgba(107,114,128,.08)", icon: <Ico.FileText /> };

function AttacksTab() {
  const [logs, setLogs]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [search, setSearch]           = useState("");
  const [typeFilter, setTypeFilter]   = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [total, setTotal]             = useState(0);
  const [stats, setStats]             = useState(null);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/admin/attack-logs/stats`, { headers: authHeaders() });
      if (res.ok) setStats(await res.json());
    } catch {}
  };

  const fetchLogs = async (p = 1, type = typeFilter, status = statusFilter, source = sourceFilter, q = search) => {
    setLoading(true); setError(null);
    try {
      const params = new URLSearchParams({ page: p });
      if (type !== "all")   params.append("type", type);
      if (status !== "all") params.append("status", status);
      if (source !== "all") params.append("source", source);
      if (q.trim())         params.append("search", q.trim());
      const res = await fetch(`${API}/admin/attack-logs?${params}`, { headers: authHeaders() });
      if (!res.ok) throw new Error("Failed to fetch attack logs");
      const data = await res.json();
      setLogs(data.logs ?? []); setTotalPages(data.pages ?? 1);
      setTotal(data.total ?? 0); setPage(data.page ?? 1);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStats(); fetchLogs(); }, []);

  return (
    <div className="ad-table-section">
      {stats && (
        <div style={{ display: "flex", gap: 12, padding: "18px 28px", borderBottom: "1px solid #f3f4f6", flexWrap: "wrap" }}>
          {[
            { label: "Total",          value: stats.total,          color: "#6366f1" },
            { label: "Blocked",        value: stats.blocked,        color: "#ef4444" },
            { label: "XSS",            value: stats.xss,            color: "#dc2626" },
            { label: "SQLi",           value: stats.sqli,           color: "#f59e0b" },
            { label: "CMD Injection",  value: stats.cmdi,           color: "#dc2626" },
            { label: "Path Traversal", value: stats.path_traversal, color: "#b45309" },
            { label: "File Inclusion", value: stats.file_inclusion, color: "#7c3aed" },
            { label: "Scanner",        value: stats.scanner,        color: "#6b7280" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#f9fafb", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "10px 18px", textAlign: "center", minWidth: 80 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "'Playfair Display',serif" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}
      <div className="ad-table-header">
        <div>
          <div className="ad-table-title">Attack Logs</div>
          <div className="ad-table-count">{total} attack{total !== 1 ? "s" : ""} recorded</div>
        </div>
        <button className="ad-refresh-btn" onClick={() => { fetchStats(); fetchLogs(page); }} disabled={loading}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 14, height: 14, display: "flex" }}><Ico.RefreshCw /></span>Refresh
          </span>
        </button>
      </div>
      <div className="ad-table-toolbar" style={{ flexWrap: "wrap", gap: 8 }}>
        <div className="ad-search-wrap">
          <span className="ad-search-icon"><Ico.Search /></span>
          <input className="ad-search" placeholder="Search by IP, URL or payload…" value={search}
            onChange={(e) => { setSearch(e.target.value); fetchLogs(1, typeFilter, statusFilter, sourceFilter, e.target.value); }} />
        </div>
        <div className="ad-filter-pills">
          {ATTACK_TYPE_FILTERS.map((f) => (
            <button key={f.key} className={`ad-pill ${typeFilter === f.key ? "active" : ""}`}
              onClick={() => { setTypeFilter(f.key); fetchLogs(1, f.key, statusFilter, sourceFilter, search); }}>{f.label}</button>
          ))}
        </div>
        <div className="ad-filter-pills">
          {STATUS_FILTERS.map((f) => (
            <button key={f.key} className={`ad-pill ${statusFilter === f.key ? "active" : ""}`}
              onClick={() => { setStatusFilter(f.key); fetchLogs(1, typeFilter, f.key, sourceFilter, search); }}>{f.label}</button>
          ))}
        </div>
        <div className="ad-filter-pills">
          {SOURCE_FILTERS.map((f) => (
            <button key={f.key} className={`ad-pill ${sourceFilter === f.key ? "active" : ""}`}
              onClick={() => { setSourceFilter(f.key); fetchLogs(1, typeFilter, statusFilter, f.key, search); }}>{f.label}</button>
          ))}
        </div>
      </div>
      <div className="ad-table-wrap">
        {loading ? (
          <div className="ad-loading" style={{ padding: "48px" }}><span className="ad-spinner dark" /><p>Loading attack logs…</p></div>
        ) : error ? (
          <div className="ad-error-box" style={{ margin: "24px" }}>{error}</div>
        ) : logs.length === 0 ? (
          <div className="ad-table-empty" style={{ padding: "56px" }}><Ico.Shield /><p>No attacks recorded.</p></div>
        ) : (
          <table className="ad-table">
            <thead>
              <tr><th>#</th><th>IP Address</th><th>Type</th><th>Status</th><th>Source</th><th>Score</th><th>Payload</th><th>Date & Time</th></tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => {
                const meta = getAttackMeta(log.type);
                return (
                  <tr key={log.id}>
                    <td style={{ color: "#9ca3af", fontSize: 12 }}>{(page - 1) * 15 + idx + 1}</td>
                    <td><code className="ad-log-ip">{log.ip ?? "—"}</code></td>
                    <td>
                      <span className="ad-log-action-badge" style={{ background: meta.bg, color: meta.color, borderColor: meta.color + "33" }}>
                        <span style={{ width: 12, height: 12, display: "flex", flexShrink: 0 }}>{meta.icon}</span>
                        {log.type}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px",
                        borderRadius: 100, fontSize: 11.5, fontWeight: 600,
                        background: log.status === "blocked" ? "rgba(239,68,68,.08)" : "rgba(16,185,129,.08)",
                        color: log.status === "blocked" ? "#dc2626" : "#059669",
                      }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "currentColor" }} />
                        {log.status === "blocked" ? "Blocked" : "Allowed"}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 6,
                        background: log.source === "ai" ? "rgba(139,92,246,.08)" : "rgba(14,165,233,.08)",
                        color: log.source === "ai" ? "#7c3aed" : "#0284c7",
                      }}>
                        {log.source === "ai" ? "AI" : "Rules"}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: log.score >= 80 ? "#dc2626" : log.score >= 50 ? "#f59e0b" : "#6b7280", fontWeight: 600 }}>
                      {log.score ?? "—"}
                    </td>
                    <td style={{ fontSize: 12, color: "#374151", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4, fontSize: 11 }}>{log.payload ?? "—"}</code>
                    </td>
                    <td style={{ color: "#9ca3af", fontSize: 12.5, whiteSpace: "nowrap" }}>
                      {log.created_at
                        ? new Date(log.created_at).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {totalPages > 1 && !loading && (
        <div className="ad-pagination">
          <span className="ad-page-info">Page {page} of {totalPages} · {total} total</span>
          <div className="ad-page-btns">
            <button className="ad-page-btn" onClick={() => fetchLogs(page - 1)} disabled={page === 1}><Ico.ChevronLeft /></button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const n = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i;
              return <button key={n} className={`ad-page-btn${page === n ? " active" : ""}`} onClick={() => fetchLogs(n)}>{n}</button>;
            })}
            <button className="ad-page-btn" onClick={() => fetchLogs(page + 1)} disabled={page === totalPages}><Ico.ChevronRight /></button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ALERTS TAB
═══════════════════════════════════════════════════════════════ */
const SEVERITY_FILTERS = [
  { key: "all",      label: "All" },
  { key: "critical", label: "Critical" },
  { key: "high",     label: "High" },
  { key: "medium",   label: "Medium" },
  { key: "low",      label: "Low" },
];

function AlertsTab() {
  const [alerts, setAlerts]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [search, setSearch]             = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [total, setTotal]               = useState(0);
  const [stats, setStats]               = useState({
    critical: 0, high: 0, medium: 0, low: 0, malware: 0, waf: 0,
  });

  const fetchAlerts = async (p = 1, sev = severityFilter, q = search) => {
    setLoading(true); setError(null);
    try {
      const params = new URLSearchParams({ page: p });
      if (sev !== "all") params.append("severity", sev);
      if (q.trim())      params.append("search", q.trim());
      const res = await fetch(`${API}/admin/notifications?${params}`, { headers: authHeaders() });
      if (!res.ok) throw new Error("Failed to fetch security notifications");
      const data = await res.json();
      setAlerts(data.notifications ?? []);
      setTotalPages(data.pages ?? 1);
      setTotal(data.total ?? 0);
      setPage(data.page ?? 1);
      if (data.stats) setStats(data.stats);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAlerts(1, "all", ""); }, []);

  return (
    <div className="ad-table-section" style={{
      background: "#0a0e1a",
      border: "1px solid #1f2937",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)"
    }}>

      {/* ── Cyber HUD Summary Metrics ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 12,
        padding: "20px 24px",
        background: "#080c14",
        borderBottom: "1px solid #1f2937"
      }}>
        {[
          { label: "Total Alerts",      value: total,         color: "#38bdf8", shadow: "rgba(56,189,248,0.25)" },
          { label: "Malware Blocked",   value: stats.malware, color: "#ef4444", shadow: "rgba(239,68,68,0.25)",   pulse: stats.malware > 0 },
          { label: "WAF Blocks",        value: stats.waf,     color: "#f59e0b", shadow: "rgba(245,158,11,0.25)" },
          { label: "Critical Anomalies",value: stats.critical,color: "#ec4899", shadow: "rgba(236,72,153,0.25)" },
        ].map((s) => (
          <div key={s.label} style={{
            background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10,
            padding: "14px 18px", boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
            position: "relative", overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "10.5px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</span>
              {s.pulse && <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#ef4444", boxShadow: "0 0 6px #ef4444", display: "inline-block" }} />}
            </div>
            <div style={{ fontSize: "24px", fontWeight: 800, color: s.color, marginTop: 6, fontFamily: "'JetBrains Mono','Fira Code',monospace", textShadow: `0 0 8px ${s.shadow}` }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Cyber Header ── */}
      <div className="ad-table-header" style={{ background: "#0b0f19", borderBottom: "1px solid #1f2937", padding: "18px 24px" }}>
        <div>
          <div className="ad-table-title" style={{ color: "#f8fafc", fontSize: "16px" }}>Threat Intelligence Console</div>
          <div className="ad-table-count" style={{ color: "#64748b", fontSize: "12px" }}>Real-time audit log correlation & perimeter analysis</div>
        </div>
        <button className="ad-refresh-btn"
          style={{ background: "#1e293b", border: "1px solid #334155", color: "#f8fafc", borderRadius: 8, cursor: "pointer", padding: "8px 14px", fontSize: "12.5px" }}
          onClick={() => fetchAlerts(page, severityFilter, search)} disabled={loading}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 14, height: 14, display: "flex" }}><Ico.RefreshCw /></span>Refresh Console
          </span>
        </button>
      </div>

      {/* ── Dark-Themed Toolbar ── */}
      <div className="ad-table-toolbar" style={{ background: "#080c14", borderBottom: "1px solid #1f2937", padding: "12px 24px", display: "flex", flexWrap: "wrap", gap: 12 }}>
        <div className="ad-search-wrap" style={{ maxWidth: 360 }}>
          <span className="ad-search-icon" style={{ color: "#475569" }}><Ico.Search /></span>
          <input className="ad-search"
            style={{ background: "#0f172a", border: "1px solid #1e293b", color: "#f8fafc", outline: "none", boxSizing: "border-box" }}
            placeholder="Search by payload, type or source IP…" value={search}
            onChange={(e) => { setSearch(e.target.value); fetchAlerts(1, severityFilter, e.target.value); }} />
        </div>
        <div className="ad-filter-pills" style={{ display: "flex", gap: 8 }}>
          {SEVERITY_FILTERS.map((f) => (
            <button key={f.key}
              style={{
                height: 36, padding: "0 16px", borderRadius: 8,
                border: severityFilter === f.key ? "1px solid #3b82f6" : "1px solid #1e293b",
                background: severityFilter === f.key ? "rgba(59,130,246,0.15)" : "#0f172a",
                color: severityFilter === f.key ? "#38bdf8" : "#94a3b8",
                fontWeight: 600, fontSize: "12.5px", cursor: "pointer",
                boxShadow: severityFilter === f.key ? "0 0 10px rgba(59,130,246,0.15)" : "none",
                transition: "all 0.2s"
              }}
              onClick={() => { setSeverityFilter(f.key); fetchAlerts(1, f.key, search); }}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: "20px 24px", background: "#0a0e1a" }}>
        {loading ? (
          <div className="ad-loading" style={{ padding: "64px", background: "#0a0e1a", color: "#64748b" }}>
            <span className="ad-spinner dark" style={{ borderColor: "#38bdf8 transparent #38bdf8 transparent" }} />
            <p style={{ marginTop: 12 }}>Syncing threat database...</p>
          </div>
        ) : error ? (
          <div className="ad-error-box" style={{ margin: "0 0 24px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>{error}</div>
        ) : (
          /* ── MODIFICATION 2 : appel correct à <AlertsList alerts={alerts} /> ── */
          <AlertsList alerts={alerts} />
        )}
      </div>

      {/* ── Dark-Themed Pagination ── */}
      {totalPages > 1 && !loading && (
        <div className="ad-pagination" style={{ background: "#080c14", borderTop: "1px solid #1f2937", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="ad-page-info" style={{ color: "#64748b", fontSize: "12.5px" }}>
            Showing telemetry segment {page} of {totalPages} · <span style={{ color: "#94a3b8" }}>{total} matches</span>
          </span>
          <div className="ad-page-btns" style={{ display: "flex", gap: 6 }}>
            <button className="ad-page-btn"
              style={{ background: "#0f172a", border: "1px solid #1e293b", color: "#94a3b8", width: 34, height: 34, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1 }}
              onClick={() => fetchAlerts(page - 1)} disabled={page === 1}><Ico.ChevronLeft /></button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const n = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i;
              const isActive = page === n;
              return (
                <button key={n}
                  style={{ background: isActive ? "rgba(59,130,246,0.15)" : "#0f172a", border: isActive ? "1px solid #3b82f6" : "1px solid #1e293b", color: isActive ? "#38bdf8" : "#94a3b8", fontWeight: 600, width: 34, height: 34, borderRadius: 6, cursor: "pointer", boxShadow: isActive ? "0 0 8px rgba(59,130,246,0.15)" : "none" }}
                  onClick={() => fetchAlerts(n)}>{n}</button>
              );
            })}
            <button className="ad-page-btn"
              style={{ background: "#0f172a", border: "1px solid #1e293b", color: "#94a3b8", width: 34, height: 34, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1 }}
              onClick={() => fetchAlerts(page + 1)} disabled={page === totalPages}><Ico.ChevronRight /></button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN ADMIN PANEL
═══════════════════════════════════════════════════════════════ */
export default function AdminPanel({ onLogout }) {
  const [users, setUsers]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [active, setActive]             = useState("overview");
  const [viewerRole, setViewerRole]     = useState(localStorage.getItem("role") ?? "admin");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [toDelete, setToDelete]         = useState(null);
  const [deleting, setDeleting]         = useState(false);
  const [toUpdate, setToUpdate]         = useState(null);
  const [updating, setUpdating]         = useState(false);
  const [loggingOut, setLoggingOut]     = useState(false);
  const [toast, setToast]               = useState(null);

  /* ── MODIFICATION 1 : state + polling toutes les 8s ── */
  const [lastCheck, setLastCheck] = useState(() => new Date().toISOString());

  useEffect(() => {
    const checkUnreadNotifications = async () => {
      try {
        const res = await fetch(`${API}/admin/notifications/unread?since=${lastCheck}`, {
          headers: authHeaders(),
        });
        if (!res.ok) return;
        const data = await res.json();

        // Mettre à jour le timestamp immédiatement
        setLastCheck(new Date().toISOString());

        if (data.new_alerts && data.new_alerts.length > 0) {
          const latest = data.new_alerts[0];

          setToast({
            type: latest.severity === "critical" || latest.severity === "high" ? "danger" : "success",
            msg: `🚨 Security Alert: ${latest.message}`,
          });

          // Son de notification discret
          const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/951/951-200.wav");
          audio.volume = 0.2;
          audio.play().catch(() => {});
        }
      } catch (e) {
        console.error("SOC Polling error:", e);
      }
    };

    const interval = setInterval(checkUnreadNotifications, 8000);
    return () => clearInterval(interval);
  }, [lastCheck]);
  /* ── fin modification 1 ── */

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/login"; return; }

    fetch(`${API}/user`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((me) => { if (me?.role) { setViewerRole(me.role); localStorage.setItem("role", me.role); } })
      .catch(() => {});

    fetch(`${API}/admin/users`, { headers: authHeaders() })
      .then((r) => {
        if (r.status === 401 || r.status === 403) { localStorage.removeItem("token"); window.location.href = "/login"; return; }
        return r.json();
      })
      .then((data) => setUsers(data?.users ?? data?.data ?? []))
      .catch(() => setError("Failed to load users."))
      .finally(() => setLoading(false));
  }, []);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/admin/users/${toDelete.id}`, { method: "DELETE", headers: authHeaders() });
      if (!res.ok) throw new Error();
      setUsers((prev) => prev.filter((u) => u.id !== toDelete.id));
      setToast({ type: "success", msg: `${toDelete.name} has been removed.` });
    } catch { setToast({ type: "error", msg: "Failed to delete user." }); }
    finally { setDeleting(false); setToDelete(null); }
  };

  const confirmUpdate = async (newRole) => {
    if (!toUpdate) return;
    setUpdating(true);
    try {
      const res = await fetch(`${API}/admin/users/${toUpdate.id}`, {
        method: "PUT", headers: authHeaders(), body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error();
      setUsers((prev) => prev.map((u) => (u.id === toUpdate.id ? { ...u, role: newRole } : u)));
      setToast({ type: "success", msg: `${toUpdate.name}'s role updated to ${ROLE_LABEL[newRole]}.` });
    } catch { setToast({ type: "error", msg: "Failed to update role." }); }
    finally { setUpdating(false); setToUpdate(null); }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try { await fetch(`${API}/logout`, { method: "POST", headers: authHeaders() }); }
    finally {
      localStorage.removeItem("token"); localStorage.removeItem("role");
      setLoggingOut(false); onLogout?.();
    }
  };

  const isSuperAdmin = viewerRole === "super_admin";
  const currentAdmin =
    users.find((u) => u.role === viewerRole) ??
    users.find((u) => u.role === "admin" || u.role === "super_admin") ??
    { name: "Admin" };

  const headerMeta = {
    overview: { title: "Overview",         sub: "Platform summary and recent activity." },
    users:    { title: "User Management",  sub: "View, search, update roles and remove users." },
    logs:     { title: "Audit Logs",       sub: "Full record of all system actions." },
    attacks:  { title: "Attack Logs",      sub: "Blocked XSS, SQLi and anomaly detection." },
    alerts:   { title: "Security Alerts",  sub: "Real-time security alerts and notifications." },
  };

  return (
    <div className="ad-wrap">
      <aside className="ad-sidebar">
        <div className="ad-logo">
          <div className="ad-logo-icon"><Ico.Shield /></div>
          <span className="ad-logo-name">SecureVault</span>
        </div>
        <div className={`ad-role-badge ${isSuperAdmin ? "super" : ""}`}>
          <span className="ad-role-dot" />
          {isSuperAdmin ? "Super Admin" : "Admin Panel"}
        </div>
        <div className="ad-sidebar-divider" />
        <nav className="ad-nav">
          <div className="ad-nav-section">Management</div>
          {NAV.map((item) => (
            <button key={item.key} className={`ad-nav-item${active === item.key ? " active" : ""}`} onClick={() => setActive(item.key)}>
              <span className="ad-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
          <div className="ad-nav-section" style={{ marginTop: 12 }}>Account</div>
        </nav>
        <div className="ad-sidebar-footer">
          <div className={`ad-mini-avatar ${isSuperAdmin ? "super" : ""}`}>{initials(currentAdmin.name)}</div>
          <div>
            <div className="ad-mini-name">{currentAdmin.name}</div>
            <div className={`ad-mini-role ${isSuperAdmin ? "super" : ""}`}>
              {isSuperAdmin ? "Super Administrator" : "Administrator"}
            </div>
          </div>
        </div>
      </aside>

      <main className="ad-main">
        <header className="ad-header">
          <div className="ad-header-left">
            <div className={`ad-header-eyebrow ${isSuperAdmin ? "super" : ""}`}>
              {isSuperAdmin ? "Super Admin Panel" : "Admin Panel"}
            </div>
            <h1 className="ad-header-title">{headerMeta[active].title}</h1>
            <p className="ad-header-sub">{headerMeta[active].sub}</p>
          </div>
          <button className="ad-logout-btn" onClick={() => setShowLogoutDialog(true)} disabled={loggingOut}>
            {loggingOut ? <span className="ad-spinner" /> : <><Ico.LogOut /><span>Logout</span></>}
          </button>
        </header>

        <div className="ad-content">
          {loading && (
            <div className="ad-loading"><span className="ad-spinner dark" /><p>Loading data…</p></div>
          )}
          {error && !loading && <div className="ad-error-box">{error}</div>}
          {!loading && !error && (
            <>
              {active === "overview" && <OverviewTab users={users} />}
              {active === "users"    && <UsersTab users={users} viewerRole={viewerRole} onDelete={setToDelete} onUpdate={setToUpdate} />}
              {active === "logs"     && <LogsTab />}
              {active === "attacks"  && <AttacksTab />}
              {/* ── MODIFICATION 2 : onglet Alerts → <AlertsTab /> correct ── */}
              {active === "alerts"   && <AlertsTab />}
            </>
          )}
        </div>
      </main>

      <DeleteModal user={toDelete} onCancel={() => setToDelete(null)} onConfirm={confirmDelete} loading={deleting} />
      <UpdateRoleModal key={toUpdate?.id} user={toUpdate} viewerRole={viewerRole} onCancel={() => setToUpdate(null)} onConfirm={confirmUpdate} loading={updating} />
      <Toast toast={toast} onDone={() => setToast(null)} />
      {showLogoutDialog && (
        <LogoutDialog
          onCancel={() => setShowLogoutDialog(false)}
          onConfirm={() => { setShowLogoutDialog(false); handleLogout(); }}
          loading={loggingOut}
        />
      )}
    </div>
  );
}