import { useState } from "react";

import "../styles/auth.css";

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
    <line x1="2" y1="2" x2="22" y2="22"/>
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

export default function Login({ onSwitch }) {
  const [form, setForm]     = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert]   = useState(null);
  const [showPw, setShowPw] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "At least 6 characters";
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setAlert(null);
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      localStorage.setItem("token", data.Token);
      setAlert({ type: "success", msg: "Login successful! Redirecting…" });
    } catch (err) {
      setAlert({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <div className="lp-wrap">

        {/* ── Left decorative panel ── */}
        <div className="lp-side">
          <div className="lp-side-badge">
            <div className="lp-side-badge-icon">
              <ShieldIcon />
            </div>
            <span>SecureVault Platform</span>
          </div>

          <h2 className="lp-side-heading">
            Your files,<br/><em>protected</em><br/>always.
          </h2>
          <p className="lp-side-desc">
            AES-256 encryption, role-based access, and real-time audit logs keep your academic data safe.
          </p>

          <div className="lp-side-dots">
            <div className="lp-side-dot active" />
            <div className="lp-side-dot" />
            <div className="lp-side-dot" />
          </div>

          {/* Floating info cards */}
          <div className="lp-float-card top">
            <div className="fc-dot" />
            <div>
              <div className="fc-text">AES-256 Encrypted</div>
              <div className="fc-sub">All files secured</div>
            </div>
          </div>
          <div className="lp-float-card bottom">
            <div className="fc-text">🔒 Zero breaches</div>
            <div className="fc-sub">Enterprise-grade security</div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="lp-form-panel">
          <div className="lp-form-box">

            <div className="lp-form-top">
              <p className="lp-form-eyebrow">Welcome back</p>
              <h1 className="lp-form-title">Sign in to<br/>your account</h1>
              <p className="lp-form-sub">Enter your credentials to access your secure dashboard.</p>
            </div>

            {alert && (
              <div className={`lp-alert ${alert.type}`}>
                {alert.type === "error" ? <AlertIcon /> : <CheckIcon />}
                <span>{alert.msg}</span>
              </div>
            )}

            <form onSubmit={submit} noValidate>
              {/* Email */}
              <div className="lp-field">
                <label className="lp-field-label">Email address</label>
                <div className="lp-field-wrap">
                  <input
                    className={`lp-input${errors.email ? " has-error" : ""}`}
                    type="email"
                    placeholder="you@university.edu"
                    value={form.email}
                    onChange={set("email")}
                    autoComplete="email"
                  />
                  <span className="lp-field-icon"><MailIcon /></span>
                </div>
                {errors.email && <div className="lp-field-err">{errors.email}</div>}
              </div>

              {/* Password */}
              <div className="lp-field">
                <label className="lp-field-label">Password</label>
                <div className="lp-field-wrap">
                  <input
                    className={`lp-input${errors.password ? " has-error" : ""}`}
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={set("password")}
                    autoComplete="current-password"
                  />
                  <span className="lp-field-icon"><LockIcon /></span>
                  <button type="button" className="lp-field-eye" onClick={() => setShowPw(v => !v)}>
                    {showPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password && <div className="lp-field-err">{errors.password}</div>}
              </div>

              <div className="lp-forgot-row">
                <a className="lp-link">Forgot password?</a>
              </div>

              <button type="submit" className="lp-btn" disabled={loading}>
                {loading ? <span className="lp-spinner" /> : <>Sign in <ArrowIcon /></>}
              </button>
            </form>

            <div className="lp-divider">or</div>

            <p className="lp-switch">
              Don't have an account?{" "}
              <span className="lp-link" onClick={onSwitch}>Create one →</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
