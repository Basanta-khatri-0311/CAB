import { useEffect, useState } from "react";
import API from "../../api/axios";
import Modal from "../../components/ui/Modal";
import ProjectForm from "../../components/Admin/ProjectForm";
import { useAuth } from "../../context/AuthContext";

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
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
      await API.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      alert("Failed to delete project. Please try again.");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingProject) {
        await API.put(`/projects/${editingProject._id}`, formData);
      } else {
        await API.post("/projects", formData);
      }
      setIsOpen(false);
      fetchProjects();
    } catch (err) {
      alert("Failed to save project. Please try again.");
    }
  };

  return (
    <div className="bg-black min-h-screen text-gray-200 pb-20">
      {/* Header */}
      <div className="py-16 px-6 bg-zinc-900/10 border-b border-white/5 mb-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="max-w-2xl">
            <span className="section-eyebrow tracking-[0.3em]">Command Center</span>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 decoration-brand underline underline-offset-8 decoration-4">Manage Projects</h1>
            <p className="text-gray-500 text-xs max-w-lg leading-relaxed">
              Oversee association initiatives, define milestones, and audit club progress.
            </p>
          </div>
          
          <button 
            onClick={handleAdd}
            className="bg-brand hover:bg-brand-dark text-black font-black uppercase tracking-widest px-8 py-3 rounded-xl text-xs transition-all transform hover:scale-105 shadow-xl shadow-brand/20 active:scale-95"
          >
            + New Project
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center mb-8">
            {error}
          </div>
        )}

        {/* Loading / Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Scanning Records...</p>
          </div>
        ) : (
          <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Project Identity</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Est. Budget</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">No initiatives found in archives.</p>
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <p className="text-white font-black text-lg tracking-tight group-hover:text-brand transition-colors">{project.title}</p>
                        <p className="text-[10px] text-gray-500 font-medium mt-1 line-clamp-1">{project.description}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-white font-mono font-black text-sm">
                          NPR {project.estimatedBudget?.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          project.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                          project.status === 'ongoing' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                          'bg-amber-500/10 border-amber-500/20 text-amber-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                             project.status === 'completed' ? 'bg-emerald-500' :
                             project.status === 'ongoing' ? 'bg-blue-500 animate-pulse' :
                             'bg-amber-500'
                          }`} />
                          {project.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                            onClick={() => handleEdit(project)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-[10px] font-black uppercase tracking-widest text-red-900 hover:text-red-500 transition-colors"
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
          <div className="p-6">
            <ProjectForm
              initialData={editingProject}
              onSubmit={handleSubmit}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </Modal>

      </div>
    </div>
  );
}