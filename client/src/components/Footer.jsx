import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const quickLinks = [
  { to: "/",        label: "Arena" },
  { to: "/projects", label: "Milestones" },
  { to: "/members",  label: "The Squad" },
  { to: "/posts",    label: "Newsroom" },
  { to: "/transparency", label: "Treasury" },
];

const contactItems = [
  { icon: <FiMail />,   text: "info@cabhaluhi.org" },
  { icon: <FiPhone />,  text: "+977-9800000000" },
  { icon: <FiMapPin />, text: "Bhaluhi, Rupandehi, Nepal" },
];

const socialLinks = [
  { icon: <FaInstagram />, href: "#", color: "hover:text-pink-500", label: "Instagram" },
  { icon: <FaFacebookF />, href: "#", color: "hover:text-blue-500", label: "Facebook" },
  { icon: <FaYoutube />,   href: "#", color: "hover:text-red-500", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20 animate-fade-up">

        {/* ── Brand ── */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-brand text-2xl group-hover:scale-110 transition-transform font-black">◆</span>
            <span className="text-2xl font-black tracking-tighter text-white">CAB</span>
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed font-medium">
            Dedicated to the growth of cricket in Bhaluhi. We champion transparency, talent development, and community pride through the spirit of the game.
          </p>
          <div className="flex gap-4">
            {socialLinks.map(({ icon, href, color, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 transition-all ${color} hover:border-white/20`}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── Navigation ── */}
        <div>
          <h3 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-8">Map of Arena</h3>
          <ul className="space-y-4">
            {quickLinks.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-gray-500 hover:text-brand text-sm font-bold tracking-tight transition-colors uppercase">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Contact ── */}
        <div>
          <h3 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-8">Direct Lines</h3>
          <ul className="space-y-6">
            {contactItems.map(({ icon, text }) => (
              <li key={text} className="flex gap-4 items-center text-gray-500 group">
                <span className="text-brand text-lg group-hover:scale-110 transition-transform">{icon}</span>
                <span className="text-sm font-medium">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Newsletter/Call to Action ── */}
        <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-white text-sm font-black uppercase tracking-widest mb-4">Join the Squad</h3>
            <p className="text-gray-500 text-xs mb-6">Stay updated with match results and community milestones.</p>
            <Link to="/register" className="block w-full text-center bg-brand hover:bg-brand-dark text-black py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all transform hover:scale-105">
               Enlist Now
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-brand/5 blur-2xl rounded-full" />
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} <span className="text-gray-400">Cricket Association of Bhaluhi.</span> All rights reserved.
        </p>
        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-brand" /> Built for the community
        </p>
      </div>
    </footer>
  );
}