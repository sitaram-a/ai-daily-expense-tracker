import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ─────────────────────────────────────────────
   STYLES  (scoped with nb- prefix)
───────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --nb-ink:         #0f0e13;
    --nb-ink2:        #1c1a26;
    --nb-surface:     rgba(255,255,255,0.04);
    --nb-surface2:    rgba(255,255,255,0.08);
    --nb-border:      rgba(255,255,255,0.10);
    --nb-border2:     rgba(255,255,255,0.18);
    --nb-text:        #f0edf9;
    --nb-text2:       #9e98b8;
    --nb-text3:       #6b6485;
    --nb-accent:      #a78bfa;
    --nb-accent2:     #7c3aed;
    --nb-accent-glow: rgba(167,139,250,0.22);
    --nb-coral:       #f87171;
    --nb-teal:        #22d3ee;
    --nb-sans:        'DM Sans', sans-serif;
    --nb-mono:        'DM Mono', monospace;
  }

  /* ── Bar ── */
  .nb-bar {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(15, 14, 19, 0.72);
    border-bottom: 0.5px solid var(--nb-border);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    font-family: var(--nb-sans);
    animation: nb-drop 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  @keyframes nb-drop {
    from { transform: translateY(-100%); opacity: 0; }
    to   { transform: none; opacity: 1; }
  }

  /* Glowing bottom edge */
  .nb-bar::after {
    content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--nb-accent-glow) 30%,
      rgba(34,211,238,0.18) 60%,
      transparent 100%
    );
  }

  /* ── Inner layout ── */
  .nb-inner {
    max-width: 1100px; margin: 0 auto;
    display: flex; align-items: center; gap: 16px;
    padding: 0 24px; height: 56px;
  }

  /* ── Brand ── */
  .nb-brand {
    display: flex; align-items: center; gap: 9px;
    cursor: pointer; text-decoration: none; flex-shrink: 0;
  }
  .nb-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
    background: var(--nb-accent);
    box-shadow: 0 0 10px var(--nb-accent), 0 0 18px var(--nb-accent-glow);
    animation: nb-pulse 2s ease-in-out infinite;
  }
  @keyframes nb-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.7; transform: scale(1.3); }
  }
  .nb-name {
    font-size: 15px; font-weight: 600;
    color: var(--nb-text); letter-spacing: -0.3px; white-space: nowrap;
  }
  .nb-ai-tag {
    font-size: 9px; font-family: var(--nb-mono); letter-spacing: 0.6px;
    background: rgba(167,139,250,0.12);
    border: 0.5px solid rgba(167,139,250,0.25);
    color: var(--nb-accent); border-radius: 20px; padding: 2px 7px;
  }

  /* ── Breadcrumb ── */
  .nb-crumb {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: var(--nb-text3); font-family: var(--nb-mono);
    animation: nb-fade 0.4s ease 0.25s both;
  }
  .nb-crumb-sep { opacity: 0.4; }
  .nb-crumb-current { color: var(--nb-text2); }

  /* ── Spacer ── */
  .nb-spacer { flex: 1; }

  /* ── Actions ── */
  .nb-actions {
    display: flex; align-items: center; gap: 8px;
    animation: nb-fade 0.4s ease 0.30s both;
  }

  /* Search pill */
  .nb-search {
    display: flex; align-items: center; gap: 7px;
    padding: 6px 12px; border-radius: 8px;
    border: 0.5px solid var(--nb-border); background: var(--nb-surface);
    font-size: 12px; color: var(--nb-text3); font-family: var(--nb-sans);
    cursor: pointer; transition: all 0.15s; white-space: nowrap;
  }
  .nb-search:hover {
    background: var(--nb-surface2);
    border-color: var(--nb-border2);
    color: var(--nb-text2);
  }
  .nb-search-icon { font-size: 13px; }
  .nb-search-kbd {
    font-size: 10px; font-family: var(--nb-mono);
    background: rgba(255,255,255,0.07);
    border: 0.5px solid var(--nb-border2);
    border-radius: 4px; padding: 1px 5px;
    color: var(--nb-text3); margin-left: 4px;
  }

  /* Icon button */
  .nb-icon-btn {
    width: 34px; height: 34px; border-radius: 8px;
    border: 0.5px solid var(--nb-border); background: var(--nb-surface);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.15s; font-size: 15px;
    position: relative;
  }
  .nb-icon-btn:hover { background: var(--nb-surface2); border-color: var(--nb-border2); }

  /* Notification red dot */
  .nb-notif-dot {
    position: absolute; top: 5px; right: 5px;
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--nb-coral);
    box-shadow: 0 0 6px var(--nb-coral);
    border: 1.5px solid var(--nb-ink2);
  }

  /* CTA button */
  .nb-cta {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 16px; border-radius: 8px; border: none;
    background: var(--nb-accent2); color: #fff;
    font-family: var(--nb-sans); font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.2s; white-space: nowrap;
    box-shadow: 0 0 16px rgba(124,58,237,0.3);
  }
  .nb-cta:hover { background: var(--nb-accent); transform: translateY(-1px); box-shadow: 0 0 24px rgba(167,139,250,0.4); }
  .nb-cta:active { transform: scale(0.97); }
  .nb-cta-plus { font-size: 17px; line-height: 1; }

  /* Avatar */
  .nb-avatar {
    width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--nb-accent2), var(--nb-teal));
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 600; color: #fff;
    font-family: var(--nb-mono); cursor: pointer;
    border: 1.5px solid rgba(167,139,250,0.3);
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .nb-avatar:hover {
    border-color: var(--nb-accent);
    box-shadow: 0 0 12px var(--nb-accent-glow);
  }

  /* ── Keyframes ── */
  @keyframes nb-fade {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: none; }
  }
