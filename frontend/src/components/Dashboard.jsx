import { useState, useEffect } from "react";
import "../styles/dashboard.css";
import FileManager from "./FileManager";

const API = "http://127.0.0.1:8000/api";

/* ═══════════════════════════════════════
   ICONS
═══════════════════════════════════════ */
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
  Check: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Eye: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  Badge: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
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
  Plus: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
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
  Share: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  X: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  UserMinus: () => (
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
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  ),
  ChevronDown: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
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
  LinkOff: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  ),
};

const ROLE_META = {
  student: {
    label: "Student",
    color: "#6366f1",
    bg: "rgba(99,102,241,.08)",
    border: "rgba(99,102,241,.2)",
  },
  professor: {
    label: "Professor",
    color: "#0ea5e9",
    bg: "rgba(14,165,233,.08)",
    border: "rgba(14,165,233,.2)",
  },
  admin: {
    label: "Admin",
    color: "#f59e0b",
    bg: "rgba(245,158,11,.08)",
    border: "rgba(245,158,11,.2)",
  },
  super_admin: {
    label: "Super Admin",
    color: "#ef4444",
    bg: "rgba(239,68,68,.08)",
    border: "rgba(239,68,68,.2)",
  },
};

const fileIcon = (mime = "") => {
  if (mime.startsWith("image/")) return "🖼️";
  if (mime === "application/pdf") return "📄";
  if (mime.startsWith("text/")) return "📝";
  if (mime.includes("spreadsheet") || mime.includes("excel")) return "📊";
  if (mime.includes("presentation") || mime.includes("powerpoint")) return "📋";
  if (mime.includes("word") || mime.includes("document")) return "📃";
  if (mime.includes("zip")) return "🗜️";
  return "📁";
};

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function authHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

