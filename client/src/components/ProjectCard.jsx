import { Link } from "react-router-dom";

const statusClass = {
  planning: "status-planning",
  ongoing: "status-ongoing",
  completed: "status-completed",
};

export default function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project._id}`}>
      <div className="project-card">
        <div>
          <span className={`status-badge ${statusClass[project.status] || "status-planning"}`}>
            <span className="dot" />
            {project.status}
          </span>
          <h2 className="project-card__title">{project.title}</h2>
          <p className="project-card__desc">
            {project.description.substring(0, 110)}
            {project.description.length > 110 ? "…" : ""}
          </p>
        </div>

        <div className="project-card__footer">
          <div>
            <p className="project-card__budget-label">Est. Budget</p>
            <p className="project-card__budget-value">
              NPR {project.estimatedBudget?.toLocaleString()}
            </p>
          </div>
          <span className="project-card__arrow">→</span>
        </div>
      </div>
    </Link>
  );
}