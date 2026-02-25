import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const statConfig = [
  { key: "totalProjects",     label: "Total Projects",     icon: "◈", format: (v) => v,                           colorClass: "" },
  { key: "completedProjects", label: "Completed Projects", icon: "✓", format: (v) => v,                           colorClass: "" },
  { key: "totalMembers",      label: "Total Members",      icon: "◎", format: (v) => v,                           colorClass: "" },
  { key: "totalIncome",       label: "Total Funds Raised", icon: "↑", format: (v) => `NPR ${v.toLocaleString()}`, colorClass: "home-v2__stat-value--green" },
  { key: "totalExpense",      label: "Total Expenses",     icon: "↓", format: (v) => `NPR ${v.toLocaleString()}`, colorClass: "home-v2__stat-value--red" },
  { key: "remainingBalance",  label: "Remaining Balance",  icon: "◆", format: (v) => `NPR ${v.toLocaleString()}`, colorClass: "home-v2__stat-value--amber" },
];

export default function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5500/api/public/stats");
        const data = await res.json();
        setStats(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="home-v2">

      {/* ── Hero ── */}
      <div className="home-v2__hero">
        <div className="home-v2__eyebrow">
          ◆ Official Transparency Portal
        </div>

        <h1 className="home-v2__title">
          Cricket Association<br />
          of <span>Bhaluhi</span>
        </h1>

        <p className="home-v2__subtitle">
          View all community projects, financial reports, and development
          activities — fully transparent and open to everyone.
        </p>

        <div className="home-v2__actions">
          <Link to="/projects" className="home-v2__btn-primary">
            View Projects
          </Link>
        </div>

        <div className="home-v2__scroll-cue">
          <div className="home-v2__scroll-line" />
          <span>Scroll</span>
        </div>
      </div>

      {/* ── Live Stats ── */}
      <div className="home-v2__stats-section">
        <div className="home-v2__stats-header">
          <p className="home-v2__stats-title">Live Statistics</p>
          <div className="home-v2__stats-line" />
        </div>

        {loading && (
          <div className="home-v2__stats-loading">
            <div className="loader-spinner" />
            <p className="loader-text">Fetching statistics</p>
          </div>
        )}

        {error && (
          <p className="home-v2__stats-error">Failed to load statistics</p>
        )}

        {!loading && !error && stats && (
          <div className="home-v2__stats-grid">
            {statConfig.map(({ key, label, icon, format, colorClass }) => (
              <div className="home-v2__stat" key={key}>
                <span className="home-v2__stat-icon">{icon}</span>
                <p className={`home-v2__stat-value ${colorClass}`}>
                  {format(stats[key])}
                </p>
                <p className="home-v2__stat-label">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Why Transparency ── */}
      <div className="home-v2__why">
        <p className="home-v2__why-label">Our Commitment</p>
        <div className="home-v2__why-content">
          <div className="home-v2__why-divider" />
          <h2>Why Transparency Matters</h2>
          <p>
            Transparency builds trust within the community. By openly sharing
            project progress and financial records, COB ensures accountability
            and responsible management of funds — so every member knows exactly
            where resources go.
          </p>
        </div>
      </div>

    </div>
  );
}