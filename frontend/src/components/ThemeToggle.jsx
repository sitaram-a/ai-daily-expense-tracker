import { useState, useEffect } from "react";

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 6px 8px 8px",
        borderRadius: "999px",
        border: dark ? "1.5px solid #534AB7" : "1.5px solid #CECBF6",
        background: dark ? "#26215C" : "#EEEDFE",
        cursor: "pointer",
        transition: "background 0.35s, border-color 0.35s",
      }}
    >
      {/* Label */}
      <span
        style={{
          fontSize: "13px",
          fontWeight: 500,
          color: dark ? "#AFA9EC" : "#534AB7",
          paddingLeft: "4px",
          minWidth: "38px",
          transition: "color 0.3s",
        }}
      >
        {dark ? "Dark" : "Light"}
      </span>

      {/* Track */}
      <span
        style={{
          position: "relative",
          width: "52px",
          height: "28px",
          borderRadius: "14px",
          background: dark ? "#534AB7" : "#fff",
          border: dark ? "1.5px solid #7F77DD" : "1.5px solid #AFA9EC",
          display: "inline-block",
          flexShrink: 0,
          transition: "background 0.35s, border-color 0.35s",
        }}
      >
        {/* Knob */}
        <span
          style={{
            position: "absolute",
            top: "3px",
            left: "3px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: dark ? "#fff" : "#534AB7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            transform: dark ? "translateX(24px)" : "translateX(0)",
            transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.3s",
          }}
        >
          {dark ? "🌙" : "☀️"}
        </span>
      </span>
    </button>
  );
}

export default ThemeToggle;