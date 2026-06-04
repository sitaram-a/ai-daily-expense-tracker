import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ─────────────────────────────────────────────
   STYLES  (scoped with sb- prefix)
───────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --sb-ink2:        #1c1a26;
    --sb-surface:     rgba(255,255,255,0.04);
    --sb-surface2:    rgba(255,255,255,0.08);
    --sb-border:      rgba(255,255,255,0.10);
    --sb-border2:     rgba(255,255,255,0.18);
    --sb-text:        #f0edf9;
    --sb-text2:       #9e98b8;
    --sb-text3:       #6b6485;
    --sb-accent:      #a78bfa;
    --sb-accent2:     #7c3aed;
    --sb-accent-glow: rgba(167,139,250,0.2);
    --sb-green:       #34d399;
    --sb-coral:       #f87171;
    --sb-teal:        #22d3ee;
    --sb-sans:        'DM Sans', sans-serif;
    --sb-mono:        'DM Mono', monospace;
  }

  /* ── Shell ── */
  .sb-sidebar {
    width: 220px;
    min-height: 100vh;
    background: var(--sb-ink2);
    border-right: 0.5px solid var(--sb-border);
    display: flex;
    flex-direction: column;
    padding: 24px 14px 28px;
    position: relative;
    overflow: hidden;
    font-family: var(--sb-sans);
    animation: sb-slide-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
    flex-shrink: 0;
  }
  @keyframes sb-slide-in {
    from { transform: translateX(-24px); opacity: 0; }
    to   { transform: none; opacity: 1; }
  }

  /* Subtle grid bg */
  .sb-sidebar::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(167,139,250,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(167,139,250,0.025) 1px, transparent 1px);
    background-size: 32px 32px;
  }

  /* Top glow orb */
  .sb-sidebar::after {
    content: ''; position: absolute;
    width: 260px; height: 260px; border-radius: 50%;
    top: -120px; left: -80px; pointer-events: none;
    background: radial-gradient(circle, rgba(167,139,250,0.10) 0%, transparent 65%);
  }

  /* ── Logo ── */
  .sb-logo {
    display: flex; align-items: center; gap: 9px;
    padding: 0 8px; margin-bottom: 28px;
    animation: sb-fade-up 0.4s ease 0.10s both;
  }
  .sb-logo-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--sb-accent);
    box-shadow: 0 0 10px var(--sb-accent), 0 0 18px var(--sb-accent-glow);
    animation: sb-pulse 2s ease-in-out infinite;
    flex-shrink: 0;
  }
  @keyframes sb-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.7; transform: scale(1.3); }
  }
  .sb-logo-name {
    font-size: 15px; font-weight: 600;
    color: var(--sb-text); letter-spacing: -0.3px;
  }
  .sb-logo-badge {
    font-size: 9px; font-family: var(--sb-mono); letter-spacing: 0.6px;
    background: rgba(167,139,250,0.12);
    border: 0.5px solid rgba(167,139,250,0.25);
    color: var(--sb-accent); border-radius: 20px;
    padding: 2px 7px; margin-left: auto;
  }

  /* ── Section label ── */
  .sb-section-label {
    font-size: 10px; font-weight: 500; letter-spacing: 1.2px;
    text-transform: uppercase; color: var(--sb-text3);
    padding: 0 10px; margin-bottom: 6px;
    animation: sb-fade-up 0.4s ease 0.18s both;
  }

  /* ── Nav list ── */
  .sb-nav {
    list-style: none; padding: 0;
    display: flex; flex-direction: column; gap: 2px;
    margin-bottom: auto;
  }
  .sb-nav + .sb-nav {
    margin-bottom: 14px;
    margin-top: 0;
    auto: unset;
  }

  /* ── Nav item ── */
  .sb-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 10px; border-radius: 9px;
    cursor: pointer; position: relative;
    transition: background 0.15s, color 0.15s;
    color: var(--sb-text2); font-size: 13px; font-weight: 400;
    animation: sb-fade-up 0.4s ease both;
    user-select: none;
    border: 0.5px solid transparent;
  }
  .sb-nav-item:hover {
    background: var(--sb-surface2);
    color: var(--sb-text);
  }
  .sb-nav-item.active {
    background: linear-gradient(135deg, rgba(124,58,237,0.22), rgba(167,139,250,0.10));
    color: var(--sb-text); font-weight: 500;
    border-color: rgba(167,139,250,0.18);
  }
  /* Active left accent bar */
  .sb-nav-item.active::before {
    content: ''; position: absolute;
    left: -14px; top: 50%; transform: translateY(-50%);
    width: 3px; height: 60%; border-radius: 0 3px 3px 0;
    background: var(--sb-accent);
    box-shadow: 0 0 8px var(--sb-accent);
  }
  .sb-nav-icon {
    font-size: 15px; flex-shrink: 0;
    width: 20px; text-align: center;
    transition: transform 0.2s;
  }
  .sb-nav-item:hover .sb-nav-icon { transform: scale(1.1); }
  .sb-nav-item.active .sb-nav-icon {
    filter: drop-shadow(0 0 6px rgba(167,139,250,0.5));
  }
  .sb-nav-label { flex: 1; }

  /* Inline badge */
  .sb-item-badge {
    font-size: 10px; font-family: var(--sb-mono);
    padding: 2px 7px; border-radius: 20px; font-weight: 500;
  }
  .sb-badge-green {
    background: rgba(52,211,153,0.12); color: var(--sb-green);
    border: 0.5px solid rgba(52,211,153,0.25);
  }
  .sb-badge-coral {
    background: rgba(248,113,113,0.12); color: var(--sb-coral);
    border: 0.5px solid rgba(248,113,113,0.25);
  }

  /* ── Divider ── */
  .sb-divider {
    height: 0.5px; background: var(--sb-border);
    margin: 14px 4px;
    animation: sb-fade-up 0.4s ease 0.40s both;
  }

  /* ── User card ── */
  .sb-user {
    display: flex; align-items: center; gap: 10px;
    padding: 10px; border-radius: 9px;
    background: var(--sb-surface);
    border: 0.5px solid var(--sb-border);
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    animation: sb-fade-up 0.4s ease 0.55s both;
    margin-top: auto;
  }
  .sb-user:hover {
    background: var(--sb-surface2);
    border-color: var(--sb-border2);
  }
  .sb-avatar {
    width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--sb-accent2), var(--sb-teal));
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 600; color: #fff; letter-spacing: 0.5px;
    font-family: var(--sb-mono);
  }
  .sb-user-info { flex: 1; min-width: 0; }
  .sb-user-name {
    font-size: 12px; font-weight: 500; color: var(--sb-text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .sb-user-role { font-size: 10px; color: var(--sb-text3); }
  .sb-user-arrow { font-size: 14px; color: var(--sb-text3); }

  /* ── Keyframes ── */
  @keyframes sb-fade-up {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: none; }
  }
`;

/* ─────────────────────────────────────────────
   NAV CONFIG  — edit routes/icons/badges here
───────────────────────────────────────────── */
const MAIN_NAV = [
  { label: "Dashboard", icon: "▦",  path: "/dashboard" },
  { label: "Expenses",  icon: "💸", path: "/expenses",  badge: { text: "12", type: "coral" } },
  { label: "Reports",   icon: "📊", path: "/reports",   badge: { text: "New", type: "green" } },
];

const ACCOUNT_NAV = [
  { label: "Profile",  icon: "👤", path: "/profile" },
  { label: "Settings", icon: "⚙️", path: "/settings" },
];

/* ─────────────────────────────────────────────
   NAV ITEM
───────────────────────────────────────────── */
function NavItem({ item, active, delay, onClick }) {
  return (
    <li
      className={`sb-nav-item${active ? " active" : ""}`}
      style={{ animationDelay: delay }}
      onClick={onClick}
    >
      <span className="sb-nav-icon">{item.icon}</span>
      <span className="sb-nav-label">{item.label}</span>
      {item.badge && (
        <span className={`sb-item-badge sb-badge-${item.badge.type}`}>
          {item.badge.text}
        </span>
      )}
    </li>
  );
}

/* ─────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────── */
function Sidebar() {
  // If using React Router, swap useState for useLocation / useNavigate
  const [active, setActive] = useState("/dashboard");

  // Uncomment these two lines if you have react-router-dom set up:
  // const location = useLocation();
  // const navigate  = useNavigate();
  // const active = location.pathname;
  // const setActive = (path) => navigate(path);

  return (
    <>
      <style>{CSS}</style>

      <div className="sb-sidebar">

        {/* ── Logo ── */}
        <div className="sb-logo">
          <div className="sb-logo-dot" />
          <span className="sb-logo-name">SpendLens</span>
          <span className="sb-logo-badge">PRO</span>
        </div>

        {/* ── Main nav ── */}
        <div className="sb-section-label" style={{ animationDelay: "0.20s" }}>Main</div>
        <ul className="sb-nav">
          {MAIN_NAV.map((item, i) => (
            <NavItem
              key={item.path}
              item={item}
              active={active === item.path}
              delay={`${0.22 + i * 0.06}s`}
              onClick={() => setActive(item.path)}
            />
          ))}
        </ul>

        <div className="sb-divider" />

        {/* ── Account nav ── */}
        <div className="sb-section-label" style={{ animationDelay: "0.40s" }}>Account</div>
        <ul className="sb-nav" style={{ marginBottom: 16, marginTop: 0 }}>
          {ACCOUNT_NAV.map((item, i) => (
            <NavItem
              key={item.path}
              item={item}
              active={active === item.path}
              delay={`${0.42 + i * 0.05}s`}
              onClick={() => setActive(item.path)}
            />
          ))}
        </ul>

        {/* ── User card ── */}
        <div className="sb-user" onClick={() => setActive("/profile")}>
          <div className="sb-avatar">AK</div>
          <div className="sb-user-info">
            <div className="sb-user-name">Arjun Kumar</div>
            <div className="sb-user-role">Personal Plan</div>
          </div>
          <span className="sb-user-arrow">›</span>
        </div>

      </div>
    </>
  );
}

export default Sidebar;