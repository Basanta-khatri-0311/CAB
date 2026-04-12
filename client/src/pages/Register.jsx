import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    roleInClub: "Player",
    bio: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      // Assuming back-end has a register endpoint in auth routes
      await axios.post("http://localhost:5000/api/auth/register", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen fade-up">
      <div className="login-card" style={{ maxWidth: "500px" }}>
        <div className="section-eyebrow" style={{ textAlign: "center" }}>Join the Association</div>
        <h1 className="login-title">Create Account</h1>
        <p className="login-subtitle">Become a member of the Cricket Association of Bhairahawa.</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="login-label">Full Name</label>
            <input
              type="text"
              className="login-input"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="login-field">
            <label className="login-label">Email Address</label>
            <input
              type="email"
              className="login-input"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div className="login-field">
              <label className="login-label">Password</label>
              <input
                type="password"
                className="login-input"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="login-field">
              <label className="login-label">Confirm Password</label>
              <input
                type="password"
                className="login-input"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div className="login-field">
              <label className="login-label">Phone Number</label>
              <input
                type="text"
                className="login-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="login-field">
              <label className="login-label">Role in Club</label>
              <select
                className="login-input"
                value={formData.roleInClub}
                onChange={(e) => setFormData({ ...formData, roleInClub: e.target.value })}
              >
                <option value="Player">Player</option>
                <option value="Coach">Coach</option>
                <option value="Staff">Staff</option>
                <option value="Supporter">Supporter</option>
              </select>
            </div>
          </div>

          <div className="login-field">
            <label className="login-label">Short Bio</label>
            <textarea
              className="login-input"
              rows="2"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us a bit about yourself..."
            ></textarea>
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? "Registering..." : "Register Now"}
          </button>
        </form>

        <p className="login-subtitle" style={{ marginTop: "20px" }}>
          Already have an account? <Link to="/login" style={{ color: "#d97706", fontWeight: "600" }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
