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
      <header className="page-header mb-[60px] rounded-[20px]">
        <div className="section-eyebrow">The Squad</div>
        <h1 className="page-title">Our Warriors</h1>
        <p className="page-subtitle">
          The heartbeat of the Cricket Association of Bhaluhi.
        </p>
      </header>

      <div className="projects-grid">
        {members.map((member) => (
          <div key={member._id} className="project-card cricket-card">
            <div className="flex gap-5 items-center">
              <div className="w-[80px] h-[80px] rounded-full bg-[#1a1a1a] overflow-hidden border-2 border-[#d97706]">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-[#d97706] text-2xl font-bold">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="project-card__title m-0">{member.name}</h3>
                <div className="status-badge status-ongoing mt-[5px]">
                  <span className="dot"></span> {member.roleInClub || "Player"}
                </div>
              </div>
            </div>

            <p className="project-card__desc mt-5">
              {member.bio || "Active member of the squad contributing to the growth of local cricket."}
            </p>

            <div className="project-card__footer mt-auto">
              <div>
                <div className="project-card__budget-label">Debut</div>
                <div className="project-card__budget-value text-[12px] text-gray-500">
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
