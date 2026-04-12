import axios from "axios";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function Booking() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: "",
    slot: "06:00 AM - 08:00 AM",
    notes: "",
    visitorName: "",
    visitorPhone: ""
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
    if (!localStorage.getItem("token")) {
      setLoading(false);
      return;
    }
    try {
      const res = await API.get("/bookings/my");
      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/bookings", formData);
      setMessage({ type: "success", text: "Booking request submitted! Our manager will verify shortly." });
      setFormData({ ...formData, date: "", notes: "", visitorName: "", visitorPhone: "" });
      if (localStorage.getItem("token")) fetchMyBookings();
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Error submitting booking" });
    }
  };

  if (loading) {
    return (
      <div className="loader-screen">
        <div className="loader-spinner"></div>
        <div className="loader-text">Loading Arena...</div>
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

      <div style={{ display: "grid", gridTemplateColumns: user ? "1fr 1fr" : "1fr", gap: "40px" }}>
        {/* Booking Form */}
        <div className="login-card cricket-card" style={{ maxWidth: user ? "100%" : "500px", margin: user ? "0" : "0 auto" }}>
          <h2 className="section-title">Schedule Session</h2>
          {message && (
            <div className={message.type === "success" ? "status-badge status-completed" : "login-error"} style={{ marginBottom: "20px", display: "block" }}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {!user && (
              <>
                <div className="login-field">
                  <label className="login-label">Full Name</label>
                  <input type="text" className="login-input" required value={formData.visitorName} onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })} />
                </div>
                <div className="login-field">
                  <label className="login-label">Phone Number</label>
                  <input type="text" className="login-input" required value={formData.visitorPhone} onChange={(e) => setFormData({ ...formData, visitorPhone: e.target.value })} />
                </div>
              </>
            )}
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
              <label className="login-label">Special Requirements</label>
              <textarea 
                className="login-input" 
                rows="3"
                placeholder="Bowling Machine, Bats/Balls, Coach help..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              ></textarea>
            </div>
            <button type="submit" className="login-submit">Submit Booking Request</button>
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
