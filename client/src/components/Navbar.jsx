import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-dot">◆</span> CAB
        </Link>

        {/* Desktop Links */}
        <div className="navbar__links">
          <Link to="/" className={`navbar__link ${isActive("/") ? "navbar__link--active" : ""}`}>
            Home
          </Link>
          <Link to="/transparency" className={`navbar__link ${isActive("/transparency") ? "navbar__link--active" : ""}`}>
            Transparency
          </Link>
          <Link to="/members" className={`navbar__link ${isActive("/members") ? "navbar__link--active" : ""}`}>
            Members
          </Link>
          <Link to="/posts" className={`navbar__link ${isActive("/posts") ? "navbar__link--active" : ""}`}>
            Posts
          </Link>

          {user ? (
            <>
              <Link to="/booking" className={`navbar__link ${isActive("/booking") ? "navbar__link--active" : ""}`}>
                Book Turf
              </Link>
              <Link to="/admin" className={`navbar__link ${isActive("/admin") ? "navbar__link--active" : ""}`}>
                Admin
              </Link>
              <button className="navbar__logout" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="navbar__btn">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={`navbar__bar ${menuOpen ? "navbar__bar--open-1" : ""}`} />
          <span className={`navbar__bar ${menuOpen ? "navbar__bar--open-2" : ""}`} />
          <span className={`navbar__bar ${menuOpen ? "navbar__bar--open-3" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="navbar__mobile">
          <Link to="/" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/projects" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Projects</Link>
          {user ? (
            <>
              <Link to="/admin" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button className="navbar__mobile-logout" onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}