import { useState, useEffect, useMemo } from "react";
import "../styles/admin.css";

/* ═══════════════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════════════ */
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
  Users: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  LayoutDashboard: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
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
  Trash: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  ),
  Search: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  CheckCircle: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  Check: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevronRight: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  UserCheck: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <polyline points="17 11 19 13 23 9" />
    </svg>
  ),
  UserEdit: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 11l-6 6M20 8l3 3" />
    </svg>
  ),
  GraduationCap: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  ),
  ShieldCheck: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  Crown: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 20h20M4 20L2 8l6 4 4-6 4 6 6-4-2 12" />
    </svg>
  ),
  FileText: () => (
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
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  XCircle: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
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

/* ═══════════════════════════════════════════════════════════════
   HELPERS & CONSTANTS
═══════════════════════════════════════════════════════════════ */
const initials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

const avatarColor = (role) => {
  if (role === "super_admin") return "linear-gradient(135deg,#7c3aed,#4f46e5)";
  if (role === "admin") return "linear-gradient(135deg,#ef4444,#dc2626)";
  if (role === "professor") return "linear-gradient(135deg,#f59e0b,#d97706)";
  return "linear-gradient(135deg,#6366f1,#10b981)";
};

const ROLE_LABEL = {
  student: "Student",
  professor: "Professor",
  admin: "Admin",
  super_admin: "Super Admin",
};

const PAGE_SIZE = 8;

const NAV = [
  { key: "overview", label: "Overview", icon: <Ico.LayoutDashboard /> },
  { key: "users", label: "Users", icon: <Ico.Users /> },
  { key: "logs", label: "Audit Logs", icon: <Ico.FileText /> },
];

/* Role options per viewer role:
   - super_admin → student | professor | admin
   - admin       → student | professor  only         */
const ROLES_FOR = {
  super_admin: [
    { value: "student", label: "Student", color: "#0ea5e9" },
    { value: "professor", label: "Professor", color: "#f59e0b" },
    { value: "admin", label: "Admin", color: "#ef4444" },
  ],
  admin: [
    { value: "student", label: "Student", color: "#0ea5e9" },
    { value: "professor", label: "Professor", color: "#f59e0b" },
  ],
};

/* ═══════════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════════ */
function Toast({ toast, onDone }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [toast, onDone]);

  if (!toast) return null;
  return (
    <div className={`ad-toast ${toast.type}`}>
      {toast.type === "success" ? <Ico.CheckCircle /> : <Ico.XCircle />}
      <span>{toast.msg}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DELETE CONFIRM MODAL
═══════════════════════════════════════════════════════════════ */
function DeleteModal({ user, onCancel, onConfirm, loading }) {
  if (!user) return null;
  return (
    <div className="ad-modal-overlay" onClick={onCancel}>
      <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ad-modal-icon">
          <Ico.AlertTriangle />
        </div>
        <h2 className="ad-modal-title">Delete User</h2>
        <p className="ad-modal-desc">
          You are about to permanently delete <strong>{user.name}</strong>. This
          action cannot be undone.
        </p>
        <div className="ad-modal-actions">
          <button
            className="ad-modal-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="ad-modal-confirm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <span className="ad-spinner" />
            ) : (
              <>
                <Ico.Trash /> Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   UPDATE ROLE MODAL
   viewerRole → determines which options are shown
═══════════════════════════════════════════════════════════════ */
function UpdateRoleModal({ user, viewerRole, onCancel, onConfirm, loading }) {
  /* selected يبدأ من role المستخدم عند فتح المودال.
     المودال يُعاد mount من الصفر في كل مرة عبر key={user?.id}
     في مكان الاستدعاء، لذا useState وحده كافٍ — لا useEffect. */
  const [selected, setSelected] = useState(user?.role ?? "student");

  if (!user) return null;

  /* options available to the current admin */
  const options = ROLES_FOR[viewerRole] ?? ROLES_FOR.admin;

  /* if the target user's current role is not in available options
     (e.g. admin viewing an admin user) — show locked state        */
  const isLocked = !options.some((o) => o.value === user.role);

  return (
    <div className="ad-modal-overlay" onClick={onCancel}>
      <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ad-modal-icon ad-modal-icon--indigo">
          <Ico.UserEdit />
        </div>
        <h2 className="ad-modal-title">Update Role</h2>
        <p className="ad-modal-desc">
          Change the role for <strong>{user.name}</strong>.
        </p>

        {/* ── Locked notice for admin trying to edit admin/super_admin ── */}
        {isLocked ? (
          <div className="ad-role-locked">
            <span className="ad-role-locked-icon">
              <Ico.Lock />
            </span>
            <div>
              <p className="ad-role-locked-title">Permission restricted</p>
              <p className="ad-role-locked-desc">
                You don't have permission to change the role of a{" "}
                <strong>{ROLE_LABEL[user.role]}</strong>. Only a Super Admin can
                modify this account.
              </p>
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
                {selected === r.value && (
                  <span className="ad-role-option-check">
                    <Ico.Check />
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* ── Super-admin-only note ── */}
        {viewerRole === "super_admin" && (
          <p className="ad-role-note">
            <Ico.Crown /> You have full role control as Super Admin.
          </p>
        )}

        <div className="ad-modal-actions">
          <button
            className="ad-modal-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            {isLocked ? "Close" : "Cancel"}
          </button>
          {!isLocked && (
            <button
              className="ad-modal-confirm ad-modal-confirm--indigo"
              onClick={() => onConfirm(selected)}
              disabled={loading || selected === user.role}
            >
              {loading ? (
                <span className="ad-spinner" />
              ) : (
                <>
                  <Ico.UserEdit /> Update Role
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   OVERVIEW TAB
═══════════════════════════════════════════════════════════════ */
function OverviewTab({ users }) {
  const total = users.length;
  const students = users.filter((u) => u.role === "student").length;
  const professors = users.filter((u) => u.role === "professor").length;
  const admins = users.filter(
    (u) => u.role === "admin" || u.role === "super_admin",
  ).length;

  const stats = [
    {
      label: "Total Users",
      value: total,
      icon: <Ico.Users />,
      color: "#6366f1",
      bg: "rgba(99,102,241,.08)",
      trend: "+12%",
    },
    {
      label: "Students",
      value: students,
      icon: <Ico.GraduationCap />,
      color: "#0ea5e9",
      bg: "rgba(14,165,233,.08)",
      trend: "+8%",
    },
    {
      label: "Professors",
      value: professors,
      icon: <Ico.UserCheck />,
      color: "#f59e0b",
      bg: "rgba(245,158,11,.08)",
      trend: "+3%",
    },
    {
      label: "Admins",
      value: admins,
      icon: <Ico.ShieldCheck />,
      color: "#ef4444",
      bg: "rgba(239,68,68,.08)",
      trend: "stable",
    },
  ];

  return (
    <>
      <div className="ad-stats">
        {stats.map((s) => (
          <div
            className="ad-stat"
            key={s.label}
            style={{ "--stat-color": s.color, "--stat-bg": s.bg }}
          >
            <div className="ad-stat-top">
              <div className="ad-stat-icon">{s.icon}</div>
              {s.trend !== "stable" && (
                <span className="ad-stat-trend">{s.trend}</span>
              )}
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
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {[...users]
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 5)
                .map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="ad-user-cell">
                        <div
                          className="ad-user-avatar"
                          style={{ background: avatarColor(u.role) }}
                        >
                          {initials(u.name)}
                        </div>
                        <div>
                          <div className="ad-user-name">{u.name}</div>
                          <div className="ad-user-id">ID #{u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: "#6b7280" }}>{u.email}</td>
                    <td>
                      <span className={`ad-role ${u.role}`}>
                        <span className="ad-role-icon" />
                        {ROLE_LABEL[u.role]}
                      </span>
                    </td>
                    <td style={{ color: "#9ca3af", fontSize: "13px" }}>
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
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
   viewerRole is passed down to control Update button visibility
═══════════════════════════════════════════════════════════════ */
function UsersTab({ users, viewerRole, onDelete, onUpdate }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchSearch =
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      return matchRole && matchSearch;
    });
  }, [users, search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };
  const handleFilter = (key) => {
    setRoleFilter(key);
    setPage(1);
  };

  /* Can the viewer delete a given user?
     - super_admin → cannot delete other super_admin, can delete anyone else
     - admin       → can only delete student / professor               */
  const canDelete = (u) => {
    if (viewerRole === "super_admin") return u.role !== "super_admin";
    return u.role === "student" || u.role === "professor";
  };

  /* Can the viewer update a given user's role?
     - super_admin → anyone except themselves (or other super_admin)
     - admin       → only student / professor                         */
  const canUpdate = (u) => {
    if (viewerRole === "super_admin") return u.role !== "super_admin";
    return u.role === "student" || u.role === "professor";
  };

  const FILTERS = [
    { key: "all", label: "All" },
    { key: "student", label: "Students" },
    { key: "professor", label: "Professors" },
    { key: "admin", label: "Admins" },
    ...(viewerRole === "super_admin"
      ? [{ key: "super_admin", label: "Super Admins" }]
      : []),
  ];

  return (
    <div className="ad-table-section">
      <div className="ad-table-header">
        <div>
          <div className="ad-table-title">User Management</div>
          <div className="ad-table-count">
            {filtered.length} user{filtered.length !== 1 ? "s" : ""} found
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="ad-table-toolbar">
        <div className="ad-search-wrap">
          <span className="ad-search-icon">
            <Ico.Search />
          </span>
          <input
            className="ad-search"
            placeholder="Search by name or email…"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <div className="ad-filter-pills">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`ad-pill ${f.key} ${roleFilter === f.key ? "active" : ""}`}
              onClick={() => handleFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="ad-table-empty">
                    <Ico.Users />
                    <p>No users match your search.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="ad-user-cell">
                      <div
                        className="ad-user-avatar"
                        style={{ background: avatarColor(u.role) }}
                      >
                        {initials(u.name)}
                      </div>
                      <div>
                        <div className="ad-user-name">
                          {u.name}
                          {u.role === "super_admin" && (
                            <span
                              className="ad-crown-badge"
                              title="Super Admin"
                            >
                              <Ico.Crown />
                            </span>
                          )}
                        </div>
                        <div className="ad-user-id">ID #{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: "#6b7280" }}>{u.email}</td>
                  <td>
                    <span className={`ad-role ${u.role}`}>
                      <span className="ad-role-icon" />
                      {ROLE_LABEL[u.role]}
                    </span>
                  </td>
                  <td style={{ color: "#9ca3af", fontSize: "13px" }}>
                    {u.created_at
                      ? new Date(u.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>

                  {/* ── Actions ── */}
                  <td>
                    <div className="ad-actions-cell">
                      {/* Update button — shown only when viewer has permission */}
                      {canUpdate(u) ? (
                        <button
                          className="ad-upd-btn"
                          onClick={() => onUpdate(u)}
                          title="Update role"
                        >
                          <Ico.UserEdit />
                          Update
                        </button>
                      ) : (
                        /* Lock icon for restricted rows */
                        <span
                          className="ad-action-locked"
                          title="Cannot update this role"
                        >
                          <Ico.Lock />
                        </span>
                      )}

                      {/* Delete button */}
                      {canDelete(u) ? (
                        <button
                          className="ad-del-btn"
                          onClick={() => onDelete(u)}
                          title="Delete user"
                        >
                          <Ico.Trash />
                          Delete
                        </button>
                      ) : (
                        <span
                          className="ad-action-locked"
                          title="Cannot delete this role"
                        >
                          <Ico.Lock />
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="ad-pagination">
          <span className="ad-page-info">
            Showing {(safePage - 1) * PAGE_SIZE + 1}–
            {Math.min(safePage * PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length}
          </span>
          <div className="ad-page-btns">
            <button
              className="ad-page-btn"
              onClick={() => setPage((p) => p - 1)}
              disabled={safePage === 1}
            >
              <Ico.ChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={`ad-page-btn${safePage === n ? " active" : ""}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button
              className="ad-page-btn"
              onClick={() => setPage((p) => p + 1)}
              disabled={safePage === totalPages}
            >
              <Ico.ChevronRight />
            </button>
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
  return (
    <div className="ad-table-section">
      <div className="ad-table-header">
        <div>
          <div className="ad-table-title">Audit Logs</div>
          <div className="ad-table-count">
            All admin actions are recorded here
          </div>
        </div>
      </div>
      <div
        style={{ padding: "60px 28px", textAlign: "center", color: "#9ca3af" }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            margin: "0 auto 14px",
            color: "#e5e7eb",
          }}
        >
          <Ico.FileText />
        </div>
        <p
          style={{
            fontSize: 15,
            fontFamily: "'Playfair Display',serif",
            color: "#374151",
            marginBottom: 6,
          }}
        >
          Coming soon
        </p>
        <p style={{ fontSize: 13.5, lineHeight: 1.6 }}>
          Real-time audit log viewer will be available in the next release.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN ADMIN PANEL
═══════════════════════════════════════════════════════════════ */
export default function AdminPanel({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [active, setActive] = useState("overview");

  /* viewerRole = role of the currently logged-in admin */
  const [viewerRole, setViewerRole] = useState(
    localStorage.getItem("role") ?? "admin",
  );

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [toUpdate, setToUpdate] = useState(null);
  const [updating, setUpdating] = useState(false);

  const [loggingOut, setLoggingOut] = useState(false);
  const [toast, setToast] = useState(null);

  /* ── Fetch users + confirm viewer role from API ── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    /* fetch viewer's own profile to confirm role */
    fetch("http://127.0.0.1:8000/api/user", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then((r) => r.json())
      .then((me) => {
        if (me?.role) {
          setViewerRole(me.role);
          localStorage.setItem("role", me.role);
        }
      })
      .catch(() => {});

    /* fetch all users */
    fetch("http://127.0.0.1:8000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then((r) => {
        if (r.status === 401 || r.status === 403) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        return r.json();
      })
      .then((data) => setUsers(data?.data ?? []))
      .catch(() => setError("Failed to load users. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  /* ── Delete user ── */
  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/admin/users/${toDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );
      if (!res.ok) throw new Error();
      setUsers((prev) => prev.filter((u) => u.id !== toDelete.id));
      setToast({ type: "success", msg: `${toDelete.name} has been removed.` });
    } catch {
      setToast({ type: "error", msg: "Failed to delete user. Try again." });
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  /* ── Update role ── */
  const confirmUpdate = async (newRole) => {
    if (!toUpdate) return;
    setUpdating(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/admin/users/${toUpdate.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        },
      );
      if (!res.ok) throw new Error();
      setUsers((prev) =>
        prev.map((u) => (u.id === toUpdate.id ? { ...u, role: newRole } : u)),
      );
      setToast({
        type: "success",
        msg: `${toUpdate.name}'s role updated to ${ROLE_LABEL[newRole]}.`,
      });
    } catch {
      setToast({ type: "error", msg: "Failed to update role. Try again." });
    } finally {
      setUpdating(false);
      setToUpdate(null);
    }
  };

  /* ── Logout ── */
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
      localStorage.removeItem("role");
      setLoggingOut(false);
      onLogout?.();
    }
  };

  const isSuperAdmin = viewerRole === "super_admin";
  const currentAdmin = users.find((u) => u.role === viewerRole) ??
    users.find((u) => u.role === "admin" || u.role === "super_admin") ?? {
      name: "Admin",
    };

  const headerMeta = {
    overview: {
      title: "Overview",
      sub: "Platform summary and recent activity.",
    },
    users: {
      title: "User Management",
      sub: "View, search, update roles and remove users.",
    },
    logs: {
      title: "Audit Logs",
      sub: "Full record of all administrative actions.",
    },
  };

  return (
    <div className="ad-wrap">
      {/* ── SIDEBAR ── */}
      <aside className="ad-sidebar">
        <div className="ad-logo">
          <div className="ad-logo-icon">
            <Ico.Shield />
          </div>
          <span className="ad-logo-name">SecureVault</span>
        </div>

        {/* Badge differs per role */}
        <div className={`ad-role-badge ${isSuperAdmin ? "super" : ""}`}>
          <span className="ad-role-dot" />
          {isSuperAdmin ? "Super Admin" : "Admin Panel"}
        </div>

        <div className="ad-sidebar-divider" />

        <nav className="ad-nav">
          <div className="ad-nav-section">Management</div>
          {NAV.map((item) => (
            <button
              key={item.key}
              className={`ad-nav-item${active === item.key ? " active" : ""}`}
              onClick={() => setActive(item.key)}
            >
              <span className="ad-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
          <div className="ad-nav-section" style={{ marginTop: 12 }}>
            Account
          </div>
          {/* <button
            className="ad-nav-item danger"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <span className="ad-nav-icon">
              <Ico.LogOut />
            </span>
            <span>Logout</span>
          </button> */}
        </nav>

        <div className="ad-sidebar-footer">
          <div className={`ad-mini-avatar ${isSuperAdmin ? "super" : ""}`}>
            {initials(currentAdmin.name)}
          </div>
          <div>
            <div className="ad-mini-name">{currentAdmin.name}</div>
            <div className={`ad-mini-role ${isSuperAdmin ? "super" : ""}`}>
              {isSuperAdmin ? "Super Administrator" : "Administrator"}
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="ad-main">
        <header className="ad-header">
          <div className="ad-header-left">
            <div className={`ad-header-eyebrow ${isSuperAdmin ? "super" : ""}`}>
              {isSuperAdmin ? "Super Admin Panel" : "Admin Panel"}
            </div>
            <h1 className="ad-header-title">{headerMeta[active].title}</h1>
            <p className="ad-header-sub">{headerMeta[active].sub}</p>
          </div>
          <button
            className="ad-logout-btn"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <span className="ad-spinner" />
            ) : (
              <>
                <Ico.LogOut />
                <span>Logout</span>
              </>
            )}
          </button>
        </header>

        <div className="ad-content">
          {loading && (
            <div className="ad-loading">
              <span className="ad-spinner dark" />
              <p>Loading data…</p>
            </div>
          )}
          {error && !loading && <div className="ad-error-box">{error}</div>}

          {!loading && !error && (
            <>
              {active === "overview" && <OverviewTab users={users} />}
              {active === "users" && (
                <UsersTab
                  users={users}
                  viewerRole={viewerRole}
                  onDelete={(u) => setToDelete(u)}
                  onUpdate={(u) => setToUpdate(u)}
                />
              )}
              {active === "logs" && <LogsTab />}
            </>
          )}
        </div>
      </main>

      {/* ── DELETE MODAL ── */}
      <DeleteModal
        user={toDelete}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
      />

      {/* ── UPDATE ROLE MODAL ── */}
      {/* key={toUpdate?.id} يجعل React يعيد mount المودال من صفر
          في كل مرة يُفتح لمستخدم مختلف، فـ useState يأخذ القيمة
          الصحيحة مباشرة بدون الحاجة لأي useEffect.             */}
      <UpdateRoleModal
        key={toUpdate?.id}
        user={toUpdate}
        viewerRole={viewerRole}
        onCancel={() => setToUpdate(null)}
        onConfirm={confirmUpdate}
        loading={updating}
      />

      {/* ── TOAST ── */}
      <Toast toast={toast} onDone={() => setToast(null)} />
    </div>
  );
}
