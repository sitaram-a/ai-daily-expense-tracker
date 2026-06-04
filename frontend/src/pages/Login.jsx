import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setMsg({ text: "Please fill in all fields.", type: "error" });
      return;
    }
    setLoading(true);
    setMsg({ text: "", type: "" });
    try {
         //   const res = await fetch("/api/auth/login", {
     const res = await fetch(
"http://localhost:5000/api/auth/login",
{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed.");
      localStorage.setItem("token", data.token);
      setMsg({ text: "Welcome back!", type: "success" });
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      setMsg({ text: err.message || "Login failed. Try again.", type: "error" });
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
            <button className="auth-tab active">Login</button>
            <button className="auth-tab" onClick={() => navigate("/register")}>Register</button>
          </div>

          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your SpendLens account</p>

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
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
          </div>

          <button className="btn-primary" onClick={handleLogin} disabled={loading}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>

          {msg.text && <p className={`auth-msg ${msg.type}`}>{msg.text}</p>}

          <p className="auth-footer">
            Don't have an account?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/register"); }}>
              Create one
            </a>
          </p>

        </div>
      </div>
    </>
  );
}

export default Login;