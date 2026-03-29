import { useState, useEffect, useRef } from "react";

/* ─── Icons ─── */
const Ico = {
  Upload: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  Download: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
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
  Alert: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
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
};

const API = "http://127.0.0.1:8000/api";
const token = () => localStorage.getItem("token");
const headers = () => ({
  Authorization: `Bearer ${token()}`,
  Accept: "application/json",
});

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

const isPreviewable = (mime = "") =>
  mime.startsWith("image/") ||
  mime === "application/pdf" ||
  mime.startsWith("text/");

/* ══════════════════════════════════════════════════════════════
   STATUS BADGE  ← جديد
   يعرض حالة فحص ClamAV بجانب كل ملف
══════════════════════════════════════════════════════════════ */
function StatusBadge({ status }) {
  if (!status || status === "pending") {
    return (
      <span className="fm-status-badge pending" title="Awaiting scan">
        🔄 Pending
      </span>
    );
  }
  if (status === "safe") {
    return (
      <span
        className="fm-status-badge safe"
        title="Scanned by ClamAV — No threats found"
      >
        🟢 Safe
      </span>
    );
  }
  if (status === "infected") {
    return (
      <span
        className="fm-status-badge infected"
        title="Malware detected — Access blocked"
      >
        🔴 Infected
      </span>
    );
  }
  return null;
}

