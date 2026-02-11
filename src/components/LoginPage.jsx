import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./LoginPage.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      const token = data.access_token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      let role = decoded.role;
      if (role === "string") role = "Admin";

      if (role === "Admin") navigate("/admin");
      else if (role === "Trainer") navigate("/trainer");
      else navigate("/unauthorized");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="gym-login-container">
      <div className="gym-left">
        <h1 className="gym-logo">MyGym</h1>
        <p className="gym-tagline">
          Push harder than yesterday if you want a different tomorrow.
        </p>
      </div>

      <div className="gym-right">
        <form className="gym-login-form" onSubmit={handleSubmit}>
          <h2 className="form-title">Member Login</h2>

          <input
            type="text"
            placeholder="Email or Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="gym-login-btn">
            Log In
          </button>

          <a href="#" className="gym-forgot">Forgot Password?</a>
        </form>
      </div>
    </div>
  );
}
