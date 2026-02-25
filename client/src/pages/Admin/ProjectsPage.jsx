import { useEffect, useState } from "react";
import Modal from "../../components/ui/Modal";
import ProjectForm from "../../components/Admin/ProjectForm";
import { useAuth } from "../../context/AuthContext";

const statusClass = {
  planning: "status-planning",
  ongoing: "status-ongoing",
  completed: "status-completed",
};

export default function ProjectsPage() {
  const { token } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:5500/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
      setError("Could not load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAdd = () => {
    setEditingProject(null);
    setIsOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    try {
      const res = await fetch(`http://localhost:5500/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Delete failed");
      fetchProjects();
    } catch (err) {
      alert("Failed to delete project. Please try again.");
    }
  };

  const handleSubmit = async (formData) => {
    const url = editingProject
      ? `http://localhost:5500/api/projects/${editingProject._id}`
      : "http://localhost:5500/api/projects";

    try {
      const res = await fetch(url, {
        method: editingProject ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Save failed");
      setIsOpen(false);
      fetchProjects();
    } catch (err) {
      alert("Failed to save project. Please try again.");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header-left">
        <div className="page-wrapper">
          <p className="section-eyebrow">◆ Admin Panel</p>
          <h1 className="page-title">Manage Projects</h1>
          <p className="project-description">
            Add, edit, or remove community projects.
          </p>
        </div>
      </div>

      <div className="page-wrapper">

        {/* Top bar */}
        <div className="admin-page-header fade-up">
          <p style={{ color: "#4b5563", fontSize: "13px" }}>
            {projects.length} project{projects.length !== 1 ? "s" : ""} total
          </p>
          <button className="admin-add-btn" onClick={handleAdd}>
            + Add Project
          </button>
        </div>

        {/* Error */}
        {error && <p className="login-error">{error}</p>}

        {/* Table */}
        {loading ? (
          <div className="loader-screen" style={{ minHeight: "240px" }}>
            <div className="loader-spinner" />
            <p className="loader-text">Loading projects</p>
          </div>
        ) : (
          <div className="admin-table-wrapper fade-up">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Est. Budget</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="admin-table__empty">
                      No projects found. Add one to get started.
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project._id}>
                      <td className="admin-table__name">{project.title}</td>
                      <td className="admin-table__budget">
                        NPR {project.estimatedBudget?.toLocaleString()}
                      </td>
                      <td>
                        <span className={`status-badge ${statusClass[project.status] || "status-planning"}`}>
                          <span className="dot" />
                          {project.status}
                        </span>
                      </td>
                      <td>
                        <div className="admin-table__actions">
                          <button
                            className="admin-btn-edit"
                            onClick={() => handleEdit(project)}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-btn-delete"
                            onClick={() => handleDelete(project._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={editingProject ? "Edit Project" : "Add Project"}
        >
          <ProjectForm
            initialData={editingProject}
            onSubmit={handleSubmit}
            onClose={() => setIsOpen(false)}
          />
        </Modal>

      </div>
    </div>
  );
}