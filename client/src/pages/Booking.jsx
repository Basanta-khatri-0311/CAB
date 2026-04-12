import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Booking() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: "",
    slot: "06:00 AM - 08:00 AM",
    notes: ""
  });
  const [message, setMessage] = useState(null);

  const slots = [
    "06:00 AM - 08:00 AM",
    "08:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM"
  ];

  const fetchMyBookings = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      };
      const res = await axios.get("http://localhost:5000/api/bookings/my", config);
      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      };
      await axios.post("http://localhost:5000/api/bookings", formData, config);
      setMessage({ type: "success", text: "Booking request submitted!" });
      setFormData({ ...formData, date: "", notes: "" });
      fetchMyBookings();
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Error submitting booking" });
    }
  };

  if (loading) {
    return (
      <div className="loader-screen">
        <div className="loader-spinner"></div>
        <div className="loader-text">Loading Bookings...</div>
      </div>
    );
  }

  return (
    <div className="page-wrapper fade-up">
      <header className="page-header" style={{ marginBottom: "60px", borderRadius: "20px" }}>
        <div className="section-eyebrow">High Performance Center</div>
        <h1 className="page-title">Net Practice</h1>
        <p className="page-subtitle">Reserve your session at the CAB Professional Turf.</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        {/* Booking Form */}
        <div className="login-card cricket-card" style={{ maxWidth: "100%" }}>
          <h2 className="section-title">Schedule Session</h2>
          {message && (
            <div className={message.type === "success" ? "status-badge status-completed" : "login-error"} style={{ marginBottom: "20px", display: "block" }}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="login-label">Practice Date</label>
              <input 
                type="date" 
                className="login-input" 
                required 
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="login-field">
              <label className="login-label">Preferred Net Slot</label>
              <select 
                className="login-input" 
                value={formData.slot}
                onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
              >
                {slots.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="login-field">
              <label className="login-label">Special Requirements (e.g. Bowling Machine)</label>
              <textarea 
                className="login-input" 
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              ></textarea>
            </div>
            <button type="submit" className="login-submit">Book Net Session</button>
          </form>
        </div>

        {/* My Bookings */}
        <div>
          <h2 className="section-title">My Schedule</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Slot</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="tx-row">
                    <td className="tx-date">{new Date(b.date).toLocaleDateString()}</td>
                    <td className="tx-source">{b.slot}</td>
                    <td>
                      <span className={`status-badge ${
                        b.status === 'confirmed' ? 'status-completed' : 
                        b.status === 'pending' ? 'status-planning' : 'login-error'
                      }`} style={{ display: "inline-flex" }}>
                        <span className="dot"></span> {b.status === 'confirmed' ? 'On Field' : b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && <div className="empty-state" style={{ padding: "20px" }}>No sessions scheduled</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
