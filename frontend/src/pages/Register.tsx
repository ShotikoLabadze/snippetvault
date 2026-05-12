import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import closedEye from "../assets/closedEye.png";
import openEye from "../assets/eye.png";
import "./Login.css";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", formData);
      alert("Registration successful! Now please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Error registering user. Please try again.");
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
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">
            Join the vault and secure your snippets.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label className="auth-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="auth-input"
              type="text"
              placeholder="dev_explorer"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              className="auth-input"
              type="email"
              placeholder="you@example.com"
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

          <button
            type="submit"
            className="auth-submit-btn"
            style={{ marginTop: "10px" }}
          >
            Register Now
          </button>

          <footer className="auth-footer">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Log In
            </Link>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default Register;
