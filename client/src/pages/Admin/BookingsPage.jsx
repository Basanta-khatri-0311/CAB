import { useState, useEffect } from "react";
import API from "../../api/axios";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    const res = await API.get("/bookings");
    setBookings(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/bookings/${id}`, { status });
    fetchBookings();
  };

  if (loading) return <div className="loader-screen"><div className="loader-spinner"></div></div>;

  return (
    <div className="page-wrapper fade-up">
      <h1 className="page-title">Manage Turf Bookings</h1>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr><th>User</th><th>Date</th><th>Slot</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id} className="tx-row">
                <td>
                  {b.user ? (
                    <>
                      <span style={{ fontWeight: "600" }}>{b.user.name}</span>
                      <br /><small style={{ color: "#6b7280" }}>{b.user.email}</small>
                    </>
                  ) : (
                    <>
                      <span style={{ fontWeight: "600", color: "#d97706" }}>Visitor: {b.visitorName}</span>
                      <br /><small style={{ color: "#6b7280" }}>{b.visitorPhone}</small>
                    </>
                  )}
                </td>
                <td className="tx-date">{new Date(b.date).toLocaleDateString()}</td>
                <td className="tx-source">{b.slot}</td>
                <td>
                  <span className={`status-badge ${b.status === 'confirmed' ? 'status-completed' : 'status-planning'}`} style={{ display: "inline-flex" }}>
                    <span className="dot"></span> {b.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => updateStatus(b._id, 'confirmed')} style={{ color: "#34d399", background: "none", border: "none", cursor: "pointer", marginRight: "10px" }}>Confirm</button>
                  <button onClick={() => updateStatus(b._id, 'cancelled')} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