`;

/* ─────────────────────────────────────────────
   CONFIG — edit these to match your app
───────────────────────────────────────────── */
const APP_NAME   = "SpendLens";
const USER_INITIALS = "AK";
const USER_NAME  = "Arjun Kumar";

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
function Navbar() {

  const navigate = useNavigate();
  
  const [hasNotif, setHasNotif] = useState(true);

  // React Router (optional) — uncomment if using react-router-dom
  // const location = useLocation();
  // const navigate  = useNavigate();
  // const page = location.pathname.replace("/", "") || "dashboard";
  // const pageName = page.charAt(0).toUpperCase() + page.slice(1);

  // Simple fallback breadcrumb label
  const pageName = "Dashboard";

  const handleSearch = () => {
    // Wire up your search / command palette here
    console.log("Search triggered");
  };

  const handleNotif = () => {
    setHasNotif(false);
    console.log("Notifications opened");
  };

  const handleAvatar = () => {
    console.log("Profile menu opened");
  };

  return (
    <>
      <style>{CSS}</style>

      <nav className="nb-bar">
        <div className="nb-inner">

          {/* ── Brand ── */}
          <div className="nb-brand">
            <div className="nb-dot" />
            <span className="nb-name">{APP_NAME}</span>
            <span className="nb-ai-tag">AI</span>
          </div>

          {/* ── Breadcrumb ── */}
          <div className="nb-crumb">
            <span>Home</span>
            <span className="nb-crumb-sep">/</span>
            <span className="nb-crumb-current">{pageName}</span>
          </div>

          <div className="nb-spacer" />

          {/* ── Right actions ── */}
          <div className="nb-actions">

            {/* Search */}
            <div className="nb-search" onClick={handleSearch} role="button" tabIndex={0}>
              <span className="nb-search-icon">🔍</span>
              Search
              <kbd className="nb-search-kbd">⌘K</kbd>
            </div>

            {/* Notifications */}
            <div
              className="nb-icon-btn"
              onClick={handleNotif}
              role="button"
              tabIndex={0}
              title="Notifications"
            >
              🔔
              {hasNotif && <div className="nb-notif-dot" />}
            </div>

            {/* Add Expense CTA */}
            <button

            className="nb-cta"

            onClick={()=>

            navigate(
            "/expense"
            )

            }

            >
              <span className="nb-cta-plus">+</span>
              Add Expense
            </button>

            {/* Avatar */}
            <div
              className="nb-avatar"
              onClick={handleAvatar}
              role="button"
              tabIndex={0}
              title={USER_NAME}
            >
              {USER_INITIALS}
            </div>

          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;