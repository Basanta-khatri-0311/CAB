import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const cards = [
  {
    title: "Manage Projects",
    desc: "Create and update club projects like stadium repairs or equipment buying.",
    icon: "◈",
    color: "text-blue-500",
    bg: "bg-blue-500/5",
    border: "border-blue-500/10 hover:border-blue-500/30",
    to: "/admin/projects",
  },
  {
    title: "Money & Accounts",
    desc: "Record all income and expenses. Track money from members and project costs.",
    icon: "↕",
    color: "text-emerald-500",
    bg: "bg-emerald-500/5",
    border: "border-emerald-500/10 hover:border-emerald-500/30",
    to: "/admin/finances",
  },
  {
    title: "Club News",
    desc: "Write new posts, match results, or important club announcements.",
    icon: "✎",
    color: "text-amber-500",
    bg: "bg-amber-500/5",
    border: "border-amber-500/10 hover:border-amber-500/30",
    to: "/admin/posts",
  },
  {
    title: "Manage Members",
    desc: "See who is in the club and give admin rights to other members.",
    icon: "◎",
    color: "text-purple-500",
    bg: "bg-purple-500/5",
    border: "border-purple-500/10 hover:border-purple-500/30",
    to: "/admin/members",
  },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="bg-black min-h-screen text-gray-200 pb-20">
      {/* Header */}
      <div className="bg-zinc-900/30 border-b border-white/5 py-24 px-6 mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-eyebrow">Admin Panel</span>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4 decoration-brand underline underline-offset-8">
            Hello, {user?.name}
          </h1>
          <p className="text-gray-500 text-sm mt-8 max-w-xl leading-relaxed">
            Welcome to the club's management area. Use the cards below to manage different parts of our Association.
          </p>
        </div>
      </div>

      {/* Control Grid */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {cards.map(({ title, desc, icon, color, bg, border, to }) => (
            <Link 
              to={to} 
              key={title} 
              className={`group ${bg} ${border} border rounded-[2.5rem] p-10 transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden flex flex-col justify-between h-[340px] shadow-2xl`}
            >
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl ${bg} ${border} flex items-center justify-center text-3xl ${color} mb-8 group-hover:scale-110 transition-transform font-black`}>
                  {icon}
                </div>
                <h2 className="text-2xl font-black text-white mb-4 tracking-tighter group-hover:text-brand transition-all">
                  {title}
                </h2>
                <p className="text-gray-500 text-sm font-medium leading-relaxed pr-4">
                  {desc}
                </p>
              </div>
              
              <div className="flex items-center justify-between relative z-10 pt-6 border-t border-white/5 font-bold">
                <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>Open Section</span>
                <span className={`text-xl ${color} group-hover:translate-x-2 transition-transform`}>→</span>
              </div>
              
              {/* Card Decoration */}
              <div className={`absolute -bottom-10 -right-10 w-40 h-40 ${bg} blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity`} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}