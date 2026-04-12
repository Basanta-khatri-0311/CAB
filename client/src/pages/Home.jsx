import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API from "../api/axios";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await API.get("/public/home");
        setData(res.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="loader-screen">
        <div className="loader-spinner"></div>
        <div className="loader-text">Preparing the Arena...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="loader-screen">
        <div className="login-error">The scoreboard couldn't load. Please refresh.</div>
      </div>
    );
  }

  const { stats, members, posts, completedProjects } = data;

  return (
    <div className="home-v2">
      {/* ── Hero ── */}
      <div className="home-v2__hero" style={{ backgroundImage: `url('/Users/basantkhatri/.gemini/antigravity/brain/36992476-ebb9-47b4-8ad3-6819f8a65aec/cricket_hero_bg_1776016684214.png')` }}>
        <div className="stadium-overlay"></div>
        <div className="home-v2__hero-content fade-up">
          <div className="home-v2__eyebrow">◆ Dedicated to Cricket Lover </div>
          <h1 className="home-v2__title">Cricket Association<br /><span>Bhaluhi</span></h1>
          <p className="home-v2__subtitle" style={{ color: "#d1d5db" }}>
            Real-time board treasury, squad updates, and club milestones for Bhaluhi — all in one place.
          </p>
          <div className="home-v2__actions">
            {!localStorage.getItem("token") && <Link to="/register" className="home-v2__btn-primary">Join the Squad</Link>}
            <Link to={localStorage.getItem("token") ? "/admin" : "/login"} className="home-v2__btn-secondary">
              {localStorage.getItem("token") ? "Admin Panel" : "Member Login"}
            </Link>
          </div>
        </div>
      </div>

      {/* ── 1. Financial Stats ── */}
      <section className="home-v2__stats-section">
        <div className="home-v2__stats-header">
          <div className="section-eyebrow">Live Treasury</div>
          <h2 className="section-title" style={{ justifyContent: "center" }}>Board Financials</h2>
          <div className="home-v2__stats-line"></div>
        </div>
        <div className="home-v2__stats-grid">
          <div className="home-v2__stat">
            <span className="home-v2__stat-icon">💰</span>
            <p className="home-v2__stat-value home-v2__stat-value--green">NPR {stats.totalIncome.toLocaleString()}</p>
            <p className="home-v2__stat-label">Total Money Collected</p>
          </div>
          <div className="home-v2__stat">
            <span className="home-v2__stat-icon">📉</span>
            <p className="home-v2__stat-value home-v2__stat-value--red">NPR {stats.totalExpense.toLocaleString()}</p>
            <p className="home-v2__stat-label">Total Expenses Done</p>
          </div>
          <div className="home-v2__stat">
            <span className="home-v2__stat-icon">🏦</span>
            <p className="home-v2__stat-value home-v2__stat-value--amber">NPR {stats.balance.toLocaleString()}</p>
            <p className="home-v2__stat-label">Balance Remaining</p>
          </div>
        </div>
      </section>

      {/* ── 2. Members List ── */}
      <section className="page-wrapper-wide fade-up">
        <div className="section-header" style={{ textAlign: "center", marginBottom: "50px" }}>
          <div className="section-eyebrow">The Warriors</div>
          <h2 className="page-title">Club Members</h2>
        </div>
        <div className="projects-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {members.map((member) => (
            <div key={member._id} className="member-card">
              <div className="member-card__image-container" style={{ aspectRatio: "1/1" }}>
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="member-card__img" />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#d97706", fontSize: "32px", fontWeight: "bold", background: "#050505" }}>
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="member-card__content" style={{ padding: "20px" }}>
                <h4 className="member-card__title" style={{ fontSize: "16px" }}>{member.name}</h4>
                <p className="member-card__position">{member.roleInClub}</p>
                <p className="member-card__bio" style={{ fontSize: "12px", marginTop: "10px" }}>{member.bio}</p>
                {member.phone && (
                  <div className="member-card__phone" style={{ marginTop: "10px", fontSize: "11px" }}>
                    <span className="member-card__phone-icon">📞</span> {member.phone}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="pitch-divider" style={{ maxWidth: "1200px", margin: "80px auto" }}></div>

      {/* ── 3. Projects Section ── */}
      <section className="page-wrapper-wide fade-up">
        <div className="section-header" style={{ textAlign: "center", marginBottom: "50px" }}>
          <div className="section-eyebrow">Milestones</div>
          <h2 className="page-title">Completed Projects</h2>
        </div>
        <div className="projects-grid">
          {completedProjects.map((project) => (
            <div key={project._id} className="project-card cricket-card">
              <h3 className="project-card__title" style={{ color: "#f3f4f6" }}>{project.title}</h3>
              <p className="project-card__desc">{project.description}</p>
              <div className="project-card__footer" style={{ marginTop: "24px" }}>
                <div>
                  <div className="project-card__budget-label">Money Used</div>
                  <div className="project-card__budget-value" style={{ color: "#d97706" }}>NPR {project.moneyUsed.toLocaleString()}</div>
                </div>
                <div className="status-badge status-completed"><span className="dot"></span> Done</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Posts Section ── */}
      <section className="page-wrapper fade-up" style={{ backgroundColor: "#080808", borderRadius: "32px", padding: "80px 48px", marginTop: "100px", border: "1px solid #1a1a1a" }}>
        <div className="section-header" style={{ textAlign: "center", marginBottom: "50px" }}>
          <div className="section-eyebrow">Newsroom</div>
          <h2 className="page-title">Latest Posts</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {posts.map((post) => (
            <article key={post._id} className="project-card cricket-card" style={{ display: "grid", gridTemplateColumns: post.image ? "240px 1fr" : "1fr", gap: "32px", alignItems: "start", background: "#050505" }}>
              {post.image && <img src={post.image} alt={post.title} style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "16px" }} />}
              <div>
                <h3 className="project-card__title" style={{ marginTop: 0, fontSize: "22px" }}>{post.title}</h3>
                <p className="project-card__desc" style={{ marginBottom: "20px", fontSize: "15px", lineHeight: "1.7" }}>{post.content.substring(0, 180)}...</p>
                <div style={{ fontSize: "11px", color: "#6b7280", letterSpacing: "0.05em" }}>
                  {new Date(post.createdAt).toLocaleDateString()} • RECENT RECORD
                </div>
              </div>
            </article>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <Link to="/posts" className="home-v2__btn-secondary">View Club Archive</Link>
        </div>
      </section>
    </div>
  );
}