import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
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
    <div className="auth-container">
      <h2>Login to SnippetVault</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
