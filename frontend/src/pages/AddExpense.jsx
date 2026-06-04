import { useState } from "react";
import API from "../services/api";

const CATEGORIES = [
  { val: "food",          label: "Food",       icon: "🍜" },
  { val: "transport",     label: "Transport",  icon: "🚗" },
  { val: "utilities",     label: "Utilities",  icon: "⚡" },
  { val: "shopping",      label: "Shopping",   icon: "🛍️" },
  { val: "health",        label: "Health",     icon: "❤️" },
  { val: "entertainment", label: "Fun",        icon: "📺" },
  { val: "other",         label: "Other",      icon: "•••" },
];

const styles = {
  page: {
    minHeight: "520px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
    background: "#EEEDFE",
    borderRadius: "16px",
  },
  card: {
    width: "100%",
    maxWidth: "440px",
    background: "#fff",
    borderRadius: "20px",
    border: "1.5px solid #AFA9EC",
    overflow: "hidden",
  },
  top: {
    background: "#534AB7",
    padding: "1.75rem 1.75rem 1.5rem",
    position: "relative",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "#3C3489",
    color: "#CECBF6",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: ".05em",
    textTransform: "uppercase",
    padding: "4px 12px",
    borderRadius: "20px",
    marginBottom: "12px",
  },
  h1: {
    fontSize: "22px",
    fontWeight: 500,
    color: "#fff",
    lineHeight: 1.2,
    margin: 0,
  },
  sub: {
    fontSize: "13px",
    color: "#AFA9EC",
    marginTop: "4px",
    marginBottom: 0,
  },
  body: { padding: "1.5rem 1.75rem 1.75rem" },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    fontWeight: 500,
    color: "#534AB7",
    letterSpacing: ".05em",
    textTransform: "uppercase",
    marginBottom: "6px",
  },
  inputWrap: { position: "relative" },
  input: {
    width: "100%",
    padding: "11px 14px 11px 40px",
    fontSize: "14px",
    borderRadius: "10px",
    border: "1.5px solid #CECBF6",
    background: "#EEEDFE",
    color: "#26215C",
    outline: "none",
    boxSizing: "border-box",
  },
  inputFocus: {
    borderColor: "#534AB7",
    background: "#fff",
    boxShadow: "0 0 0 3px rgba(83,74,183,.18)",
  },
  inputIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "16px",
    color: "#7F77DD",
    pointerEvents: "none",
  },
  cats: { display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "6px" },
  cat: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "6px 12px",
    borderRadius: "20px",
    border: `1.5px solid ${active ? "#534AB7" : "#CECBF6"}`,
    background: active ? "#534AB7" : "#EEEDFE",
    color: active ? "#fff" : "#534AB7",
    fontSize: "12px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all .15s",
    transform: active ? "scale(1.04)" : "scale(1)",
    userSelect: "none",
  }),
  divider: {
    height: "1.5px",
    background: "linear-gradient(90deg,#CECBF6,#B5D4F4,#CECBF6)",
    margin: "1.25rem 0",
    borderRadius: "2px",
  },
  btn: (loading) => ({
    width: "100%",
    padding: "13px",
    borderRadius: "12px",
    border: "none",
    background: "#534AB7",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 500,
    cursor: loading ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    opacity: loading ? 0.65 : 1,
    transition: "background .2s, transform .12s",
  }),
  msg: (type) => ({
    marginTop: "12px",
    padding: "10px 14px",
    borderRadius: "10px",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    ...(type === "success"
      ? { background: "#E6F1FB", color: "#0C447C", border: "1.5px solid #85B7EB" }
      : { background: "#FCEBEB", color: "#A32D2D", border: "1.5px solid #F09595" }),
  }),
  strip: {
    display: "flex",
    borderTop: "1.5px solid #EEEDFE",
  },
  stripItem: {
    flex: 1,
    textAlign: "center",
    padding: "10px 4px",
    fontSize: "11px",
    color: "#7F77DD",
    fontWeight: 500,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "3px",
  },
};

function AddExpense() {
  const [form, setForm]     = useState({ title: "", amount: "" });
  const [category, setCat]  = useState("food");
  const [msg, setMsg]       = useState(null);   // { type, text }
  const [loading, setLoad]  = useState(false);
  const [focused, setFocus] = useState(null);

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    if (!form.title.trim() || !form.amount) {
      setMsg({ type: "error", text: "Please fill in title and amount." });
      return;
    }
    setLoad(true);
    setMsg(null);
    try {
      const res = await API.post("/api/expense/add", {
        ...form,
        category,
      });
      setMsg({ type: "success", text: res.data.message || "Expense saved!" });
      setForm({ title: "", amount: "" });
    } catch {
      setMsg({ type: "error", text: "Network error — please try again." });
    }
    setLoad(false);
  };

  const inputStyle = (field) => ({
    ...styles.input,
    ...(focused === field ? styles.inputFocus : {}),
  });

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.top}>
          <div style={styles.badge}>💼 Expense tracker</div>
          <p style={styles.h1}>Add new expense</p>
          <p style={styles.sub}>Track your spending in seconds</p>
        </div>

        {/* Body */}
        <div style={styles.body}>

          {/* Title */}
          <div style={{ marginBottom: "1.1rem" }}>
            <label style={styles.label}>✏️ Title</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}>📝</span>
              <input
                name="title"
                value={form.title}
                style={inputStyle("title")}
                placeholder="e.g. Coffee, Office supplies"
                onChange={change}
                onFocus={() => setFocus("title")}
                onBlur={() => setFocus(null)}
              />
            </div>
          </div>

          {/* Amount */}
          <div style={{ marginBottom: "1.1rem" }}>
            <label style={styles.label}>💵 Amount</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}>$</span>
              <input
                name="amount"
                type="number"
                value={form.amount}
                style={inputStyle("amount")}
                placeholder="0.00"
                step="0.01"
                min="0"
                onChange={change}
                onFocus={() => setFocus("amount")}
                onBlur={() => setFocus(null)}
              />
            </div>
          </div>

          {/* Category pills */}
          <div style={{ marginBottom: "1.1rem" }}>
            <label style={styles.label}>🏷️ Category</label>
            <div style={styles.cats}>
              {CATEGORIES.map((c) => (
                <div
                  key={c.val}
                  style={styles.cat(category === c.val)}
                  onClick={() => setCat(c.val)}
                >
                  {c.icon} {c.label}
                </div>
              ))}
            </div>
          </div>

          <div style={styles.divider} />

          <button
            style={styles.btn(loading)}
            onClick={save}
            disabled={loading}
          >
            {loading ? "⏳ Saving…" : "💾 Save expense"}
          </button>

          {msg && (
            <div style={styles.msg(msg.type)}>
              {msg.type === "success" ? "✅" : "❌"} {msg.text}
            </div>
          )}
        </div>

        {/* Footer strip */}
        <div style={styles.strip}>
          {[["🔒","Secure"],["⚡","Instant"],["📊","Analytics"]].map(([icon,label]) => (
            <div key={label} style={styles.stripItem}>
              <span style={{ fontSize: "18px" }}>{icon}</span>
              {label}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default AddExpense;