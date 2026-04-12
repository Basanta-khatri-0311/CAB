import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await API.post("/auth/login", { email, password });
      login(data);
      localStorage.setItem("token", data.token);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen" style={{ flexGrow: 1 }}>
      <form className="login-card" onSubmit={submitHandler}>
        {/* <p className="section-eyebrow" style={{ textAlign: "center" }}>◆ Admin Access</p> */}
        <h2 className="login-title">Sign In</h2>
        <p className="login-subtitle">Restricted to authorised members only.</p>

        {error && <p className="login-error">{error}</p>}

        <div className="login-field">
          <label className="login-label">Email</label>
          <input
            type="email"
            className="login-input"
            placeholder="admin@cob.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="login-field">
          <label className="login-label">Password</label>
          <input
            type="password"
            className="login-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}