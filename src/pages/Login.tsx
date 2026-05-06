import { useState } from "react";
import api from "../api/client";
import "./login.css";

export default function Login({ onLogin, onSwitch }: any){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

const handleLogin = async () => {
  try {
    const res = await api.post("/auth/login", { email, password });

    if (res.data.error) {
      setError(res.data.error);
      return;
    }

    localStorage.setItem("token", res.data.token);
    onLogin();

  } catch {
    setError("Login failed");
  }
};

  return (
    <div className="login-container">
      <div className="login-card">

        {/* Gradient header with avatar */}
        <div className="login-header">
          <div className="login-header-blob">
            <div className="login-avatar">
              <div className="login-avatar-inner">❤️</div>
            </div>
          </div>
          <div className="login-header-text">
            <h4>Welcome Back!</h4>
            <p>Stay consistent with your prayers</p>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Email */}
        <div className="login-field">
          <label>Email Or User Name</label>
          <div className="login-input-wrap">
            <span className="field-icon">✉️</span>
            <input
              type="email"
              placeholder="Enter your Email here"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div className="login-field">
          <label>Password</label>
          <div className="login-input-wrap">
            <span className="field-icon">🔒</span>
            <input
              type={showPw ? "text" : "password"}
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="toggle-pw"
              onClick={() => setShowPw(!showPw)}
              tabIndex={-1}
              aria-label="Toggle password visibility"
            >
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Remember me + Forgot */}
        <div className="login-row">
          <label className="login-remember">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember me
          </label>
          {/* <a href="#" className="login-forgot">Forgot Password?</a> */}
        </div>

        <button className="login-btn" onClick={handleLogin}>
          Sign In
        </button>

        <p className="login-register">
          Don't have an account?{" "}
          <a href="#" onClick={onSwitch}>
            Register Here
          </a>
        </p>



      </div>
    </div>
  );
}
