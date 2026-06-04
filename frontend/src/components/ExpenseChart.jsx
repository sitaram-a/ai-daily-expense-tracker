import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// ── Color map — values are NOW objects with solid + light ───────────
const CATEGORY_COLORS = {
  food:          { solid: "#a78bfa", light: "#a78bfa33" },
  travel:        { solid: "#22d3ee", light: "#22d3ee33" },
  health:        { solid: "#34d399", light: "#34d39933" },
  shopping:      { solid: "#f87171", light: "#f8717133" },
  other:         { solid: "#6b6485", light: "#6b648533" },
  // add any extra categories your backend sends:
  "jio recharge":{ solid: "#22d3ee", light: "#22d3ee33" },
  "t-shirt":     { solid: "#34d399", light: "#34d39933" },
  lunch:         { solid: "#f87171", light: "#f8717133" },
  utilities:     { solid: "#fbbf24", light: "#fbbf2433" },
  transport:     { solid: "#a78bfa", light: "#a78bfa33" },
};

// ── Normalize key: lowercase + trim so "Food" matches "food" ────────
const getColor = (cat) =>
  CATEGORY_COLORS[cat?.toLowerCase().trim()] ?? CATEGORY_COLORS.other;

// ── Stat card ────────────────────────────────────────────────────────
function StatCard({ label, value }) {
  return (
    <div style={{
      flex: 1,
      padding: "1rem 1.25rem",
      borderRight: "1px solid rgba(255,255,255,0.07)",
    }}>
      <p style={{
        fontSize: 10, color: "#6b6485", fontWeight: 500,
        letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 4,
      }}>
        {label}
      </p>
      <p style={{ fontSize: 20, fontWeight: 500, color: "#f0edf9" }}>{value}</p>
    </div>
  );
}

// ── Legend item ───────────────────────────────────────────────────────
function LegendItem({ label, color }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 6,
                   fontSize: 11, color: "#9e98b8", fontWeight: 500 }}>
      <span style={{ width: 9, height: 9, borderRadius: 2,
                     background: color, flexShrink: 0 }} />
      {label}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────
function ExpenseChart({ expenses = [] }) {
  const grouped = useMemo(() => {
    const g = {};
    expenses.forEach((item) => {
      const key = item.category || "other";
      g[key] = (g[key] || 0) + Number(item.amount);
    });
    return g;
  }, [expenses]);

  const labels = Object.keys(grouped);
  const values = Object.values(grouped);
  // ✅ colorObjs is now an array of { solid, light } objects
  const colorObjs = labels.map((l) => getColor(l));

  const total  = values.reduce((a, b) => a + b, 0);
  const maxIdx = values.indexOf(Math.max(...values, 0));
  const maxCat = labels[maxIdx] ?? "—";

  const chartData = {
    labels,
    datasets: [{
      label: "Expense (₹)",
      data: values,
      // ✅ Now correctly reads .light and .solid from each object
      backgroundColor:      colorObjs.map((c) => c.light),
      borderColor:          colorObjs.map((c) => c.solid),
      hoverBackgroundColor: colorObjs.map((c) => c.solid),
      hoverBorderColor:     colorObjs.map((c) => c.solid),
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 900,
      easing: "easeOutBounce",
      delay: (ctx) => ctx.dataIndex * 80,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e1c2a",
        titleColor: "#9e98b8",
        bodyColor: "#f0edf9",
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => " ₹" + ctx.parsed.y.toLocaleString("en-IN"),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: "#6b6485",
          font: { size: 11, weight: "500" },
          autoSkip: false,
        },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.05)", lineWidth: 1 },
        border: { display: false },
        ticks: {
          color: "#6b6485",
          font: { size: 10 },
          callback: (v) =>
            "₹" + (v >= 1000 ? (v / 1000).toFixed(1) + "k" : v),
        },
      },
    },
  };

  return (
    <>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{
        background: "#14122a",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 14,
        overflow: "hidden",
        animation: "fadeUp .45s cubic-bezier(.22,1,.36,1) both",
      }}>

        {/* Header */}
        <div style={{
          background: "#5046b5",
          padding: "1.25rem 1.5rem 1rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 500, color: "#fff", margin: 0 }}>
              Expense breakdown
            </p>
            <p style={{ fontSize: 11, color: "#b0a8e8", marginTop: 2 }}>
              Grouped by category
            </p>
          </div>
          <span style={{
            background: "#3a308a", color: "#b0a8e8",
            fontSize: 10, fontWeight: 500,
            padding: "3px 10px", borderRadius: 20, letterSpacing: ".04em",
          }}>
            This month
          </span>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <StatCard label="Total"      value={"₹" + total.toLocaleString("en-IN")} />
          <StatCard label="Highest"    value={maxCat} />
          <StatCard label="Categories" value={labels.length} />
        </div>

        {/* Chart body */}
        <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "1rem" }}>
            {labels.map((l) => (
              <LegendItem key={l} label={l} color={getColor(l).solid} />
            ))}
          </div>
          <div style={{ position: "relative", width: "100%", height: 260 }}>
            <Bar
              data={chartData}
              options={options}
              aria-label="Bar chart showing expense amounts grouped by category"
            />
          </div>
        </div>

      </div>
    </>
  );
}

export default ExpenseChart;