import { useState, useEffect } from "react";
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
      setFormData({ ...formData, photo: data });
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-gray-200 pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 items-start">
          
          {/* Left: Profile Card */}
          <div className="bg-zinc-900 border border-white/5 rounded-[3rem] p-12 text-center sticky top-24 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-brand/5 blur-3xl rounded-full" />
            
            <div className="relative mb-8 group">
              <div className="w-48 h-48 rounded-full bg-black mx-auto border-4 border-brand/20 group-hover:border-brand transition-all duration-500 overflow-hidden">
                {formData.photo ? (
                  <img src={formData.photo} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-brand text-7xl font-black">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 translate-x-1/2 right-1/2 bg-brand text-black px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg flex flex-wrap gap-1 justify-center max-w-[150px]">
                 {(Array.isArray(user.roleInClub) ? user.roleInClub : [user.roleInClub]).join(" • ")}
              </div>
            </div>

            <h2 className="text-3xl font-black text-white tracking-tighter mb-2">{user.name}</h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-10">Verified Member</p>
            
            <div className="pt-10 border-t border-white/5">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Lifetime Giving</p>
              <h3 className="text-4xl font-black text-brand tracking-tighter">
                NPR {donations.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
              </h3>
            </div>
          </div>

          {/* Right: Form and Activity */}
          <div className="space-y-12">
            
            {/* Edit Form */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-[3rem] p-12 backdrop-blur-sm shadow-xl">
              <h2 className="text-2xl font-black text-white tracking-tighter mb-8 decoration-brand/30 underline underline-offset-8">Personal Records</h2>
              
              {message && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-center mb-8">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Profile Photo</label>
                    <input type="file" onChange={uploadFileHandler} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-xs font-mono text-gray-400 focus:outline-none focus:border-brand/50 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Full Name</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-brand/50 transition-colors" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Phone Contact</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-brand/50 transition-colors" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Bio / Club History</label>
                  <textarea rows="4" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium text-gray-300 focus:outline-none focus:border-brand/50 transition-colors" />
                </div>

                <button 
                  type="submit" 
                  disabled={updating}
                  className="w-full bg-brand hover:bg-brand-dark text-black font-black uppercase tracking-widest py-5 rounded-2xl transition-all shadow-xl shadow-brand/20 disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Update Official Records"}
                </button>
              </form>
            </div>

            {/* Contributions Activity */}
            <div className="bg-zinc-900/20 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
               <div className="px-12 py-8 bg-white/5 border-b border-white/5">
                 <h3 className="text-xl font-black text-white tracking-tighter">Contribution Activity</h3>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5 bg-black/20">
                        <th className="px-12 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date</th>
                        <th className="px-12 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Target Project / Milestone</th>
                        <th className="px-12 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                       {donations.length === 0 ? (
                         <tr><td colSpan="3" className="px-12 py-10 text-center text-xs text-gray-600 font-bold uppercase tracking-widest">No financial contributions logged.</td></tr>
                       ) : (
                         donations.map(d => (
                           <tr key={d._id} className="hover:bg-white/[0.01] transition-colors group">
                             <td className="px-12 py-6 text-[11px] text-gray-500 font-bold uppercase">
                               {new Date(d.date).toLocaleDateString()}
                             </td>
                             <td className="px-12 py-6">
                               {d.projectId ? (
                                  <div className="flex items-center gap-2">
                                     <span className="w-1.5 h-1.5 rounded-full bg-brand/40" />
                                     <p className="text-sm font-bold text-white tracking-tight">{d.projectId.title}</p>
                                  </div>
                               ) : (
                                  <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{d.sourceOrVendor || "General Fund"}</p>
                               )}
                             </td>
                             <td className="px-12 py-6 text-right font-black text-emerald-500 tracking-tighter text-lg">
                               NPR {d.amount.toLocaleString()}
                             </td>
                           </tr>
                         ))
                       )}
                    </tbody>
                 </table>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
