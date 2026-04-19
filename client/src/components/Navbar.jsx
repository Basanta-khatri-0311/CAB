import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => 
    `text-sm font-bold tracking-tight uppercase transition-colors hover:text-white ${
      isActive(path) ? "text-white relative after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-px after:bg-brand" : "text-gray-400"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-brand text-xl group-hover:scale-110 transition-transform font-black">◆</span>
            <span className="text-xl font-black tracking-tighter text-white">CAB</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={linkClass("/")}>Arena</Link>
            <Link to="/projects" className={linkClass("/projects")}>Milestones</Link>
            <Link to="/posts" className={linkClass("/posts")}>Newsroom</Link>
            
            {user && (
              <>
                <Link to="/transparency" className={linkClass("/transparency")}>Treasury</Link>
                <Link to="/profile" className={linkClass("/profile")}>Profile</Link>
                {user.role === "admin" && (
                  <Link to="/admin" className={linkClass("/admin")}>Control Room</Link>
                )}
              </>
            )}



            <div className="flex items-center gap-4 ml-4">
              {user ? (
                <button 
                  onClick={logout}
                  className="px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border border-red-900/50 text-red-500 hover:bg-red-500 hover:text-white transition-all transform hover:scale-105"
                >
                  Sign Out
                </button>
              ) : (
                <div className="flex items-center gap-6">
                  <Link to="/login" className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest">Sign In</Link>
                  <Link to="/register" className="bg-brand hover:bg-brand-dark text-black px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all transform hover:scale-105 shadow-xl shadow-brand/20">
                    Join Association
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black border-b border-border animate-fade-up">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link to="/" className="block px-3 py-4 text-base font-black text-gray-300 hover:text-white uppercase" onClick={() => setMenuOpen(false)}>Arena</Link>
            <Link to="/projects" className="block px-3 py-4 text-base font-black text-gray-300 hover:text-white uppercase" onClick={() => setMenuOpen(false)}>Milestones</Link>
            <Link to="/posts" className="block px-3 py-4 text-base font-black text-gray-300 hover:text-white uppercase" onClick={() => setMenuOpen(false)}>Newsroom</Link>
            {user && (
              <>
                <Link to="/transparency" className="block px-3 py-4 text-base font-black text-gray-300 hover:text-white uppercase" onClick={() => setMenuOpen(false)}>Treasury</Link>
                <Link to="/profile" className="block px-3 py-4 text-base font-black text-gray-300 hover:text-white uppercase" onClick={() => setMenuOpen(false)}>Profile</Link>
                {user.role === "admin" && (
                  <Link to="/admin" className="block px-3 py-4 text-base font-black text-brand hover:text-white uppercase" onClick={() => setMenuOpen(false)}>Control Room</Link>
                )}
              </>
            )}
            {user ? (
              <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full text-left px-3 py-4 text-base font-black text-red-500 uppercase">Sign Out</button>
            ) : (
              <Link to="/login" className="block px-3 py-4 text-base font-black text-brand uppercase" onClick={() => setMenuOpen(false)}>Sign In</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}