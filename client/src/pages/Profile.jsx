import { useState, useEffect } from "react";
import axios from "axios";
import API from "../api/axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", phone: "", bio: "", photo: "" });
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/users/profile");
        setUser(data.user);
        setDonations(data.donations);
        setFormData({
          name: data.user.name,
          phone: data.user.phone || "",
          bio: data.user.bio || "",
          photo: data.user.photo || ""
        });
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append("image", file);
    setUpdating(true);

    try {
      const { data } = await API.post("/upload", uploadData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFormData({ ...formData, photo: data }); // Backend now returns full URL via attachFullUrl in profile fetch, but for upload we might need to prepend if it's relative
    } catch (error) { console.error(error); }
    finally { setUpdating(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await API.put("/users/profile", formData);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) { console.error(err); }
    finally { setUpdating(false); }
  };

  if (loading) return <div className="loader-screen"><div className="loader-spinner"></div></div>;

  return (
    <div className="page-wrapper fade-up">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-10 items-start">
        
        {/* Left: Profile Photo & Stats */}
        <div>
          <div className="project-card text-center p-10">
            <div className="w-40 h-40 rounded-full bg-[#111] mx-auto mb-5 border-[3px] border-[#d97706] overflow-hidden relative">
              {formData.photo ? <img src={formData.photo} alt={user.name} className="w-full h-full object-cover" /> : <div className="text-[64px] leading-[160px] text-[#d97706]">{user.name.charAt(0)}</div>}
            </div>
            <h2 className="modal-title mb-[5px]">{user.name}</h2>
            <p className="status-badge status-completed inline-flex">{user.roleInClub}</p>
            
            <div className="mt-[30px] border-t border-[#1a1a1a] pt-[20px]">
              <p className="project-card__budget-label">Total Contributions</p>
              <h3 className="text-[#d97706] text-2xl">NPR {donations.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}</h3>
            </div>
          </div>
        </div>

        {/* Right: Edit Form & Transactions */}
        <div className="flex flex-col gap-[30px]">
          
          <div className="login-card max-w-full">
            <h2 className="section-title">Edit Profile</h2>
            {message && <p className="status-badge status-completed w-full mb-5 flex justify-center">{message}</p>}
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label className="form-label">Profile Photo</label>
                <input type="file" className="login-input" onChange={uploadFileHandler} />
              </div>
              <div className="form-field">
                <label className="form-label">Name</label>
                <input type="text" className="login-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-field">
                <label className="form-label">Phone</label>
                <input type="text" className="login-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="form-field">
                <label className="form-label">Bio</label>
                <textarea className="login-input" rows="3" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
              </div>
              <button type="submit" className="login-submit" disabled={updating}>
                {updating ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          <div className="table-wrapper">
             <div className="p-5 border-b border-[#1a1a1a]">
               <h3 className="section-title text-[16px] mb-0">Your Contributions</h3>
             </div>
             <table>
               <thead>
                 <tr><th>Date</th><th>Project/Source</th><th>Amount</th></tr>
               </thead>
               <tbody>
                  {donations.length === 0 ? (
                    <tr><td colSpan="3" className="text-center text-gray-600 p-5">No transactions found yet.</td></tr>
                  ) : (
                    donations.map(d => (
                      <tr key={d._id} className="tx-row">
                        <td className="tx-date">{new Date(d.date).toLocaleDateString()}</td>
                        <td className="tx-desc">{d.sourceOrVendor}</td>
                        <td className="tx-amount--income">NPR {d.amount.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
               </tbody>
             </table>
          </div>

        </div>

      </div>
    </div>
  );
}
