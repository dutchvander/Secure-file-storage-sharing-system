import { useState } from "react";
import "../styles/auth.css";

/* ─── icons ─────────────────────────────────────────────────────── */
const Ico = {
  Eye: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>,
  Mail: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Lock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  User: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Arrow: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  Alert: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  CheckCircle: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Scan: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><rect x="7" y="7" width="10" height="10" rx="1"/></svg>,
  File: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
};

/* ─── password strength ─────────────────────────────────────────── */
const getStrength = (pw) => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};
const COLORS = ["#ef4444","#f97316","#eab308","#22c55e"];
const LABELS = ["Weak","Fair","Good","Strong"];

export default function Register({ onSwitch }) {
  const [form, setForm] = useState({
    name: "", email: "",
    password: "", password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert]     = useState(null);
  const [showPw, setShowPw]   = useState(false);
  const [showCf, setShowCf]   = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name  = "Full name is required";
    if (!form.email) e.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Password required";
    else if (form.password.length < 8) e.password = "Min 8 characters";
    if (form.password !== form.password_confirmation)
      e.password_confirmation = "Passwords don't match";
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
      const res = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      setAlert({ type: "success", msg: "Account created! Please login." });
    } catch (err) {
      setAlert({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password ? getStrength(form.password) : 0;

  return (
    <>
      
      <div className="rp-wrap">

        {/* ── Left panel ── */}
        <div className="rp-side">
          <div className="rp-side-logo">
            <div className="rp-logo-icon"><Ico.Shield /></div>
            <span className="rp-logo-name">SecureVault</span>
          </div>

          <div className="rp-side-mid">
            <span className="rp-side-label">Academic Platform</span>
            <h2 className="rp-side-heading">
              Join the<br/><em>secure</em><br/>workspace.
            </h2>
            <p className="rp-side-desc">
              Upload, share, and manage academic files with enterprise-grade protection built in.
            </p>
          </div>

          <div className="rp-features">
            {[
              { icon: <Ico.Shield />, text: <><strong>AES-256</strong> file encryption</> },
              { icon: <Ico.Scan />,   text: <><strong>ClamAV</strong> malware scanning</> },
              { icon: <Ico.File />,   text: <><strong>Audit logs</strong> for every action</> },
            ].map((f, i) => (
              <div className="rp-feature" key={i}>
                <div className="rp-feature-icon">{f.icon}</div>
                <span className="rp-feature-text">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="rp-form-panel">
          <div className="rp-form-box">

            {/* Step indicator */}
            <div className="rp-steps">
              <div className="rp-step done">
                <div className="rp-step-num"><Ico.Check /></div>
                <span className="rp-step-label">Details</span>
              </div>
              <div className="rp-step-line done" />
              <div className="rp-step active">
                <div className="rp-step-num">2</div>
                <span className="rp-step-label">Register</span>
              </div>
              <div className="rp-step-line" />
              <div className="rp-step pending">
                <div className="rp-step-num">3</div>
                <span className="rp-step-label">Access</span>
              </div>
            </div>

            <div className="rp-form-top">
              <p className="rp-form-eyebrow">Create account</p>
              <h1 className="rp-form-title">Set up your<br/>profile</h1>
              <p className="rp-form-sub">Fill in the details below to get started.</p>
            </div>

            {alert && (
              <div className={`rp-alert ${alert.type}`}>
                {alert.type === "error" ? <Ico.Alert /> : <Ico.CheckCircle />}
                <span>{alert.msg}</span>
              </div>
            )}

            <form onSubmit={submit} noValidate>
              {/* Full Name */}
              <div className="rp-field">
                <label className="rp-field-label">Full name</label>
                <div className="rp-field-wrap">
                  <input
                    className={`rp-input${errors.name ? " has-error" : ""}`}
                    placeholder="Yassine Benali"
                    value={form.name}
                    onChange={set("name")}
                    autoComplete="name"
                  />
                  <span className="rp-field-icon"><Ico.User /></span>
                </div>
                {errors.name && <div className="rp-field-err">{errors.name}</div>}
              </div>

              {/* Email */}
              <div className="rp-field">
                <label className="rp-field-label">University email</label>
                <div className="rp-field-wrap">
                  <input
                    className={`rp-input${errors.email ? " has-error" : ""}`}
                    type="email"
                    placeholder="you@university.edu"
                    value={form.email}
                    onChange={set("email")}
                    autoComplete="email"
                  />
                  <span className="rp-field-icon"><Ico.Mail /></span>
                </div>
                {errors.email && <div className="rp-field-err">{errors.email}</div>}
              </div>

              {/* Password */}
              <div className="rp-field">
                <label className="rp-field-label">Password</label>
                <div className="rp-field-wrap">
                  <input
                    className={`rp-input${errors.password ? " has-error" : ""}`}
                    type={showPw ? "text" : "password"}
                    placeholder="Min 8 characters"
                    value={form.password}
                    onChange={set("password")}
                    autoComplete="new-password"
                  />
                  <span className="rp-field-icon"><Ico.Lock /></span>
                  <button type="button" className="rp-field-eye" onClick={() => setShowPw(v => !v)}>
                    {showPw ? <Ico.EyeOff /> : <Ico.Eye />}
                  </button>
                </div>
                {errors.password && <div className="rp-field-err">{errors.password}</div>}
                {form.password && (
                  <div className="rp-strength">
                    <div className="rp-strength-bar">
                      {[0,1,2,3].map(i => (
                        <div key={i} className="rp-seg"
                          style={{ background: i < strength ? COLORS[strength-1] : undefined }} />
                      ))}
                    </div>
                    <div className="rp-strength-label" style={{ color: COLORS[strength-1] }}>
                      {LABELS[strength-1]} password
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="rp-field">
                <label className="rp-field-label">Confirm password</label>
                <div className="rp-field-wrap">
                  <input
                    className={`rp-input${errors.password_confirmation ? " has-error" : ""}`}
                    type={showCf ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={form.password_confirmation}
                    onChange={set("password_confirmation")}
                    autoComplete="new-password"
                  />
                  <span className="rp-field-icon"><Ico.Lock /></span>
                  <button type="button" className="rp-field-eye" onClick={() => setShowCf(v => !v)}>
                    {showCf ? <Ico.EyeOff /> : <Ico.Eye />}
                  </button>
                </div>
                {errors.password_confirmation && <div className="rp-field-err">{errors.password_confirmation}</div>}
              </div>

              <button type="submit" className="rp-btn" disabled={loading}>
                {loading ? <span className="rp-spinner" /> : <>Create account <Ico.Arrow /></>}
              </button>
            </form>

            <p className="rp-terms">
              By registering you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
            </p>

            <div className="rp-divider">or</div>

            <p className="rp-switch">
              Already have an account?{" "}
              <span className="rp-link" onClick={onSwitch}>Sign in →</span>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}
