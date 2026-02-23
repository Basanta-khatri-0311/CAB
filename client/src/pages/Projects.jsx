import { useEffect, useState } from "react";
import { fetchProjects } from "../services/api";
import ProjectCard from "../components/ProjectCard";

const FILTERS = ["all", "planning", "ongoing", "completed"];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchProjects().then((data) => setProjects(data));
  }, []);

  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.status === filter);

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <p className="section-eyebrow">◆ CRICKET ASSOCIATION OF BHALUHI</p>
        <h1 className="page-title">Community Projects</h1>
        <p className="page-subtitle">
          Track progress, budgets, and transactions for every initiative in the club.
        </p>
        <div className="filter-bar">
          {FILTERS.map((s) => (
            <button
              key={s}
              className={`filter-btn ${filter === s ? "active" : ""}`}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="page-wrapper-wide">
        {filtered.length === 0 ? (
          <p className="empty-state">No projects found</p>
        ) : (
          <div className="projects-grid">
            {filtered.map((project, i) => (
              <div key={project._id} className={`fade-up-${Math.min(i + 1, 6)}`}>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}