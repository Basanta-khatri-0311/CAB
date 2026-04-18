import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await API.post("/auth/register", formData);
      setSuccessMsg(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (successMsg) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-zinc-900/40 border border-brand/20 p-10 rounded-[2.5rem] text-center shadow-3xl">
          <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand/20">
            <span className="text-2xl">🛡️</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tighter mb-4 uppercase">Application Sent</h2>
          <p className="text-gray-400 text-xs leading-relaxed mb-8">
            Your request has been submitted. You can log in once an administrator activates your account.
          </p>
          <Link to="/" className="inline-block bg-brand text-black px-8 py-3 rounded-full font-black uppercase tracking-widest text-[9px]">
             Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black">
      <div className="max-w-3xl w-full bg-zinc-900/30 border border-white/5 p-8 md:p-10 rounded-[3rem] backdrop-blur-sm shadow-3xl">
        <div className="text-center mb-8">
          <span className="text-[9px] font-black text-brand uppercase tracking-[0.3em] mb-2 block">New Member Draft</span>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Association Entry</h1>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-[9px] font-black uppercase tracking-widest text-center mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-3">Full Name</label>
              <input
                type="text"
                placeholder="Ex: Basanta Khatri"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-black/60 border border-white/5 rounded-xl px-5 py-3.5 text-white font-bold focus:border-brand/40 outline-none transition-all text-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-3">Email Address</label>
              <input
                type="email"
                placeholder="mail@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-black/60 border border-white/5 rounded-xl px-5 py-3.5 text-white font-bold focus:border-brand/40 outline-none transition-all text-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-3">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-black/60 border border-white/5 rounded-xl px-5 py-3.5 text-white font-bold focus:border-brand/40 outline-none transition-all text-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-3">Phone</label>
              <input
                type="text"
                placeholder="98XXXXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-black/60 border border-white/5 rounded-xl px-5 py-3.5 text-white font-bold focus:border-brand/40 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-3">Short Bio / Player Role</label>
            <textarea
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-black/60 border border-white/5 rounded-2xl px-6 py-3 text-gray-300 font-medium focus:border-brand/40 outline-none transition-all min-h-[100px] text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-dark text-black font-black uppercase tracking-widest py-4 rounded-2xl transition-all shadow-xl shadow-brand/10 disabled:opacity-50 active:scale-95 text-[10px]"
          >
            {loading ? "Transmitting..." : "Submit Membership Application"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-[9px] uppercase font-bold tracking-widest">
            Joined already? <Link to="/login" className="text-brand hover:underline">Log In →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
