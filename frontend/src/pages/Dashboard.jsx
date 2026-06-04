import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import ExpenseChart from "../components/ExpenseChart";
import AIInsights from "../components/AIInsights";
import ExportPDF from "../components/ExportPDF";

/* ─────────────────────────────────────────────
   INLINE STYLES  (no extra CSS file needed)
───────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --ink:        #0f0e13;
    --ink2:       #1c1a26;
    --ink3:       #2a2737;
    --surface:    rgba(255,255,255,0.04);
    --surface2:   rgba(255,255,255,0.08);
    --border:     rgba(255,255,255,0.10);
    --border2:    rgba(255,255,255,0.18);
    --text:       #f0edf9;
    --text2:      #9e98b8;
    --text3:      #6b6485;
    --accent:     #a78bfa;
    --accent2:    #7c3aed;
    --accent-glow:rgba(167,139,250,0.25);
    --green:      #34d399;
    --coral:      #f87171;
    --amber:      #fbbf24;
    --teal:       #22d3ee;
    --radius:     14px;
    --radius-sm:  9px;
    --sans:       'DM Sans', sans-serif;
    --mono:       'DM Mono', monospace;
  }
    

  .sl-shell { font-family: var(--sans); color: var(--text); }

  /* BG decorations */
  .sl-bg-grid {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(167,139,250,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(167,139,250,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .sl-bg-glow {
    position: fixed; width: 600px; height: 600px; border-radius: 50%;
    pointer-events: none; z-index: 0;
    background: radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 65%);
    top: -200px; right: -150px;
  }
  .sl-bg-glow2 {
    position: fixed; width: 400px; height: 400px; border-radius: 50%;
    pointer-events: none; z-index: 0;
    background: radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 65%);
    bottom: -100px; left: 80px;
  }

  /* Page wrapper */
  .sl-page {
    position: relative; z-index: 1;
    max-width: 1000px; margin: 0 auto;
    padding: 28px 24px 80px;
  }

  /* ── Header ── */
  .sl-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 28px;
    animation: sl-fade-up 0.5s ease 0.05s both;
  }
  .sl-header-left { display: flex; align-items: center; gap: 10px; }
  .sl-logo-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 10px var(--accent), 0 0 20px var(--accent-glow);
    animation: sl-pulse 2s ease-in-out infinite;
  }
  .sl-header h1 { font-size: 18px; font-weight: 600; letter-spacing: -0.3px; margin: 0; }
  .sl-header-badge {
    font-size: 11px; font-family: var(--mono);
    background: var(--surface2); border: 0.5px solid var(--border2);
    border-radius: 20px; padding: 3px 10px;
    color: var(--text2); letter-spacing: 0.5px;
  }
  .sl-export-btn {
    display: flex; align-items: center; gap: 7px;
    background: var(--accent2); border: none; cursor: pointer;
    border-radius: var(--radius-sm); padding: 9px 18px;
    color: #fff; font-family: var(--sans); font-size: 13px; font-weight: 500;
    transition: all 0.2s; box-shadow: 0 0 20px rgba(124,58,237,0.3);
    letter-spacing: 0.1px;
  }
  .sl-export-btn:hover { background: var(--accent); transform: translateY(-1px); box-shadow: 0 0 28px rgba(167,139,250,0.4); }
  .sl-export-btn:active { transform: scale(0.97); }
  .sl-export-btn svg { width: 15px; height: 15px; }

  /* ── Stat cards ── */
  .sl-cards {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 14px; margin-bottom: 28px;
  }
  @media (max-width: 600px) { .sl-cards { grid-template-columns: 1fr; } }
  .sl-card {
    background: var(--surface); border: 0.5px solid var(--border);
    border-radius: var(--radius); padding: 20px 22px;
    position: relative; overflow: hidden; cursor: default;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    animation: sl-fade-up 0.5s ease both;
  }
  .sl-card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%);
    pointer-events: none;
  }
  .sl-card:hover { border-color: var(--border2); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
  .sl-card-icon { font-size: 20px; margin-bottom: 10px; }
  .sl-card-value {
    font-size: 28px; font-weight: 600; letter-spacing: -1px;
    font-family: var(--mono); color: var(--text); margin-bottom: 4px; line-height: 1.1;
  }
  .sl-card-label { font-size: 12px; color: var(--text3); letter-spacing: 0.2px; }
  .sl-card-bar {
    position: absolute; bottom: 0; left: 0; height: 2px; width: 0%;
    transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .sl-card:nth-child(1) .sl-card-bar { background: linear-gradient(90deg, var(--coral), var(--amber)); }
  .sl-card:nth-child(2) .sl-card-bar { background: linear-gradient(90deg, var(--teal), var(--accent)); }
  .sl-card:nth-child(3) .sl-card-bar { background: linear-gradient(90deg, var(--green), var(--teal)); }

  /* ── Section title ── */
  .sl-section-title {
    font-size: 11px; font-weight: 500; letter-spacing: 1.2px;
    text-transform: uppercase; color: var(--text3); margin-bottom: 12px;
  }

  /* ── Table ── */
  .sl-table-wrap {
    border: 0.5px solid var(--border); border-radius: var(--radius);
    overflow: hidden; background: var(--surface); margin-bottom: 28px;
    animation: sl-fade-up 0.5s ease 0.35s both;
  }
  .sl-table { width: 100%; border-collapse: collapse; }
  .sl-table thead tr { background: rgba(255,255,255,0.04); }
  .sl-table th {
    padding: 12px 18px; text-align: left;
    font-size: 11px; font-weight: 500; letter-spacing: 0.8px;
    text-transform: uppercase; color: var(--text3);
    border-bottom: 0.5px solid var(--border);
  }
  .sl-table th:last-child { text-align: right; }
  .sl-table td { padding: 13px 18px; font-size: 13px; color: var(--text2); }
  .sl-table tbody tr {
    border-bottom: 0.5px solid rgba(255,255,255,0.05);
    transition: background 0.15s;
    animation: sl-row-in 0.35s ease both;
  }
  .sl-table tbody tr:last-child { border-bottom: none; }
  .sl-table tbody tr:hover { background: rgba(167,139,250,0.05); }
  .sl-table td:first-child { color: var(--text); font-weight: 500; }
  .sl-amount { font-family: var(--mono); color: var(--text); }

  /* Category pills */
  .sl-pill {
    display: inline-flex; align-items: center;
    font-size: 11px; padding: 3px 10px; border-radius: 20px;
    font-weight: 500; letter-spacing: 0.2px;
  }
  .sl-pill-food     { background: rgba(251,191,36,0.12);  color: var(--amber);  border: 0.5px solid rgba(251,191,36,0.25); }
  .sl-pill-travel   { background: rgba(34,211,238,0.10);  color: var(--teal);   border: 0.5px solid rgba(34,211,238,0.25); }
  .sl-pill-health   { background: rgba(52,211,153,0.10);  color: var(--green);  border: 0.5px solid rgba(52,211,153,0.25); }
  .sl-pill-shopping { background: rgba(248,113,113,0.10); color: var(--coral);  border: 0.5px solid rgba(248,113,113,0.25); }
  .sl-pill-other    { background: rgba(167,139,250,0.10); color: var(--accent); border: 0.5px solid rgba(167,139,250,0.25); }

  /* Action buttons */
  .sl-actions { display: flex; gap: 6px; justify-content: flex-end; }
  .sl-btn-edit, .sl-btn-del {
    font-size: 11px; padding: 5px 12px; border-radius: 6px;
    border: 0.5px solid; cursor: pointer; font-family: var(--sans);
    font-weight: 500; transition: all 0.15s; letter-spacing: 0.2px;
    background: transparent;
  }
  .sl-btn-edit { border-color: var(--border2); color: var(--text2); }
  .sl-btn-edit:hover { background: var(--surface2); color: var(--text); border-color: var(--accent); }
  .sl-btn-del { border-color: rgba(248,113,113,0.25); color: rgba(248,113,113,0.7); }
  .sl-btn-del:hover { background: rgba(248,113,113,0.1); color: var(--coral); border-color: var(--coral); }
  .sl-empty { text-align: center; color: var(--text3); padding: 32px !important; font-size: 13px; }

  /* ── Analytics grid ── */
  .sl-analytics {
    display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
    margin-bottom: 28px;
    animation: sl-fade-up 0.5s ease 0.5s both;
  }
  @media (max-width: 680px) { .sl-analytics { grid-template-columns: 1fr; } }
  .sl-chart-card {
    background: var(--surface); border: 0.5px solid var(--border);
    border-radius: var(--radius); padding: 18px 20px; overflow: hidden;
    transition: border-color 0.2s;
  }
  .sl-chart-card:hover { border-color: var(--border2); }
  .sl-chart-title { font-size: 11px; font-weight: 500; color: var(--text3); margin-bottom: 16px; letter-spacing: 0.5px; text-transform: uppercase; }

  /* Bar chart */
  .sl-bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 100px; }
  .sl-bar-col { display: flex; flex-direction: column; align-items: center; flex: 1; gap: 5px; height: 100%; justify-content: flex-end; }
  .sl-bar {
    width: 100%; border-radius: 4px 4px 0 0; min-height: 3px;
    transition: height 0.8s cubic-bezier(0.22, 1, 0.36, 1);
    position: relative; cursor: pointer; opacity: 0.78;
  }
  .sl-bar:hover { opacity: 1; }
  .sl-bar-label { font-size: 10px; color: var(--text3); font-family: var(--mono); }

  /* Donut */
  .sl-donut-wrap { position: relative; display: flex; align-items: center; gap: 16px; }
  .sl-donut-center {
    position: absolute; left: 60px; top: 50%; transform: translate(-50%, -50%);
    text-align: center; pointer-events: none;
  }
  .sl-donut-center-val { font-family: var(--mono); font-size: 13px; font-weight: 500; color: var(--text); }
  .sl-donut-center-lbl { font-size: 10px; color: var(--text3); }
  .sl-donut-legend { display: flex; flex-direction: column; gap: 7px; }
  .sl-legend-item { display: flex; align-items: center; gap: 7px; font-size: 11px; color: var(--text2); }
  .sl-legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  /* ── AI Insights ── */
  .sl-insights {
    background: var(--surface); border: 0.5px solid var(--border);
    border-radius: var(--radius); padding: 20px 22px;
    position: relative; overflow: hidden;
    animation: sl-fade-up 0.5s ease 0.6s both;
  }
  .sl-insights::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent-glow), transparent);
  }
  .sl-insights-header { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
  .sl-ai-badge {
    font-size: 10px; padding: 2px 7px; border-radius: 20px;
    background: rgba(167,139,250,0.12); border: 0.5px solid rgba(167,139,250,0.3);
    color: var(--accent); font-weight: 500; letter-spacing: 0.5px;
  }
  .sl-insight-row {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 10px 0; border-bottom: 0.5px solid rgba(255,255,255,0.05);
  }
  .sl-insight-row:last-child { border-bottom: none; padding-bottom: 0; }
  .sl-insight-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
  .sl-insight-text { font-size: 13px; color: var(--text2); line-height: 1.6; }
  .sl-insight-text strong { color: var(--text); font-weight: 500; }

  /* ── Edit Modal ── */
  .sl-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.65);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; pointer-events: none;
    transition: opacity 0.2s;
  }
  .sl-overlay.open { opacity: 1; pointer-events: all; }
  .sl-modal {
    background: #1e1c2a; border: 0.5px solid var(--border2);
    border-radius: var(--radius); padding: 26px;
    width: 340px; transform: scale(0.95);
    transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .sl-overlay.open .sl-modal { transform: scale(1); }
  .sl-modal h3 { font-size: 16px; font-weight: 600; margin: 0 0 18px; color: var(--text); }
  .sl-field { margin-bottom: 14px; }
  .sl-field label {
    display: block; font-size: 11px; color: var(--text3);
    margin-bottom: 5px; letter-spacing: 0.4px; text-transform: uppercase;
  }
  .sl-field input, .sl-field select {
    width: 100%; padding: 9px 12px;
    background: rgba(255,255,255,0.05); border: 0.5px solid var(--border2);
    border-radius: var(--radius-sm); color: var(--text); font-family: var(--sans);
    font-size: 13px; outline: none; transition: border-color 0.2s;
  }
  .sl-field input:focus, .sl-field select:focus { border-color: var(--accent); }
  .sl-field select option { background: #1e1c2a; }
  .sl-modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px; }
  .sl-btn-cancel {
    padding: 8px 16px; border-radius: var(--radius-sm);
    border: 0.5px solid var(--border2); background: transparent;
    color: var(--text2); cursor: pointer; font-family: var(--sans); font-size: 13px;
    transition: all 0.15s;
  }
  .sl-btn-cancel:hover { background: var(--surface2); color: var(--text); }
  .sl-btn-save {
    padding: 8px 20px; border-radius: var(--radius-sm); border: none;
    background: var(--accent2); color: #fff; cursor: pointer;
    font-family: var(--sans); font-size: 13px; font-weight: 500;
    transition: all 0.15s; box-shadow: 0 0 16px rgba(124,58,237,0.3);
  }
  .sl-btn-save:hover { background: var(--accent); }

  /* ── Toast ── */
  .sl-toast {
    position: fixed; bottom: 24px; right: 24px;
    background: #1e1c2a; border: 0.5px solid var(--border2);
    border-radius: var(--radius-sm); padding: 12px 18px;
    font-family: var(--sans); font-size: 13px; color: var(--text);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    transform: translateY(60px); opacity: 0;
    transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    z-index: 999; pointer-events: none; max-width: 260px;
  }
  .sl-toast.show { transform: translateY(0); opacity: 1; }

  /* ── Keyframes ── */
  @keyframes sl-fade-up {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes sl-row-in {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes sl-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.7; transform: scale(1.3); }
  }
`;

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const CAT_COLORS = {
  Food:     "#fbbf24",
  Travel:   "#22d3ee",
  Health:   "#34d399",
  Shopping: "#f87171",
  Other:    "#a78bfa",
};
const BAR_COLORS = ["#a78bfa","#22d3ee","#34d399","#fbbf24","#f87171","#a78bfa","#22d3ee"];
const PILL_CLASS = {
  Food:     "sl-pill sl-pill-food",
  Travel:   "sl-pill sl-pill-travel",
  Health:   "sl-pill sl-pill-health",
  Shopping: "sl-pill sl-pill-shopping",
  Other:    "sl-pill sl-pill-other",
};

const CATEGORIES = ["Food", "Travel", "Shopping", "Health", "Other"];

/* ─────────────────────────────────────────────
   HOOKS & HELPERS
───────────────────────────────────────────── */
function useCountUp(target, duration = 800) {
  const [value, setValue] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const start = performance.now();
    const from = prev.current;
    prev.current = target;
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(from + (target - from) * ease));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

function inr(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

function pillClass(cat) {
  return PILL_CLASS[cat] || "sl-pill sl-pill-other";
}

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

/** Animated stat card */
function StatCard({ icon, value, label, delay, prefix = "", style = {} }) {
  const animated = useCountUp(value);
  const barRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = "100%";
    }, 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="sl-card" style={{ animationDelay: delay, ...style }}>
      <div className="sl-card-icon">{icon}</div>
      <div className="sl-card-value">{prefix}{animated.toLocaleString("en-IN")}</div>
      <div className="sl-card-label">{label}</div>
      <div className="sl-card-bar" ref={barRef} />
    </div>
  );
}

/** Donut chart (pure SVG, no library) */
function DonutChart({ expenses }) {
  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const cats = {};
  expenses.forEach(e => { cats[e.category] = (cats[e.category] || 0) + Number(e.amount); });
  const entries = Object.entries(cats);

  const cx = 60, cy = 60, r = 46, ir = 30;
  let angle = -Math.PI / 2;

  const slices = entries.map(([cat, val]) => {
    const sweep = (val / total) * 2 * Math.PI;
    const a1 = angle, a2 = angle + sweep;
    angle += sweep;
    const lx1 = cx + r * Math.cos(a1), ly1 = cy + r * Math.sin(a1);
    const lx2 = cx + r * Math.cos(a2), ly2 = cy + r * Math.sin(a2);
    const sx1 = cx + ir * Math.cos(a1), sy1 = cy + ir * Math.sin(a1);
    const sx2 = cx + ir * Math.cos(a2), sy2 = cy + ir * Math.sin(a2);
    const large = sweep > Math.PI ? 1 : 0;
    const d = `M${lx1} ${ly1} A${r} ${r} 0 ${large} 1 ${lx2} ${ly2} L${sx2} ${sy2} A${ir} ${ir} 0 ${large} 0 ${sx1} ${sy1} Z`;
    return { cat, val, d, color: CAT_COLORS[cat] || "#a78bfa" };
  });

  return (
    <div className="sl-donut-wrap">
      <svg className="sl-donut-svg" width="120" height="120" viewBox="0 0 120 120">
        {slices.length === 0 ? (
          <circle cx={cx} cy={cy} r={r} fill="none"
            stroke="rgba(255,255,255,0.06)" strokeWidth={ir / 2} />
        ) : (
          slices.map(({ cat, d, color }) => (
            <path key={cat} d={d} fill={color} opacity="0.85"
              style={{ transition: "opacity 0.2s", cursor: "pointer" }}
              onMouseEnter={e => e.target.setAttribute("opacity","1")}
              onMouseLeave={e => e.target.setAttribute("opacity","0.85")} />
          ))
        )}
      </svg>
      <div className="sl-donut-center">
        <div className="sl-donut-center-val">{inr(total)}</div>
        <div className="sl-donut-center-lbl">total</div>
      </div>
      <div className="sl-donut-legend">
        {slices.map(({ cat, val, color }) => (
          <div key={cat} className="sl-legend-item">
            <div className="sl-legend-dot" style={{ background: color }} />
            <span>{cat} <span style={{ color: "var(--text3)", marginLeft: 3 }}>{inr(val)}</span></span>
          </div>
        ))}
        {slices.length === 0 && (
          <div className="sl-legend-item" style={{ color: "var(--text3)" }}>No data yet</div>
        )}
      </div>
    </div>
  );
}

/** Bar chart */
function BarChart({ expenses }) {
  const byDate = {};
  expenses.forEach(e => {
    const d = e.date || e.createdAt?.slice(0, 10) || "2025-05-24";
    byDate[d] = (byDate[d] || 0) + Number(e.amount);
  });
  const dates = Object.keys(byDate).sort().slice(-7);
  const maxVal = Math.max(...dates.map(d => byDate[d]), 1);
  const [heights, setHeights] = useState({});

  useEffect(() => {
    const timers = dates.map((d, i) =>
      setTimeout(() => {
        setHeights(prev => ({ ...prev, [d]: (byDate[d] / maxVal) * 88 }));
      }, 100 + i * 65)
    );
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses.length]);

  if (dates.length === 0) {
    return <div style={{ color: "var(--text3)", fontSize: 12, textAlign: "center", paddingTop: 36 }}>No data yet</div>;
  }

  return (
    <div className="sl-bar-chart">
      {dates.map((d, i) => (
        <div key={d} className="sl-bar-col">
          <div
            className="sl-bar"
            title={inr(byDate[d])}
            style={{ height: heights[d] || 0, background: BAR_COLORS[i % BAR_COLORS.length] }}
          />
          <div className="sl-bar-label">{d.slice(5)}</div>
        </div>
      ))}
    </div>
  );
}

/** AI Insights panel */
function InsightsPanel({ expenses }) {
  if (!expenses.length) {
    return (
      <div className="sl-insight-row">
        <div className="sl-insight-icon">⏳</div>
        <div className="sl-insight-text">Add some expenses to see AI-powered insights appear here.</div>
      </div>
    );
  }

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const avg = Math.round(total / expenses.length);
  const cats = {};
  expenses.forEach(e => { cats[e.category] = (cats[e.category] || 0) + Number(e.amount); });
  const [topCat, topAmt] = Object.entries(cats).sort((a, b) => b[1] - a[1])[0];
  const pct = Math.round((topAmt / total) * 100);

  const insights = [
    {
      icon: "🔥",
      text: <>Your biggest category is <strong>{topCat}</strong> at {inr(topAmt)} — that's <strong>{pct}%</strong> of total spending.</>
    },
    {
      icon: "📉",
      text: <>Average spend per entry is <strong>{inr(avg)}</strong>. Keeping this below ₹500 would support a healthy monthly budget.</>
    },
    {
      icon: "💡",
      text: expenses.length < 5
        ? <>You have only <strong>{expenses.length}</strong> entries so far. Log more to unlock trend analysis.</>
        : <>With <strong>{expenses.length}</strong> entries this period, your data is solid enough for weekly trend review.</>
    },
  ];

  return (
    <>
      {insights.map((ins, i) => (
        <div key={i} className="sl-insight-row">
          <div className="sl-insight-icon">{ins.icon}</div>
          <div className="sl-insight-text">{ins.text}</div>
        </div>
      ))}
    </>
  );
}

/** Edit modal */
function EditModal({ item, onClose, onSave }) {
  const [title, setTitle] = useState(item?.title || "");
  const [amount, setAmount] = useState(item?.amount || "");
  const [category, setCategory] = useState(item?.category || "Food");

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setAmount(item.amount);
      setCategory(item.category);
    }
  }, [item]);

  const open = !!item;

  return (
    <div className={`sl-overlay${open ? " open" : ""}`}
      onClick={e => { if (e.target.classList.contains("sl-overlay")) onClose(); }}>
      <div className="sl-modal">
        <h3>Edit Expense</h3>
        <div className="sl-field">
          <label>Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Coffee" />
        </div>
        <div className="sl-field">
          <label>Amount (₹)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" />
        </div>
        <div className="sl-field">
          <label>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="sl-modal-actions">
          <button className="sl-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="sl-btn-save"
            onClick={() => {
              if (!title.trim() || isNaN(Number(amount))) return;
              onSave({ title: title.trim(), amount: Number(amount), category });
            }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────────── */
function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [editing, setEditing] = useState(null);   // the item being edited
  const [toast, setToast] = useState({ msg: "", show: false });
  const toastTimer = useRef(null);

  useEffect(() => { load(); }, []);

  // ── API calls ──────────────────────────────
  const load = async () => {
    try {
      const res = await API.get("/api/expense/list");
      setExpenses(res.data);
    } catch (err) {
      console.error("Failed to load expenses:", err);
    }
  };

  const handleSaveEdit = async ({ title, amount, category }) => {
    try {
      await API.put(`/api/expense/update/${editing._id}`, { title, amount, category });
      setEditing(null);
      load();
      showToast("✓ Expense updated");
    } catch (err) {
      console.error(err);
      showToast("Failed to update expense");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/expense/delete/${id}`);
      load();
      showToast("Expense removed");
    } catch (err) {
      console.error(err);
    }
  };

  // ── Toast ──────────────────────────────────
  const showToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast({ msg, show: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2400);
  };

  // ── Derived stats ──────────────────────────
  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const avg   = expenses.length ? Math.round(total / expenses.length) : 0;

  // ── Render ─────────────────────────────────
  return (
    <Layout>
      {/* Inject CSS once */}
      <style>{CSS}</style>

      <div className="sl-shell">
        {/* Ambient decorations */}
        <div className="sl-bg-grid" />
        <div className="sl-bg-glow" />
        <div className="sl-bg-glow2" />

        <div className="sl-page">

          {/* ── Header ── */}
          <div className="sl-header">
            <div className="sl-header-left">
              <div className="sl-logo-dot" />
              <h1>SpendLens</h1>
              <span className="sl-header-badge">DASHBOARD</span>
            </div>
            <ExportPDF expenses={expenses}>
              {/* ExportPDF renders its own trigger; pass it a styled button */}
              <button className="sl-export-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export PDF
              </button>
            </ExportPDF>
          </div>

          {/* ── Stat cards ── */}
          <div className="sl-cards">
            <StatCard icon="💸" value={total}           label="Total Spent"    delay="0.10s" prefix="₹" />
            <StatCard icon="📋" value={expenses.length} label="Entries"        delay="0.18s" />
            <StatCard icon="📊" value={avg}             label="Avg per Entry"  delay="0.26s" prefix="₹" />
          </div>

          {/* ── Expense table ── */}
          <div className="sl-section-title"
            style={{ animation: "sl-fade-up 0.4s ease 0.32s both" }}>
            Expense Log
          </div>
          <div className="sl-table-wrap">
            <table className="sl-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="sl-empty">
                      No expenses yet — add your first one!
                    </td>
                  </tr>
                ) : (
                  expenses.map((item, i) => (
                    <tr key={item._id} style={{ animationDelay: `${0.05 + i * 0.06}s` }}>
                      <td>{item.title}</td>
                      <td><span className="sl-amount">{inr(item.amount)}</span></td>
                      <td><span className={pillClass(item.category)}>{item.category}</span></td>
                      <td>
                        <div className="sl-actions">
                          <button className="sl-btn-edit" onClick={() => setEditing(item)}>Edit</button>
                          <button className="sl-btn-del"  onClick={() => handleDelete(item._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Analytics ── */}
          <div className="sl-section-title"
            style={{ animation: "sl-fade-up 0.4s ease 0.48s both" }}>
            Analytics
          </div>
          <div className="sl-analytics">
            <div className="sl-chart-card">
              <div className="sl-chart-title">Spending by category</div>
              <DonutChart expenses={expenses} />
            </div>
            <div className="sl-chart-card">
              <div className="sl-chart-title">Daily breakdown</div>
              <BarChart expenses={expenses} />
            </div>
          </div>

          {/* ── Your existing chart + insights components ── */}
          <div className="sl-section-title"
            style={{ animation: "sl-fade-up 0.4s ease 0.55s both" }}>
            Detailed Chart
          </div>
          <div className="sl-chart-card" style={{ marginBottom: 28, animation: "sl-fade-up 0.5s ease 0.55s both" }}>
            <ExpenseChart expenses={expenses} />
          </div>

          {/* ── AI Insights ── */}
          <div className="sl-section-title"
            style={{ animation: "sl-fade-up 0.4s ease 0.62s both" }}>
            AI Insights
          </div>
          <div className="sl-insights">
            <div className="sl-insights-header">
              <span className="sl-chart-title" style={{ margin: 0 }}>Spending Intelligence</span>
              <span className="sl-ai-badge">AI</span>
            </div>
            {/* You can swap InsightsPanel for your existing <AIInsights> component */}
            <InsightsPanel expenses={expenses} />
          </div>

        </div>{/* sl-page */}
      </div>{/* sl-shell */}

      {/* ── Edit Modal ── */}
      <EditModal
        item={editing}
        onClose={() => setEditing(null)}
        onSave={handleSaveEdit}
      />

      {/* ── Toast ── */}
      <div className={`sl-toast${toast.show ? " show" : ""}`}>{toast.msg}</div>

    </Layout>
  );
}

export default Dashboard;