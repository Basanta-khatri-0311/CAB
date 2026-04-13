import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

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
      await API.post("/auth/register", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen fade-up flex-grow">
      <div className="login-card max-w-[500px]">
        <div className="section-eyebrow text-center">Join the Association</div>
        <h1 className="login-title">Create Account</h1>
        <p className="login-subtitle">Become a member of the Cricket Association of Bhaluhi.</p>

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

          <div className="grid grid-cols-2 gap-[15px]">
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

          <div className="grid grid-cols-2 gap-[15px]">
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

        <p className="login-subtitle mt-5">
          Already have an account? <Link to="/login" className="text-[#d97706] font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}
