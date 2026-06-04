import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      setMsg({ text: "Please fill in all fields.", type: "error" });
      return;
    }
    setLoading(true);
    setMsg({ text: "", type: "" });
    try {
    //   const res = await fetch("/api/auth/register", {
            const res = await fetch(
"http://localhost:5000/api/auth/register",
{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed.");
      setMsg({ text: data.message || "Account created! Redirecting to login…", type: "success" });
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setMsg({ text: err.message || "Registration failed. Try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-bg" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="auth-container">
        <div className="auth-card">

          <div className="auth-brand">
            <span className="brand-dot" />
            <span className="brand-name">SpendLens</span>
            <span className="brand-badge">Pro</span>
          </div>

          <div className="auth-tabs">
            <button className="auth-tab" onClick={() => navigate("/")}>Login</button>
            <button className="auth-tab active">Register</button>
          </div>

          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Start tracking your expenses today</p>

          <div className="field">
            <label className="field-label">Full Name</label>
            <div className="field-wrap">
              <span className="field-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </span>
              <input
                className="auth-input"
                type="text"
                placeholder="Arjun Kumar"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              />
            </div>
          </div>

          <div className="field">
            <label className="field-label">Email</label>
            <div className="field-wrap">
              <span className="field-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="4" width="20" height="16" rx="3" />
                  <path d="M2 7l10 7 10-7" />
                </svg>
              </span>
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              />
            </div>
          </div>

          <div className="field">
            <label className="field-label">Password</label>
            <div className="field-wrap">
              <span className="field-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </span>
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              />
            </div>
          </div>

          <button className="btn-primary" onClick={handleRegister} disabled={loading}>
            {loading ? "Creating account…" : "Create Account →"}
          </button>

          {msg.text && <p className={`auth-msg ${msg.type}`}>{msg.text}</p>}

          <p className="auth-footer">
            Already have an account?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
              Sign in
            </a>
          </p>

        </div>
      </div>
    </>
  );
}

export default Register;