function Alert({ type, msg, onClose }) {
  if (!msg) return null;
  return (
    <div className={`ss-alert ${type === "success" ? "success" : "error"}`}>
      <span className="ss-alert-icon">
        {type === "success" ? <Ico.Check /> : "⚠"}
      </span>
      <span className="ss-alert-msg">{msg}</span>
      <button className="ss-alert-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
}

function PwInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="ss-pw-wrap">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="ss-input"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="ss-pw-eye"
      >
        {show ? <Ico.EyeOff /> : <Ico.Eye />}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════
   CONFIRM MODAL  ← بديل window.confirm
═══════════════════════════════════════ */
function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirm",
  danger = true,
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <div className="grp-modal-overlay" onClick={onCancel}>
      <div
        className="grp-modal grp-confirm-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className={`grp-confirm-icon ${danger ? "danger" : "indigo"}`}>
          {danger ? <Ico.Trash /> : <Ico.LinkOff />}
        </div>
        <h3 className="grp-confirm-title">{title}</h3>
        <p className="grp-confirm-desc">{message}</p>
        <div className="fm-modal-actions">
          <button
            className="fm-btn-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={danger ? "fm-btn-delete" : "fm-btn-share"}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <span className="fm-spinner" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   GROUPS PAGE
═══════════════════════════════════════ */
function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myFiles, setMyFiles] = useState([]);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  const [expanded, setExpanded] = useState(null);
  const [activeTab, setActiveTab] = useState({});

  const [shareModal, setShareModal] = useState(null);
  const [shareFileId, setShareFileId] = useState("");
  const [sharePerm, setSharePerm] = useState("view");
  const [sharing, setSharing] = useState(false);

  const [membersModal, setMembersModal] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [addingMembers, setAddingMembers] = useState(false);

  // ← Confirm modals (بدل window.confirm)
  const [confirmDeleteGroup, setConfirmDeleteGroup] = useState(null); // group object
  const [confirmRemoveFile, setConfirmRemoveFile] = useState(null); // { groupId, fileId, fileName }
  const [confirmRemoveMember, setConfirmRemoveMember] = useState(null); // { groupId, userId, userName }
  const [actionLoading, setActionLoading] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const getTab = (groupId) => activeTab[groupId] || "members";
  const setTab = (groupId, tab) =>
    setActiveTab((prev) => ({ ...prev, [groupId]: tab }));

  /* ── Fetch all ── */
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [gRes, sRes, fRes] = await Promise.all([
        fetch(`${API}/groups`, { headers: authHeaders() }),
        fetch(`${API}/groups/students`, { headers: authHeaders() }),
        fetch(`${API}/files`, { headers: authHeaders() }),
      ]);
      const [gData, sData, fData] = await Promise.all([
        gRes.json(),
        sRes.json(),
        fRes.json(),
      ]);
      setGroups(gData.groups ?? []);
      setStudents(sData.students ?? []);
      setMyFiles(fData.files ?? []);
    } catch {
      showToast("error", "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* ── Create group ── */
  const createGroup = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(`${API}/groups`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setGroups((prev) => [data.group, ...prev]);
      setNewName("");
      showToast("success", `Group "${data.group.name}" created.`);
    } catch (e) {
      showToast("error", e.message);
    } finally {
      setCreating(false);
    }
  };

  /* ── Delete group (confirmed) ── */
  const handleDeleteGroup = async () => {
    if (!confirmDeleteGroup) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/groups/${confirmDeleteGroup.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      setGroups((prev) => prev.filter((g) => g.id !== confirmDeleteGroup.id));
      showToast("success", `Group "${confirmDeleteGroup.name}" deleted.`);
    } catch {
      showToast("error", "Failed to delete group.");
    } finally {
      setActionLoading(false);
      setConfirmDeleteGroup(null);
    }
  };

  /* ── Add members ── */
  const addMembers = async () => {
    if (!selectedStudents.length) return;
    setAddingMembers(true);
    try {
      const res = await fetch(
        `${API}/groups/${membersModal.group.id}/members`,
        {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ user_ids: selectedStudents }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setGroups((prev) =>
        prev.map((g) => (g.id === membersModal.group.id ? data.group : g)),
      );
      setMembersModal(null);
      setSelectedStudents([]);
      showToast("success", `${data.added_count} member(s) added.`);
    } catch (e) {
      showToast("error", e.message);
    } finally {
      setAddingMembers(false);
    }
  };

  /* ── Remove member (confirmed) ── */
  const handleRemoveMember = async () => {
    if (!confirmRemoveMember) return;
    const { groupId, userId } = confirmRemoveMember;
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/groups/${groupId}/members/${userId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId
            ? {
                ...g,
                members: g.members.filter((m) => m.id !== userId),
                members_count: g.members_count - 1,
              }
            : g,
        ),
      );
      showToast("success", "Member removed.");
    } catch {
      showToast("error", "Failed to remove member.");
    } finally {
      setActionLoading(false);
      setConfirmRemoveMember(null);
    }
  };

  /* ── Share file ── */
  const shareWithGroup = async () => {
    if (!shareFileId) {
      showToast("error", "Please select a file.");
      return;
    }
    setSharing(true);
    try {
      const res = await fetch(`${API}/groups/${shareModal.group.id}/share`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ file_id: shareFileId, permission: sharePerm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      if (data.group) {
        setGroups((prev) =>
          prev.map((g) => (g.id === shareModal.group.id ? data.group : g)),
        );
      }
      setShareModal(null);
      setShareFileId("");
      showToast("success", data.message);
    } catch (e) {
      showToast("error", e.message);
    } finally {
      setSharing(false);
    }
  };

  /* ── Revoke file from group (confirmed) ── */
  const handleRevokeFile = async () => {
    if (!confirmRemoveFile) return;
    const { groupId, fileId } = confirmRemoveFile;
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/groups/${groupId}/share/${fileId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `HTTP ${res.status}`);
      }
      // نحدّث الـ state مباشرة
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId
            ? {
                ...g,
                shared_files: (g.shared_files || []).filter(
                  (s) => s.file_id !== fileId,
                ),
              }
            : g,
        ),
      );
      showToast("success", "File removed from group.");
    } catch (e) {
      showToast("error", `Failed to remove file: ${e.message}`);
    } finally {
      setActionLoading(false);
      setConfirmRemoveFile(null);
    }
  };

  const toggleStudent = (id) =>
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  if (loading)
    return (
      <div className="db-loading">
        <span className="db-spinner large" />
        <p>Loading groups…</p>
      </div>
    );

  return (
    <div className="grp-wrap">
      {/* ── Create Group ── */}
      <div className="grp-create-card">
        <h3 className="grp-section-title">
          <span className="grp-title-icon">
            <Ico.Plus />
          </span>
          Create New Group
        </h3>
        <div className="grp-create-row">
          <input
            className="grp-input"
            placeholder="Group name (e.g. L3 Security)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createGroup()}
          />
          <button
            className="grp-btn-primary"
            onClick={createGroup}
            disabled={creating || !newName.trim()}
          >
            {creating ? (
              <span className="fm-spinner" />
            ) : (
              <>
                <Ico.Plus /> Create
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Groups List ── */}
      {groups.length === 0 ? (
        <div className="grp-empty">
          <span style={{ fontSize: 40 }}>👥</span>
          <p>No groups yet. Create your first group above.</p>
        </div>
      ) : (
        <div className="grp-list">
          {groups.map((group) => {
            const isOpen = expanded === group.id;
            const tab = getTab(group.id);
            const sharedFiles = group.shared_files || [];

            return (
              <div
                key={group.id}
                className={`grp-card${isOpen ? " open" : ""}`}
              >
                {/* ── Card Header ── */}
                <div
                  className="grp-card-header"
                  onClick={() => setExpanded(isOpen ? null : group.id)}
                >
                  <div className="grp-card-left">
                    <div className="grp-avatar">
                      {group.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="grp-name">{group.name}</div>
                      <div className="grp-meta">
                        {group.members_count} member
                        {group.members_count !== 1 ? "s" : ""}
                        {sharedFiles.length > 0 && (
                          <span className="grp-files-badge">
                            · {sharedFiles.length} file
                            {sharedFiles.length !== 1 ? "s" : ""} shared
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grp-card-actions">
                    <button
                      className="grp-btn-share"
                      title="Share file with group"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShareModal({ group });
                        setShareFileId("");
                        setSharePerm("view");
                      }}
                    >
                      <Ico.Share /> Share File
                    </button>
                    <button
                      className="grp-btn-add"
                      title="Add members"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMembersModal({ group });
                        setSelectedStudents([]);
                      }}
                    >
                      <Ico.Plus /> Add Members
                    </button>
                    <button
                      className="grp-btn-delete"
                      title="Delete group"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteGroup(group);
                      }}
                    >
                      <Ico.Trash />
                    </button>
                    <span className="grp-chevron">
                      {isOpen ? <Ico.ChevronDown /> : <Ico.ChevronRight />}
                    </span>
                  </div>
                </div>

                {/* ── Expanded Body ── */}
                {isOpen && (
                  <div className="grp-expanded">
                    {/* Tab bar */}
                    <div className="grp-tab-bar">
                      <button
                        className={`grp-tab${tab === "members" ? " active" : ""}`}
                        onClick={() => setTab(group.id, "members")}
                      >
                        <Ico.Users /> Members
                        <span className="grp-tab-count">
                          {group.members_count}
                        </span>
                      </button>
                      <button
                        className={`grp-tab${tab === "files" ? " active" : ""}`}
                        onClick={() => setTab(group.id, "files")}
                      >
                        <Ico.File /> Shared Files
                        <span className="grp-tab-count">
                          {sharedFiles.length}
                        </span>
                      </button>
                    </div>

                    {/* Tab: Members */}
                    {tab === "members" && (
                      <div className="grp-members">
                        {!group.members || group.members.length === 0 ? (
                          <p className="grp-members-empty">
                            No members yet. Click "Add Members" to get started.
                          </p>
                        ) : (
                          <table className="grp-members-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.members.map((m) => (
                                <tr key={m.id}>
                                  <td>
                                    <div className="grp-member-cell">
                                      <div className="grp-member-avatar">
                                        {getInitials(m.name)}
                                      </div>
                                      <span>{m.name}</span>
                                    </div>
                                  </td>
                                  <td className="grp-member-email">
                                    {m.email}
                                  </td>
                                  <td>
                                    <button
                                      className="grp-remove-btn"
                                      title="Remove member"
                                      onClick={() =>
                                        setConfirmRemoveMember({
                                          groupId: group.id,
                                          userId: m.id,
                                          userName: m.name,
                                        })
                                      }
                                    >
                                      <Ico.UserMinus />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}

                    {/* Tab: Shared Files */}
                    {tab === "files" && (
                      <div className="grp-members">
                        {sharedFiles.length === 0 ? (
                          <p className="grp-members-empty">
                            No files shared with this group yet.
                            <br />
                            Click <strong>"Share File"</strong> above to get
                            started.
                          </p>
                        ) : (
                          <table className="grp-members-table">
                            <thead>
                              <tr>
                                <th>File</th>
                                <th>Permission</th>
                                <th>Shared At</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {sharedFiles.map((s) => (
                                <tr key={s.share_id}>
                                  <td>
                                    <div className="grp-member-cell">
                                      <span style={{ fontSize: 20 }}>
                                        {fileIcon(s.file?.mime_type)}
                                      </span>
                                      <div>
                                        <div
                                          style={{
                                            fontWeight: 600,
                                            fontSize: 13,
                                            color: "#111827",
                                          }}
                                        >
                                          {s.file?.original_name}
                                        </div>
                                        <div
                                          style={{
                                            fontSize: 11,
                                            color: "#9ca3af",
                                          }}
                                        >
                                          {s.file?.formatted_size}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <span
                                      className={`fm-perm-badge ${s.permission}`}
                                    >
                                      {s.permission === "view"
                                        ? "View Only"
                                        : "Download"}
                                    </span>
                                  </td>
                                  <td className="grp-member-email">
                                    {s.shared_at
                                      ? new Date(
                                          s.shared_at,
                                        ).toLocaleDateString("en-GB", {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                        })
                                      : "—"}
                                  </td>
                                  <td>
                                    {/* ← نمرر file_id وليس share_id */}
                                    <button
                                      className="grp-remove-btn"
                                      title="Remove file from group"
                                      onClick={() =>
                                        setConfirmRemoveFile({
                                          groupId: group.id,
                                          fileId: s.file_id,
                                          fileName: s.file?.original_name,
                                        })
                                      }
                                    >
                                      <Ico.LinkOff />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ══ SHARE FILE MODAL ══ */}
      {shareModal && (
        <div className="grp-modal-overlay" onClick={() => setShareModal(null)}>
          <div className="grp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="grp-modal-header">
              <h3>
                Share File with <em>{shareModal.group.name}</em>
              </h3>
              <button
                className="fm-modal-close"
                onClick={() => setShareModal(null)}
              >
                <Ico.X />
              </button>
            </div>
            <label className="fm-label">Select File</label>
            <select
              className="fm-select"
              value={shareFileId}
              onChange={(e) => setShareFileId(e.target.value)}
            >
              <option value="">— Choose a file —</option>
              {myFiles
                .filter((f) => f.status === "safe")
                .map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.original_name} ({f.formatted_size})
                  </option>
                ))}
            </select>
            <label className="fm-label" style={{ marginTop: 14 }}>
              Permission
            </label>
            <div className="fm-permission-row">
              {[
                {
                  val: "view",
                  label: "View Only",
                  desc: "Can preview inside the app",
                },
                {
                  val: "download",
                  label: "Download",
                  desc: "Can preview and download",
                },
              ].map((p) => (
                <button
                  key={p.val}
                  className={`fm-perm-btn${sharePerm === p.val ? " active" : ""}`}
                  onClick={() => setSharePerm(p.val)}
                >
                  <span className="fm-perm-label">{p.label}</span>
                  <span className="fm-perm-desc">{p.desc}</span>
                </button>
              ))}
            </div>
            <div className="fm-modal-actions" style={{ marginTop: 20 }}>
              <button
                className="fm-btn-cancel"
                onClick={() => setShareModal(null)}
              >
                Cancel
              </button>
              <button
                className="fm-btn-share"
                onClick={shareWithGroup}
                disabled={sharing || !shareFileId}
              >
                {sharing ? (
                  <span className="fm-spinner" />
                ) : (
                  <>
                    <Ico.Share /> Share with Group
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ ADD MEMBERS MODAL ══ */}
      {membersModal && (
        <div
          className="grp-modal-overlay"
          onClick={() => setMembersModal(null)}
        >
          <div className="grp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="grp-modal-header">
              <h3>
                Add Members to <em>{membersModal.group.name}</em>
              </h3>
              <button
                className="fm-modal-close"
                onClick={() => setMembersModal(null)}
              >
                <Ico.X />
              </button>
            </div>
            <p className="grp-modal-sub">
              Select students to add to this group:
            </p>
            <div className="grp-students-list">
              {students.length === 0 ? (
                <p
                  style={{ color: "#9ca3af", fontSize: 13, padding: "12px 0" }}
                >
                  No students available.
                </p>
              ) : (
                students.map((s) => {
                  const alreadyIn = membersModal.group.members?.some(
                    (m) => m.id === s.id,
                  );
                  const selected = selectedStudents.includes(s.id);
                  return (
                    <label
                      key={s.id}
                      className={`grp-student-item${alreadyIn ? " already-in" : ""}${selected ? " selected" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={selected || alreadyIn}
                        disabled={alreadyIn}
                        onChange={() => !alreadyIn && toggleStudent(s.id)}
                      />
                      <div
                        className="grp-member-avatar"
                        style={{ width: 28, height: 28, fontSize: 10 }}
                      >
                        {getInitials(s.name)}
                      </div>
                      <div className="grp-student-info">
                        <span className="grp-student-name">{s.name}</span>
                        <span className="grp-student-email">{s.email}</span>
                      </div>
                      {alreadyIn && (
                        <span className="grp-already-badge">
                          Already in group
                        </span>
                      )}
                    </label>
                  );
                })
              )}
            </div>
            <div className="fm-modal-actions" style={{ marginTop: 16 }}>
              <button
                className="fm-btn-cancel"
                onClick={() => {
                  setMembersModal(null);
                  setSelectedStudents([]);
                }}
              >
                Cancel
              </button>
              <button
                className="fm-btn-share"
                onClick={addMembers}
                disabled={addingMembers || selectedStudents.length === 0}
              >
                {addingMembers ? (
                  <span className="fm-spinner" />
                ) : (
                  <>
                    <Ico.Plus /> Add{" "}
                    {selectedStudents.length > 0
                      ? `(${selectedStudents.length})`
                      : ""}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ CONFIRM: DELETE GROUP ══ */}
      {confirmDeleteGroup && (
        <ConfirmModal
          title="Delete Group"
          message={
            <>
              Are you sure you want to delete{" "}
              <strong>"{confirmDeleteGroup.name}"</strong>? All members and
              shared files will be removed.
            </>
          }
          confirmLabel={
            <>
              <Ico.Trash /> Delete Group
            </>
          }
          danger={true}
          loading={actionLoading}
          onConfirm={handleDeleteGroup}
          onCancel={() => setConfirmDeleteGroup(null)}
        />
      )}

      {/* ══ CONFIRM: REMOVE FILE FROM GROUP ══ */}
      {confirmRemoveFile && (
        <ConfirmModal
          title="Remove File from Group"
          message={
            <>
              Remove <strong>"{confirmRemoveFile.fileName}"</strong> from this
              group? Students will lose access to it.
            </>
          }
          confirmLabel={
            <>
              <Ico.LinkOff /> Remove File
            </>
          }
          danger={true}
          loading={actionLoading}
          onConfirm={handleRevokeFile}
          onCancel={() => setConfirmRemoveFile(null)}
        />
      )}

      {/* ══ CONFIRM: REMOVE MEMBER ══ */}
      {confirmRemoveMember && (
        <ConfirmModal
          title="Remove Member"
          message={
            <>
              Remove <strong>{confirmRemoveMember.userName}</strong> from this
              group?
            </>
          }
          confirmLabel={
            <>
              <Ico.UserMinus /> Remove
            </>
          }
          danger={true}
          loading={actionLoading}
          onConfirm={handleRemoveMember}
          onCancel={() => setConfirmRemoveMember(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fm-toast ${toast.type}`}
          style={{ position: "fixed", bottom: 28, right: 28, zIndex: 300 }}
        >
          {toast.type === "success" ? <Ico.Check /> : <Ico.X />}
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   SETTINGS PAGE
═══════════════════════════════════════ */
function SettingsPage({ user, onUserUpdate }) {
  const [name, setName] = useState(user?.name || "");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameAlert, setNameAlert] = useState({ type: "", msg: "" });
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [conPw, setConPw] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwAlert, setPwAlert] = useState({ type: "", msg: "" });

  const roleMeta = ROLE_META[user?.role] || ROLE_META.student;
  const initials = getInitials(user?.name);

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

  const savePw = async () => {
    if (!curPw || !newPw || !conPw) {
      setPwAlert({ type: "error", msg: "Please fill in all fields." });
      return;
    }
    if (newPw !== conPw) {
      setPwAlert({ type: "error", msg: "New passwords do not match." });
      return;
    }
    if (newPw.length < 8) {
      setPwAlert({
        type: "error",
        msg: "Password must be at least 8 characters.",
      });
      return;
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
      setCurPw("");
      setNewPw("");
      setConPw("");
    } catch (e) {
      setPwAlert({ type: "error", msg: e.message });
    } finally {
      setPwLoading(false);
    }
  };

  const pwStrength = newPw.length >= 12 ? 2 : newPw.length >= 8 ? 1 : 0;
  const pwColors = ["#ef4444", "#f59e0b", "#22c55e"];
  const pwLabels = ["Weak", "Fair", "Strong"];

  return (
    <div className="ss-wrap">
      <div className="ss-card">
        <div className="ss-card-accent" />
        <div className="ss-card-head">
          <span className="ss-card-ico">
            <Ico.Badge />
          </span>
          <h3 className="ss-card-title">Account Information</h3>
        </div>
        <div className="ss-card-body ss-account-row">
          <div className="ss-avatar">{initials}</div>
          <div className="ss-account-info">
            <div className="ss-info-row">
              <span className="ss-info-ico">
                <Ico.Mail />
              </span>
              <span className="ss-info-val">{user?.email}</span>
              <span className="ss-readonly-badge">read-only</span>
            </div>
            <div className="ss-info-row">
              <span className="ss-info-ico" style={{ color: roleMeta.color }}>
                <Ico.Shield />
              </span>
              <span
                className="ss-role-pill"
                style={{
                  background: roleMeta.bg,
                  border: `1px solid ${roleMeta.border}`,
                  color: roleMeta.color,
                }}
              >
                {roleMeta.label}
              </span>
              <span className="ss-readonly-badge">assigned by admin</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ss-card">
        <div className="ss-card-head">
          <span className="ss-card-ico">
            <Ico.User />
          </span>
          <div>
            <h3 className="ss-card-title">Display Name</h3>
            <p className="ss-card-sub">
              Update how your name appears across the platform
            </p>
          </div>
        </div>
        <div className="ss-card-body">
          {nameAlert.msg && (
            <>
              <Alert
                type={nameAlert.type}
                msg={nameAlert.msg}
                onClose={() => setNameAlert({ type: "", msg: "" })}
              />
              <div style={{ height: 14 }} />
            </>
          )}
          <div className="ss-name-row">
            <div style={{ flex: 1 }}>
              <label className="ss-label">Full Name</label>
              <input
                className="ss-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                onKeyDown={(e) => e.key === "Enter" && saveName()}
              />
            </div>
            <button
              className="ss-save-btn"
              onClick={saveName}
              disabled={
                nameLoading || !name.trim() || name.trim() === user?.name
              }
            >
              {nameLoading ? (
                <span className="db-spinner" />
              ) : (
                <>
                  <span className="ss-btn-ico">
                    <Ico.Check />
                  </span>
                  Save
                </>
              )}
            </button>
          </div>
          {name.trim() && name.trim() !== user?.name && (
            <p className="ss-preview">
              Preview: <strong>{name.trim()}</strong>
            </p>
          )}
        </div>
      </div>

      <div className="ss-card">
        <div className="ss-card-head">
          <span className="ss-card-ico">
            <Ico.Lock />
          </span>
          <div>
            <h3 className="ss-card-title">Change Password</h3>
            <p className="ss-card-sub">
              Use a strong password of at least 8 characters
            </p>
          </div>
        </div>
        <div className="ss-card-body">
          {pwAlert.msg && (
            <>
              <Alert
                type={pwAlert.type}
                msg={pwAlert.msg}
                onClose={() => setPwAlert({ type: "", msg: "" })}
              />
              <div style={{ height: 14 }} />
            </>
          )}
          <div className="ss-pw-fields">
            <div>
              <label className="ss-label">Current Password</label>
              <PwInput
                value={curPw}
                onChange={(e) => setCurPw(e.target.value)}
                placeholder="Enter current password"
              />
            </div>
            <div className="ss-pw-grid">
              <div>
                <label className="ss-label">New Password</label>
                <PwInput
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="At least 8 characters"
                />
              </div>
              <div>
                <label className="ss-label">Confirm New Password</label>
                <PwInput
                  value={conPw}
                  onChange={(e) => setConPw(e.target.value)}
                  placeholder="Repeat new password"
                />
              </div>
            </div>
            {newPw && (
              <div className="ss-strength-row">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="ss-strength-seg"
                    style={{
                      background:
                        i <= pwStrength ? pwColors[pwStrength] : "#e5e7eb",
                    }}
                  />
                ))}
                <span className="ss-strength-label">
                  {pwLabels[pwStrength]}
                </span>
              </div>
            )}
            {conPw && newPw && (
              <p
                className="ss-match"
                style={{ color: newPw === conPw ? "#16a34a" : "#dc2626" }}
              >
                {newPw === conPw
                  ? "✓ Passwords match"
                  : "✗ Passwords do not match"}
              </p>
            )}
            <div className="ss-save-row">
              <button
                className="ss-save-btn"
                onClick={savePw}
                disabled={pwLoading}
              >
                {pwLoading ? (
                  <span className="db-spinner" />
                ) : (
                  <>
                    <span className="ss-btn-ico">
                      <Ico.Lock />
                    </span>
                    Update Password
                  </>
                )}
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [active, setActive] = useState("home");
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetch(`${API}/user`, {
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
    try {
      await fetch(`${API}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });
    } finally {
      localStorage.removeItem("token");
      setLoggingOut(false);
      onLogout?.();
    }
  };

  const isProfessor = user?.role === "professor";
  const initials = getInitials(user?.name);
  const joined = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  const NAV_ITEMS = [
    { key: "home", label: "Dashboard", icon: <Ico.Home /> },
    { key: "files", label: "My Files", icon: <Ico.File /> },
    ...(isProfessor
      ? [{ key: "groups", label: "My Groups", icon: <Ico.Users /> }]
      : []),
    { key: "settings", label: "Settings", icon: <Ico.Settings /> },
  ];

  const HEADER_META = {
    home: { title: "Overview", sub: "Welcome back to your secure workspace." },
    files: {
      title: "My Files",
      sub: "Upload, download and share encrypted files.",
    },
    groups: {
      title: "My Groups",
      sub: "Create groups and share files with students.",
    },
    settings: { title: "Settings", sub: "Manage your account preferences." },
  };

  return (
    <div className="db-wrap">
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
            <div className="db-mini-role">
              {ROLE_META[user?.role]?.label || "Member"}
            </div>
          </div>
        </div>
      </aside>

      <main className="db-main">
        <header className="db-header">
          <div className="db-header-left">
            <h1 className="db-header-title">{HEADER_META[active]?.title}</h1>
            <p className="db-header-sub">{HEADER_META[active]?.sub}</p>
          </div>
          <button
            className="db-logout-btn"
            onClick={() => setShowLogoutDialog(true)}
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

          {!loading && !error && active === "files" && <FileManager />}
          {!loading && !error && active === "groups" && isProfessor && (
            <GroupsPage />
          )}
          {!loading && !error && active === "settings" && (
            <SettingsPage user={user} onUserUpdate={(u) => setUser(u)} />
          )}
        </div>
      </main>

      {/* Logout Dialog */}
      {showLogoutDialog && (
        <div
          className="logout-modal-overlay"
          onClick={() => setShowLogoutDialog(false)}
        >
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="logout-modal-icon">
              <Ico.LogOut />
            </div>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to leave your secure workspace?</p>
            <div className="logout-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowLogoutDialog(false)}
                disabled={loggingOut}
              >
                Stay
              </button>
              <button
                className="btn-confirm"
                disabled={loggingOut}
                onClick={() => {
                  setShowLogoutDialog(false);
                  handleLogout();
                }}
              >
                {loggingOut ? (
                  <span
                    className="db-spinner"
                    style={{
                      borderTopColor: "#fff",
                      borderColor: "rgba(255,255,255,0.3)",
                    }}
                  />
                ) : (
                  <>
                    <Ico.LogOut /> Yes, Logout
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
