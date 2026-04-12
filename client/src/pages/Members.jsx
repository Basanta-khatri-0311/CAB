import { useState, useEffect } from "react";
import API from "../api/axios";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await API.get("/public/members");
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
          The heartbeat of the Cricket Association of Bhaluhi.
        </p>
      </header>

      <div className="projects-grid">
        {members.map((member) => (
          <div key={member._id} className="member-card fade-up">
            <div className="member-card__image-container">
              {member.photo ? (
                <img src={member.photo} alt={member.name} className="member-card__img" />
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#d97706", fontSize: "48px", fontWeight: "bold", background: "#050505" }}>
                  {member.name.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="member-card__content">
              <h3 className="member-card__title">{member.name}</h3>
              <p className="member-card__position">{member.roleInClub || "Association Member"}</p>
              
              <p className="member-card__bio">
                {member.bio || "Active member of the Bhaluhi Cricket Association contributing to the growth of local sports."}
              </p>

              {member.phone && (
                <div className="member-card__phone">
                  <span className="member-card__phone-icon">📞</span>
                  {member.phone}
                </div>
              )}
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
