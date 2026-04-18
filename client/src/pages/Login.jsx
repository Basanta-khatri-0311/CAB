import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] lg:h-[calc(100vh-64px)] flex items-center justify-center relative overflow-hidden bg-black">
      {/* Background Image - Hidden on Mobile */}
      <div className="absolute inset-0 z-0 hidden md:block">
        <img 
          src="https://images.unsplash.com/photo-1595210382051-4d2c31fcc2f4?q=80&w=2070&auto=format&fit=crop" 
          alt="Cricket Association" 
          className="w-full h-full object-cover opacity-50 grayscale-[50%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />
      </div>
      
      <form 
        className="relative z-10 w-full max-w-[420px] mx-4 bg-zinc-900 md:bg-zinc-900/60 md:backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl" 
        onSubmit={submitHandler}
      >
        <div className="text-center mb-6 md:mb-8">
          <span className="section-eyebrow tracking-widest text-[9px]">Authorized Personnel</span>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-2">Member Portal</h1>
          <p className="text-gray-400 text-[10px] md:text-[11px]">Secure sign-in for the Cricket Association of Bhaluhi.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-center mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4 md:space-y-6">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-4">Email Identifier</label>
            <input
              type="email"
              placeholder="name@email.com"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-3 text-white font-bold focus:outline-none focus:border-brand/50 transition-all placeholder:text-gray-800 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-4">Encryption Key</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-3 text-white font-bold focus:outline-none focus:border-brand/50 transition-all placeholder:text-gray-800 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-dark text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-brand/20 disabled:opacity-50 mt-2 active:scale-95 text-xs"
          >
            {loading ? "Decrypting..." : "Access Arena"}
          </button>
        </div>

        <div className="mt-8 text-center pt-6 border-t border-white/5">
           <p className="text-gray-600 text-[9px] font-bold uppercase tracking-widest mb-1">Not a member yet?</p>
           <Link to="/register" className="text-white hover:text-brand transition-colors font-black text-[10px] uppercase underline decoration-brand underline-offset-4">Join Association →</Link>
        </div>
      </form>
    </div>
  );
}