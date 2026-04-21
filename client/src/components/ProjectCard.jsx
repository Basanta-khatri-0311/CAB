import { Link } from "react-router-dom";

export default function ProjectCard({ project, disableLink = false }) {
  const content = (
    <div className="group bg-zinc-900 border border-white/5 rounded-3xl p-6 md:p-8 h-full flex flex-col justify-between transition-all duration-300 hover:border-brand/30 hover:-translate-y-1 shadow-2xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand/5 blur-3xl rounded-full group-hover:bg-brand/10 transition-colors" />
      
      <div>
        <div className="flex justify-between items-start mb-6">
          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0 ${
            project.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
            project.status === 'ongoing' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
            'bg-amber-500/10 border-amber-500/20 text-amber-500'
          }`}>
            {project.status}
          </span>
        </div>
        
        <h2 className="text-2xl font-black text-white tracking-tighter mb-4 decoration-brand group-hover:underline underline-offset-8 transition-all">
          {project.title}
        </h2>
        <p className="text-gray-500 text-xs leading-relaxed font-medium line-clamp-3 mb-8">
          {project.description}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-6">
        <div>
          <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Financial Roadmap</p>
          <p className="text-brand font-black text-lg tracking-tight">
            NPR {project.estimatedBudget?.toLocaleString()}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-600 group-hover:text-brand group-hover:border-brand/50 transition-all font-bold group-hover:translate-x-1">
          →
        </div>
      </div>
    </div>
  );

  if (disableLink) return content;

  return (
    <Link to={`/projects/${project._id}`} className="block h-full">
      {content}
    </Link>
  );
}