/* ══════════════════════════════════════════════════════════════
   UPLOAD PHASE INDICATOR  ← جديد
   يعرض مراحل الرفع: Uploading → Scanning → Encrypting → Done
══════════════════════════════════════════════════════════════ */
function UploadPhase({ phase }) {
  if (!phase) return null;

  const phases = [
    { key: "uploading", label: "Uploading…" },
    { key: "scanning", label: "Scanning for malware…" },
    { key: "encrypting", label: "Encrypting & saving…" },
  ];

  return (
    <div className="fm-upload-phases">
      {phases.map((p) => (
        <span
          key={p.key}
          className={`fm-upload-phase${phase === p.key ? " active" : ""}${
            phases.findIndex((x) => x.key === phase) >
            phases.findIndex((x) => x.key === p.key)
              ? " done"
              : ""
          }`}
        >
          {phase === p.key && <span className="fm-spinner" />}
          {phases.findIndex((x) => x.key === phase) >
            phases.findIndex((x) => x.key === p.key) && "✓ "}
          {p.label}
        </span>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════════════ */
function Toast({ toast, onDone }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [toast, onDone]);

  if (!toast) return null;
  return (
    <div className={`fm-toast ${toast.type}`}>
      {toast.type === "success" ? <Ico.Check /> : <Ico.XCircle />}
      <span>{toast.msg}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PREVIEW MODAL
══════════════════════════════════════════════════════════════ */
function PreviewModal({ file, onClose }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [textData, setTextData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let url = null;
    (async () => {
      try {
        const res = await fetch(`${API}/files/${file.id}/view`, {
          headers: headers(),
        });
        if (!res.ok) {
          const d = await res.json();
          setError(d.message || "Cannot load preview.");
          return;
        }
        const blob = await res.blob();
        if (file.mime_type.startsWith("text/")) {
          setTextData(await blob.text());
        } else {
          url = URL.createObjectURL(blob);
          setBlobUrl(url);
        }
      } catch {
        setError("Failed to load file preview.");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [file.id, file.mime_type]);

  const isImg = file.mime_type.startsWith("image/");
  const isPdf = file.mime_type === "application/pdf";
  const isTxt = file.mime_type.startsWith("text/");

  return (
    <div className="fm-modal-overlay fm-preview-overlay" onClick={onClose}>
      <div className="fm-preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="fm-preview-header">
          <div className="fm-preview-title">
            <span>{fileIcon(file.mime_type)}</span>
            <span>{file.original_name}</span>
            <span className="fm-preview-size">{file.formatted_size}</span>
            <StatusBadge status={file.status} />
          </div>
          <button className="fm-modal-close" onClick={onClose}>
            <Ico.X />
          </button>
        </div>
        <div className="fm-preview-body">
          {loading && (
            <div className="fm-preview-loading">
              <span className="fm-spinner dark" />
              <p>Decrypting and loading preview…</p>
            </div>
          )}
          {error && !loading && (
            <div className="fm-preview-error">
              <Ico.Alert />
              <p>{error}</p>
            </div>
          )}
          {!loading && !error && isImg && blobUrl && (
            <div className="fm-preview-img-wrap">
              <img
                src={blobUrl}
                alt={file.original_name}
                className="fm-preview-img"
              />
            </div>
          )}
          {!loading && !error && isPdf && blobUrl && (
            <iframe
              src={blobUrl}
              title={file.original_name}
              className="fm-preview-iframe"
            />
          )}
          {!loading && !error && isTxt && textData !== null && (
            <pre className="fm-preview-text">{textData}</pre>
          )}
          {!loading && !error && !isImg && !isPdf && !isTxt && (
            <div className="fm-preview-unsupported">
              <span style={{ fontSize: 48 }}>{fileIcon(file.mime_type)}</span>
              <p>Preview not available for this file type.</p>
              <p className="fm-preview-unsupported-sub">
                Use the Download button to access this file.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SHARE MODAL
══════════════════════════════════════════════════════════════ */
function ShareModal({ file, onClose, onShared }) {
  const [users, setUsers] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [permission, setPermission] = useState("download");
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // ← جديد
  const [userSearch, setUserSearch] = useState(""); // ← جديد
  const [showDropdown, setShowDropdown] = useState(false); // ← جديد

  useEffect(() => {
    fetch(`${API}/users/list`, { headers: headers() })
      .then((r) => r.json())
      .then((d) => setUsers(d.users ?? []));
  }, []);

  const submit = async () => {
    if (!selectedId) {
      setError("Please select a user.");
      return;
    }
    setSharing(true);
    setError("");
    try {
      const res = await fetch(`${API}/files/share`, {
        method: "POST",
        headers: { ...headers(), "Content-Type": "application/json" },
        body: JSON.stringify({
          file_id: file.id,
          shared_with: selectedId,
          permission,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Share failed");
      onShared(`"${file.original_name}" shared successfully.`);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="fm-modal-overlay" onClick={onClose}>
      <div className="fm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="fm-modal-header">
          <h3 className="fm-modal-title">Share File</h3>
          <button className="fm-modal-close" onClick={onClose}>
            <Ico.X />
          </button>
        </div>
        <div className="fm-modal-file">
          <span className="fm-modal-file-icon">{fileIcon(file.mime_type)}</span>
          <div>
            <div className="fm-modal-file-name">{file.original_name}</div>
            <div className="fm-modal-file-size">{file.formatted_size}</div>
          </div>
        </div>

        <label className="fm-label">Share with</label>

        {/* ── Search User ── */}
        <div style={{ position: "relative" }}>
          <div className="grp-search-wrap">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="grp-search-icon"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="grp-search-input"
              placeholder="Search by name or email…"
              value={userSearch}
              onChange={(e) => {
                setUserSearch(e.target.value);
                setShowDropdown(true);
                if (!e.target.value) {
                  setSelectedId("");
                  setSelectedUser(null);
                }
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              autoComplete="off"
            />
            {userSearch && (
              <button
                className="grp-search-clear"
                onClick={() => {
                  setUserSearch("");
                  setSelectedId("");
                  setSelectedUser(null);
                  setShowDropdown(false);
                }}
              >
                <Ico.X />
              </button>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "#fff",
                border: "1.5px solid #e5e7eb",
                borderRadius: 10,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                zIndex: 50,
                maxHeight: 220,
                overflowY: "auto",
                marginTop: 4,
              }}
            >
              {users
                .filter((u) => {
                  const q = userSearch.toLowerCase();
                  return (
                    u.name.toLowerCase().includes(q) ||
                    u.email.toLowerCase().includes(q)
                  );
                })
                .map((u) => (
                  <div
                    key={u.id}
                    onMouseDown={(e) => {
                      e.preventDefault(); // ← هذا يمنع onBlur من الإطلاق
                      setSelectedId(u.id);
                      setSelectedUser(u);
                      setUserSearch(`${u.name} — ${u.email}`);
                      setShowDropdown(false);
                    }}
                    style={{
                      padding: "10px 14px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f3f4f6",
                      background:
                        selectedId === u.id ? "rgba(99,102,241,0.06)" : "#fff",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f5f3ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        selectedId === u.id ? "rgba(99,102,241,0.06)" : "#fff")
                    }
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: "#111827",
                      }}
                    >
                      {u.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>
                      {u.email} · {u.role}
                    </div>
                  </div>
                ))}
              {users.filter((u) => {
                const q = userSearch.toLowerCase();
                return (
                  u.name.toLowerCase().includes(q) ||
                  u.email.toLowerCase().includes(q)
                );
              }).length === 0 && (
                <div
                  style={{
                    padding: "14px",
                    textAlign: "center",
                    color: "#9ca3af",
                    fontSize: 13,
                  }}
                >
                  No users match "{userSearch}"
                </div>
              )}
            </div>
          )}
        </div>
        <label className="fm-label" style={{ marginTop: 14 }}>
          Permission
        </label>
        <div className="fm-permission-row">
          {[
            {
              val: "view",
              label: "View Only",
              desc: "Can preview inside the app — cannot download",
            },
            {
              val: "download",
              label: "Download",
              desc: "Can preview and download the file",
            },
          ].map((p) => (
            <button
              key={p.val}
              className={`fm-perm-btn${permission === p.val ? " active" : ""}`}
              onClick={() => setPermission(p.val)}
            >
              <span className="fm-perm-label">{p.label}</span>
              <span className="fm-perm-desc">{p.desc}</span>
            </button>
          ))}
        </div>
        {error && (
          <div className="fm-error-note">
            <Ico.Alert />
            {error}
          </div>
        )}
        <div className="fm-modal-actions">
          <button className="fm-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="fm-btn-share" onClick={submit} disabled={sharing}>
            {sharing ? (
              <span className="fm-spinner" />
            ) : (
              <>
                <Ico.Share /> Share
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DELETE MODAL
══════════════════════════════════════════════════════════════ */
function DeleteModal({ file, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);

  const confirm = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${API}/files/${file.id}`, {
        method: "DELETE",
        headers: headers(),
      });
      if (!res.ok) throw new Error();
      onDeleted(file.id, `"${file.original_name}" deleted.`);
      onClose();
    } catch {
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fm-modal-overlay" onClick={onClose}>
      <div
        className="fm-modal fm-modal--sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="fm-delete-icon">
          <Ico.Trash />
        </div>
        <h3 className="fm-modal-title" style={{ textAlign: "center" }}>
          Delete File
        </h3>
        <p className="fm-modal-desc">
          Are you sure you want to delete{" "}
          <strong>"{file.original_name}"</strong>? This cannot be undone.
        </p>
        <div className="fm-modal-actions">
          <button
            className="fm-btn-cancel"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            className="fm-btn-delete"
            onClick={confirm}
            disabled={deleting}
          >
            {deleting ? (
              <span className="fm-spinner" />
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

/* ══════════════════════════════════════════════════════════════
   FILE ROW  ← مع عمود Security Status
══════════════════════════════════════════════════════════════ */
function FileRow({
  file,
  onShare,
  onDelete,
  onPreview,
  downloading,
  onDownload,
}) {
  const date = file.created_at
    ? new Date(file.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <tr className="fm-tr">
      <td className="fm-td">
        <div className="fm-file-cell">
          <span className="fm-file-emoji">{fileIcon(file.mime_type)}</span>
          <div>
            <div className="fm-file-name">{file.original_name}</div>
            <div className="fm-file-meta">{file.formatted_size}</div>
          </div>
        </div>
      </td>
      <td className="fm-td fm-td--muted">{date}</td>
      {/* عمود الأمان: Encrypted + نتيجة الفحص */}
      <td className="fm-td">
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span className="fm-encrypted-badge">
            <Ico.Shield /> Encrypted
          </span>
          <StatusBadge status={file.status} />
        </div>
      </td>
      <td className="fm-td fm-td--actions">
        {isPreviewable(file.mime_type) && (
          <button
            className="fm-action-btn view"
            onClick={() => onPreview(file)}
            title="Preview"
          >
            <Ico.Eye />
            <span>View</span>
          </button>
        )}
        <button
          className="fm-action-btn download"
          onClick={() => onDownload(file)}
          disabled={downloading === file.id}
          title="Download"
        >
          {downloading === file.id ? (
            <span className="fm-spinner dark" />
          ) : (
            <Ico.Download />
          )}
          <span>Download</span>
        </button>
        {onShare && (
          <button
            className="fm-action-btn share"
            onClick={() => onShare(file)}
            title="Share"
          >
            <Ico.Share />
            <span>Share</span>
          </button>
        )}
        <button
          className="fm-action-btn delete"
          onClick={() => onDelete(file)}
          title="Delete"
        >
          <Ico.Trash />
          <span>Delete</span>
        </button>
      </td>
    </tr>
  );
}

/* ══════════════════════════════════════════════════════════════
   SHARED ROW
══════════════════════════════════════════════════════════════ */
function SharedRow({
  item,
  type,
  downloading,
  onDownload,
  onRevoke,
  onPreview,
}) {
  const file = item.file;
  const date = item.shared_at
    ? new Date(item.shared_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  const perm = item.permission ?? "";
  const canView =
    type === "with-me" && ["view", "read", "download"].includes(perm);
  const canDownload = type === "with-me" && perm === "download";

  return (
    <tr className="fm-tr">
      <td className="fm-td">
        <div className="fm-file-cell">
          <span className="fm-file-emoji">{fileIcon(file?.mime_type)}</span>
          <div>
            <div className="fm-file-name">{file?.original_name ?? "—"}</div>
            <div className="fm-file-meta">{file?.formatted_size}</div>
          </div>
        </div>
      </td>
      <td className="fm-td fm-td--muted">
        {type === "with-me" ? item.shared_by : item.shared_with}
      </td>
      <td className="fm-td">
        <span className={`fm-perm-badge ${item.permission}`}>
          {item.permission === "view" ? "View Only" : "Download"}
        </span>
      </td>
      <td className="fm-td fm-td--muted">{date}</td>
      <td className="fm-td fm-td--actions">
        {canView && file && isPreviewable(file.mime_type) && (
          <button
            className="fm-action-btn view"
            onClick={() => onPreview(file)}
            title="Preview"
          >
            <Ico.Eye />
            <span>View</span>
          </button>
        )}
        {canDownload && file && (
          <button
            className="fm-action-btn download"
            onClick={() => onDownload(file)}
            disabled={downloading === file?.id}
            title="Download"
          >
            {downloading === file?.id ? (
              <span className="fm-spinner dark" />
            ) : (
              <Ico.Download />
            )}
            <span>Download</span>
          </button>
        )}
        {type === "by-me" && (
          <button
            className="fm-action-btn delete"
            onClick={() => onRevoke(item.share_id)}
            title="Revoke"
          >
            <Ico.XCircle />
            <span>Revoke</span>
          </button>
        )}
      </td>
    </tr>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function FileManager() {
  const role = localStorage.getItem("role") ?? "student";
  const canUpload = role === "student" || role === "professor";
  const canShare = role === "student" || role === "professor";

  const [tab, setTab] = useState("my");
  const [myFiles, setMyFiles] = useState([]);
  const [sharedWith, setSharedWith] = useState([]);
  const [sharedBy, setSharedBy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [uploadPhase, setUploadPhase] = useState(null); // ← جديد: مرحلة الرفع
  const [downloading, setDownloading] = useState(null);
  const [shareFile, setShareFile] = useState(null);
  const [deleteFile, setDeleteFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [toast, setToast] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  /* ── Fetch ── */
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [myRes, withRes, byRes] = await Promise.all([
        fetch(`${API}/files`, { headers: headers() }),
        fetch(`${API}/files/shared-with-me`, { headers: headers() }),
        fetch(`${API}/files/shared-by-me`, { headers: headers() }),
      ]);
      const [myData, withData, byData] = await Promise.all([
        myRes.json(),
        withRes.json(),
        byRes.json(),
      ]);
      setMyFiles(myData.files ?? []);
      setSharedWith(withData.files ?? []);
      setSharedBy(byData.files ?? []);
    } catch {
      showToast("error", "Failed to load files.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const showToast = (type, msg) => setToast({ type, msg });

  /* ── Upload (مع مراحل scanning) ── */
  const handleUpload = async (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast("error", "File exceeds 10 MB limit.");
      return;
    }

    setUploading(true);
    setUploadPct(0);
    setUploadPhase("uploading");

    const formData = new FormData();
    formData.append("file", file);

    await new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API}/files/upload`);
      xhr.setRequestHeader("Authorization", `Bearer ${token()}`);
      xhr.setRequestHeader("Accept", "application/json");

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          setUploadPct(pct);
          // عندما ينتهي الـ upload → نظهر مرحلة scanning
          if (pct === 100) setUploadPhase("scanning");
        }
      };

      xhr.onload = () => {
        setUploadPhase("encrypting");

        // محاكاة لحظة قصيرة لتظهر مرحلة encrypting للمستخدم
        setTimeout(() => {
          if (xhr.status === 201) {
            const data = JSON.parse(xhr.responseText);
            setMyFiles((prev) => [data.file, ...prev]);
            showToast(
              "success",
              `"${data.file.original_name}" uploaded, scanned ✅ & encrypted.`,
            );
          } else {
            const data = JSON.parse(xhr.responseText);
            // رسالة خاصة إذا كان الملف مصاباً
            if (data.status === "infected") {
              showToast(
                "error",
                `🔴 Malware detected! "${file.name}" was rejected and blocked.`,
              );
            } else {
              showToast("error", data.message || "Upload failed.");
            }
          }
          resolve();
        }, 400);
      };

      xhr.onerror = () => {
        showToast("error", "Upload failed.");
        resolve();
      };

      xhr.send(formData);
    });

    setUploading(false);
    setUploadPct(0);
    setUploadPhase(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ── Download ── */
  const handleDownload = async (file) => {
    setDownloading(file.id);
    try {
      const res = await fetch(`${API}/files/${file.id}/download`, {
        headers: headers(),
      });
      if (!res.ok) {
        const d = await res.json();
        showToast("error", d.message || "Download failed.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.original_name;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showToast("error", "Download failed.");
    } finally {
      setDownloading(null);
    }
  };

  const handleDeleted = (id, msg) => {
    setMyFiles((prev) => prev.filter((f) => f.id !== id));
    showToast("success", msg);
  };

  const handleRevoke = async (shareId) => {
    try {
      const res = await fetch(`${API}/files/share/${shareId}`, {
        method: "DELETE",
        headers: headers(),
      });
      if (!res.ok) throw new Error();
      setSharedBy((prev) => prev.filter((s) => s.share_id !== shareId));
      showToast("success", "Share revoked.");
    } catch {
      showToast("error", "Failed to revoke share.");
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const TABS = [
    { key: "my", label: "My Files", count: myFiles.length },
    { key: "with-me", label: "Shared With Me", count: sharedWith.length },
    { key: "by-me", label: "Files I Shared", count: sharedBy.length },
  ];

  return (
    <div className="fm-wrap">
      {/* Upload zone */}
      {canUpload && (
        <div
          className={`fm-upload-zone${dragOver ? " drag" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <div className="fm-upload-icon">
            <Ico.Upload />
          </div>
          <div className="fm-upload-text">
            <span className="fm-upload-title">
              {dragOver ? "Drop to upload" : "Drag & drop files here"}
            </span>
            <span className="fm-upload-sub">
              or click to browse — max 10 MB
            </span>
          </div>
          <button
            className="fm-upload-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <span className="fm-spinner" />
                {uploadPhase === "uploading" && "Uploading…"}
                {uploadPhase === "scanning" && "Scanning…"}
                {uploadPhase === "encrypting" && "Encrypting…"}
              </>
            ) : (
              <>
                <Ico.Upload /> Choose File
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: "none" }}
            onChange={(e) => handleUpload(e.target.files[0])}
          />
        </div>
      )}

      {/* Progress bar + Phase indicator */}
      {canUpload && uploading && (
        <>
          <div className="fm-progress-wrap">
            <div
              className="fm-progress-bar"
              style={{ width: `${uploadPct}%` }}
            />
            <span className="fm-progress-pct">{uploadPct}%</span>
          </div>
          <UploadPhase phase={uploadPhase} />
        </>
      )}

      {/* Tabs */}
      <div className="fm-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`fm-tab${tab === t.key ? " active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            <span className="fm-tab-count">{t.count}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="fm-table-card">
        {loading ? (
          <div className="fm-loading">
            <span className="fm-spinner dark" />
            <p>Loading files…</p>
          </div>
        ) : (
          <>
            {/* MY FILES */}
            {tab === "my" &&
              (myFiles.length === 0 ? (
                <div className="fm-empty">
                  <Ico.File />
                  <p>No files yet. Upload your first file above.</p>
                </div>
              ) : (
                <table className="fm-table">
                  <thead>
                    <tr>
                      <th>File</th>
                      <th>Uploaded</th>
                      <th>Security</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myFiles.map((f) => (
                      <FileRow
                        key={f.id}
                        file={f}
                        downloading={downloading}
                        onDownload={handleDownload}
                        onPreview={setPreviewFile}
                        onShare={canShare ? setShareFile : null}
                        onDelete={setDeleteFile}
                      />
                    ))}
                  </tbody>
                </table>
              ))}

            {/* SHARED WITH ME */}
            {tab === "with-me" &&
              (sharedWith.length === 0 ? (
                <div className="fm-empty">
                  <Ico.Users />
                  <p>No files have been shared with you yet.</p>
                </div>
              ) : (
                <table className="fm-table">
                  <thead>
                    <tr>
                      <th>File</th>
                      <th>Shared By</th>
                      <th>Permission</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sharedWith.map((item) => (
                      <SharedRow
                        key={item.share_id}
                        item={item}
                        type="with-me"
                        downloading={downloading}
                        onDownload={handleDownload}
                        onPreview={setPreviewFile}
                      />
                    ))}
                  </tbody>
                </table>
              ))}

            {/* FILES I SHARED */}
            {tab === "by-me" &&
              (sharedBy.length === 0 ? (
                <div className="fm-empty">
                  <Ico.Share />
                  <p>You haven't shared any files yet.</p>
                </div>
              ) : (
                <table className="fm-table">
                  <thead>
                    <tr>
                      <th>File</th>
                      <th>Shared With</th>
                      <th>Permission</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sharedBy.map((item) => (
                      <SharedRow
                        key={item.share_id}
                        item={item}
                        type="by-me"
                        downloading={downloading}
                        onDownload={handleDownload}
                        onPreview={setPreviewFile}
                        onRevoke={handleRevoke}
                      />
                    ))}
                  </tbody>
                </table>
              ))}
          </>
        )}
      </div>

      {/* Modals */}
      {previewFile && (
        <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
      {shareFile && (
        <ShareModal
          file={shareFile}
          onClose={() => setShareFile(null)}
          onShared={(msg) => showToast("success", msg)}
        />
      )}
      {deleteFile && (
        <DeleteModal
          file={deleteFile}
          onClose={() => setDeleteFile(null)}
          onDeleted={handleDeleted}
        />
      )}

      <Toast toast={toast} onDone={() => setToast(null)} />
    </div>
  );
}
