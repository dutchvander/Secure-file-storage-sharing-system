import "../styles/page-loader.css";

const ShieldIcon = () => (
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
);

export default function PageLoader({ message = "Securing your workspace…" }) {
  return (
    <div className="pl-wrap">
      <div className="pl-blob top" />
      <div className="pl-blob bottom" />

      <div className="pl-card">
        <div className="pl-logo-ring">
          <div className="pl-logo-icon">
            <ShieldIcon />
          </div>
          <svg className="pl-ring-svg" viewBox="0 0 80 80">
            <defs>
              <linearGradient id="plGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            <circle className="pl-ring-track" cx="40" cy="40" r="34" />
            <circle className="pl-ring-progress" cx="40" cy="40" r="34" />
          </svg>
        </div>

        <p className="pl-title">SecureVault</p>
        <p className="pl-sub">{message}</p>

        <div className="pl-dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
