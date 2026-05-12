import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import closedEye from "../assets/closedEye.png";
import openEye from "../assets/eye.png";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", formData);
      localStorage.setItem("token", response.data.access_token);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Invalid credentials. Check your email/password.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <header className="auth-header">
          <div className="auth-brand">
            <span className="auth-logo">{"{ }"}</span>
            <h1 className="auth-brand-name">
              Snippet<span>Vault</span>
            </h1>
          </div>
          <div className="auth-divider" />
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Login to unlock your snippets.</p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label className="auth-label" htmlFor="email">
              Email or Username
            </label>
            <input
              id="email"
              className="auth-input"
              type="email"
              placeholder="user@snippetvault.com"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label" htmlFor="password">
              Password
            </label>
            <div className="auth-password-wrapper">
              <input
                id="password"
                className="auth-input"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="auth-toggle-password"
                onClick={() => setShowPassword((s) => !s)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <img src={closedEye} alt="Hide password" />
                ) : (
                  <img src={openEye} alt="Show password" />
                )}
              </button>
            </div>
          </div>

          <div className="auth-actions-row">
            <label className="auth-remember-me">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Remember Me</span>
            </label>
            <a
              href="/forgot-password"
              title="Forgot Password"
              className="auth-link"
            >
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="auth-submit-btn">
            Unlock Vault
          </button>

          <footer className="auth-footer">
            Don't have an account?{" "}
            <a href="/signup" title="Sign Up" className="auth-link">
              Sign Up
            </a>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default Login;
