import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const statConfig = [
  { key: "totalIncome",       label: "Money Collected", icon: "🏏", format: (v) => `NPR ${v.toLocaleString()}`, colorClass: "home-v2__stat-value--green" },
  { key: "totalExpense",      label: "Expenses Done",     icon: "🏟️", format: (v) => `NPR ${v.toLocaleString()}`, colorClass: "home-v2__stat-value--red" },
  { key: "remainingBalance",  label: "Balance available",  icon: "🏆", format: (v) => `NPR ${v.toLocaleString()}`, colorClass: "home-v2__stat-value--amber" },
];

export default function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/public/stats");
        setStats(res.data);
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
      <div className="home-v2__hero" style={{ backgroundImage: `url('/Users/basantkhatri/.gemini/antigravity/brain/36992476-ebb9-47b4-8ad3-6819f8a65aec/cricket_hero_bg_1776016684214.png')` }}>
        <div className="stadium-overlay"></div>
        
        <div className="home-v2__hero-content">
          <div className="home-v2__eyebrow">
            ◆ Promoting Cricket Excellence
          </div>

          <h1 className="home-v2__title">
            Cricket Association<br />
            of <span>Bhairahawa</span>
          </h1>

          <p className="home-v2__subtitle" style={{ color: "#9ca3af" }}>
            The official portal of Bhairahawa Cricket. Track our growth, 
            support our players, and ensure transparency for a better future.
          </p>

          <div className="home-v2__actions">
            <Link to="/transparency" className="home-v2__btn-primary">
              View Records
            </Link>
            <Link to="/members" className="home-v2__btn-secondary">
              Our Squad
            </Link>
          </div>
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