import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const cards = [
  {
    title: "Manage Projects",
    desc: "Add, edit, or remove community projects and track their progress.",
    icon: "◈",
    accent: "admin-card--blue",
    to: "/admin/projects",
  },
  {
    title: "Manage Finances",
    desc: "Record income and expense transactions for each project.",
    icon: "↕",
    accent: "admin-card--green",
    to: "/admin/finances",
  },
  {
    title: "Manage Posts",
    desc: "Create and manage club announcements and reports.",
    icon: "✎",
    accent: "admin-card--blue",
    to: "/admin/posts",
  },
  {
    title: "Manage Bookings",
    desc: "Review and confirm turf practice slots from members.",
    icon: "✓",
    accent: "admin-card--green",
    to: "/admin/bookings",
  },
  {
    title: "Members",
    desc: "Manage association members and their roles.",
    icon: "◎",
    accent: "admin-card--amber",
    to: "/members", // Direct to public members list for now, or add an admin member list later
  },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div>
      {/* Header */}
      <div className="page-header-left">
        <div className="page-wrapper">
          <p className="section-eyebrow">◆ Admin Panel</p>
          <h1 className="page-title">Welcome back, {user?.name}</h1>
          <p className="project-description">
            Manage projects, finances, and members from your dashboard.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="page-wrapper">
        <div className="admin-grid fade-up">
          {cards.map(({ title, desc, icon, accent, to }) => {
            const content = (
              <div className={`admin-card ${accent}`}>
                <span className="admin-card__icon">{icon}</span>
                <h2 className="admin-card__title">{title}</h2>
                <p className="admin-card__desc">{desc}</p>
                {to && <span className="admin-card__arrow">→</span>}
                {!to && <span className="admin-card__soon">Coming soon</span>}
              </div>
            );
            return to ? (
              <Link to={to} key={title}>{content}</Link>
            ) : (
              <div key={title}>{content}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}