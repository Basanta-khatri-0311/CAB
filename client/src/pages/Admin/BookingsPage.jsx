import { useState, useEffect } from "react";
import axios from "axios";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    const res = await axios.get("http://localhost:5000/api/bookings", config);
    setBookings(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    await axios.put(`http://localhost:5000/api/bookings/${id}`, { status }, config);
    fetchBookings();
  };

  if (loading) return <div>Loading...</div>;

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
                <td>{b.user.name}<br/><small>{b.user.email}</small></td>
                <td>{new Date(b.date).toLocaleDateString()}</td>
                <td>{b.slot}</td>
                <td><span className={`status-badge ${b.status === 'confirmed' ? 'status-completed' : 'status-planning'}`}>{b.status}</span></td>
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
