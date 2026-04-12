import { useState, useEffect } from "react";
import axios from "axios";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/public/members");
        setMembers(res.data);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  if (loading) {
    return (
      <div className="loader-screen">
        <div className="loader-spinner"></div>
        <div className="loader-text">Loading Members...</div>
      </div>
    );
  }

  return (
    <div className="page-wrapper fade-up">
      <header className="page-header" style={{ marginBottom: "60px", borderRadius: "20px" }}>
        <div className="section-eyebrow">The Squad</div>
        <h1 className="page-title">Our Warriors</h1>
        <p className="page-subtitle">
          The heartbeat of the Cricket Association of Bhairahawa.
        </p>
      </header>

      <div className="projects-grid">
        {members.map((member) => (
          <div key={member._id} className="project-card cricket-card">
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
              <div style={{ 
                width: "80px", 
                height: "80px", 
                borderRadius: "50%", 
                backgroundColor: "#1a1a1a", 
                overflow: "hidden",
                border: "2px solid #d97706"
              }}>
                {member.photo ? (
                  <img src={member.photo} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#d97706", fontSize: "24px", fontWeight: "bold" }}>
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="project-card__title" style={{ margin: 0 }}>{member.name}</h3>
                <div className="status-badge status-ongoing" style={{ marginTop: "5px" }}>
                  <span className="dot"></span> {member.roleInClub || "Player"}
                </div>
              </div>
            </div>
            
            <p className="project-card__desc" style={{ marginTop: "20px" }}>
              {member.bio || "Active member of the squad contributing to the growth of local cricket."}
            </p>

            <div className="project-card__footer" style={{ marginTop: "auto" }}>
              <div>
                <div className="project-card__budget-label">Debut</div>
                <div className="project-card__budget-value" style={{ fontSize: "12px", color: "#6b7280" }}>
                  {new Date(member.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="project-card__arrow">🏏</div>
            </div>
          </div>
        ))}
      </div>

      {members.length === 0 && (
        <div className="empty-state">No members found</div>
      )}
    </div>
  );
}
