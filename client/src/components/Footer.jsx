import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const quickLinks = [
  { to: "/",        label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/members",  label: "Members" },
  { to: "/reports",  label: "Financial Reports" },
];

const contactItems = [
  { icon: <FiMail />,   text: "cob@example.com" },
  { icon: <FiPhone />,  text: "+977-XXXXXXXXXX" },
  { icon: <FiMapPin />, text: "Devdaha,Bhaluhi,Rupandehi,Nepal" },
];

const socialLinks = [
  { icon: <FaInstagram />, href: "#", modifier: "footer__social-btn--instagram", label: "Instagram" },
  { icon: <FaFacebookF />, href: "#", modifier: "footer__social-btn--facebook",  label: "Facebook" },
  { icon: <FaYoutube />,   href: "#", modifier: "footer__social-btn--youtube",   label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__main">

        {/* ── Brand ── */}
        <div>
          <div className="footer__brand-logo">
            <span className="footer__brand-dot">◆</span> COB
          </div>
          <p className="footer__brand-desc">
            A community-driven sports organisation committed to transparency,
            development, and responsible management of funds.
          </p>
          <div className="footer__social">
            {socialLinks.map(({ icon, href, modifier, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className={`footer__social-btn ${modifier}`}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── Quick Links ── */}
        <div>
          <p className="footer__col-title">Quick Links</p>
          <ul className="footer__links">
            {quickLinks.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="footer__link">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Contact ── */}
        <div>
          <p className="footer__col-title">Contact</p>
          <ul className="footer__contact-list">
            {contactItems.map(({ icon, text }) => (
              <li key={text} className="footer__contact-item">
                <span className="footer__contact-icon">{icon}</span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Follow ── */}
        <div>
          <p className="footer__col-title">Follow Us</p>
          <p className="footer__brand-desc">
            Stay connected for the latest updates, match results, and community announcements.
          </p>
          <div className="footer__social">
            {socialLinks.map(({ icon, href, modifier, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className={`footer__social-btn ${modifier}`}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div className="footer__bottom">
        <p className="footer__copyright">
          © {new Date().getFullYear()} <span>Cricket Association of Bhaluhi.</span> All rights reserved.
        </p>
        <p className="footer__tagline">Built for the community</p>
      </div>
    </footer>
  );
}