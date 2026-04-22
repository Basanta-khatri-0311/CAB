import { Link } from "react-router-dom";
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
  { 
    icon: (
      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.8 9.9 67.6 36.1 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
      </svg>
    ), 
    href: "#", 
    color: "hover:text-pink-500", 
    label: "Instagram" 
  },
  { 
    icon: (
      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path>
      </svg>
    ), 
    href: "#", 
    color: "hover:text-blue-500", 
    label: "Facebook" 
  },
  { 
    icon: (
      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.781 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path>
      </svg>
    ), 
    href: "#", 
    color: "hover:text-red-500", 
    label: "YouTube" 
  },
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