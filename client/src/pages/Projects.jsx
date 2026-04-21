import { useEffect, useState } from "react";
import { fetchProjects } from "../services/projects.api";
import API from "../api/axios";
import ProjectCard from "../components/ProjectCard";
import ProjectFinancialModal from "../components/ProjectFinancialModal";
import Modal from "../components/ui/Modal";
import ProjectForm from "../components/Admin/ProjectForm";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useConfirm } from "../context/ConfirmContext";
import { HiPencil, HiTrash } from "react-icons/hi2";

const FILTERS = ["all", "planning", "ongoing", "completed"];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  const { user } = useAuth();
  const { showToast } = useToast();
  const confirm = useConfirm();

  const getProjects = () => {
    fetchProjects().then((data) => setProjects(data));
  };

  useEffect(() => {
    getProjects();
  }, []);

  const handleAdd = () => {
    setEditingProject(null);
    setIsAdminModalOpen(true);
  };

  const handleEdit = (project, e) => {
    e.stopPropagation();
    setEditingProject(project);
    setIsAdminModalOpen(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    confirm({
      title: "Delete Project",
      message: "Are you sure you want to delete this project? This will remove all associated data forever.",
      onConfirm: async () => {
        try {
          await API.delete(`/projects/${id}`);
          showToast("Project deleted successfully", "success");
          getProjects();
        } catch (err) {
          showToast("Error deleting project", "error");
        }
      }
    });
  };

  const handleAdminSubmit = async (formData) => {
    try {
      if (editingProject) {
        await API.put(`/projects/${editingProject._id}`, formData);
      } else {
        await API.post("/projects", formData);
      }
      setIsAdminModalOpen(false);
      showToast(editingProject ? "Project updated" : "Project created", "success");
      getProjects();
    } catch (err) {
      showToast("Failed to save changes.", "error");
    }
  };

  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.status === filter);

  return (
    <div className="bg-black min-h-screen text-gray-200">
      {/* Header */}
      <div className="py-16 px-6 bg-zinc-900/10 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="max-w-2xl">
            <span className="section-eyebrow tracking-[0.2em]">Our Initiatives</span>
            <div className="flex items-center gap-6 mb-4">
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter">Club Projects</h1>
              {user?.role === 'admin' && (
                <button 
                  onClick={handleAdd}
                  className="bg-brand hover:bg-brand-dark text-black text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-lg shadow-brand/20 active:scale-95 transition-all"
                >
                  + Add New Project
                </button>
              )}
            </div>
            <p className="text-gray-500 text-xs max-w-lg leading-relaxed">
              Tracking our development work and how we use the club's funds.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 pb-1">
            <span className="w-full text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-2 md:text-right">Filter Projects</span>
            {FILTERS.map((s) => (
              <button
                key={s}
                className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300 border ${
                  filter === s 
                    ? "bg-brand border-brand text-black" 
                    : "border-white/10 text-gray-500 hover:border-white/30 hover:text-white"
                }`}
                onClick={() => setFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {filtered.length === 0 ? (
          <div className="py-40 text-center">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">No Projects Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project) => (
              <div 
                key={project._id} 
                className="relative group/card"
                onClick={() => setSelectedProject(project)}
              >
                <ProjectCard project={project} disableLink />
                
                {user?.role === 'admin' && (
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity z-20">
                    <button 
                      onClick={(e) => handleEdit(project, e)}
                      className="w-8 h-8 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-xs text-brand hover:bg-brand hover:text-black transition-all shadow-xl"
                      title="Edit Project"
                    >
                      <HiPencil size={14} />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(project._id, e)}
                      className="w-8 h-8 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-xs text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                      title="Delete Project"
                    >
                      <HiTrash size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin Logic Modals */}
      <Modal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        title={editingProject ? "Update Project" : "Add New Project"}
      >
        <div className="p-6">
          <ProjectForm
            initialData={editingProject}
            onSubmit={handleAdminSubmit}
            onClose={() => setIsAdminModalOpen(false)}
          />
        </div>
      </Modal>

      <ProjectFinancialModal 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
        project={selectedProject}
      />
    </div>
  );
}