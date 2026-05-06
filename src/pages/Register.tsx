import { useState } from "react";
import api from "../api/client";
import "./login.css";

export default function Register({ onLogin, onSwitch }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!name || !email || !password) {
      return "All fields are required";
    }

    if (!email.includes("@")) {
      return "Invalid email";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }

    return "";
  };

  const handleRegister = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      // auto login after register
      localStorage.setItem("token", res.data.token);
      onLogin();

    } catch (err: any) {
      setError(err?.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        {/* Header */}
        <div className="login-header">
          <div className="login-header-blob">
            <div className="login-avatar">
              <div className="login-avatar-inner">✨</div>
            </div>
          </div>
          <div className="login-header-text">
            <h4>Create Account</h4>
            <p>Start your journey today</p>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Name */}
        <div className="login-field">
          <label>Name</label>
          <div className="login-input-wrap">
            <span className="field-icon">👤</span>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {/* Email */}
        <div className="login-field">
          <label>Email</label>
          <div className="login-input-wrap">
            <span className="field-icon">✉️</span>
            <input
              type="email"
              placeholder="Enter your email"
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="toggle-pw"
              onClick={() => setShowPw(!showPw)}
              tabIndex={-1}
            >
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Button */}
        <button className="login-btn" onClick={handleRegister}>
          Register
        </button>

        {/* Switch */}
        <p className="login-register">
          Already have an account?{" "}
          <a href="#" onClick={onSwitch}>
            Login
          </a>
        </p>

      </div>
    </div>
  );
}