import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProjectById } from "../services/projects.api";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const COLORS = ["#10b981", "#ef4444"];

export default function ProjectDetails() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    fetchProjectById(id).then((data) => setProjectData(data)).catch(console.error);
  }, [id]);

  // Wait for both project data and auth status check
  if (!projectData || authLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold tracking-widest text-gray-500 uppercase">Syncing Ledger...</p>
      </div>
    );

  const { project, totalIncome, totalExpense, remainingBalance, transactions } = projectData;

  const pieData = [
    { name: "Income", value: totalIncome || 0 },
    { name: "Expense", value: totalExpense || 0 },
  ];

  // If still not logged in after check, show restricted view
  if (!user) {
    return (
      <div className="bg-black min-h-screen text-gray-200">
        {/* Header Section - Still visible to guests */}
        <div className="bg-zinc-900/30 border-b border-white/5 py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <span className="section-eyebrow">Project Details</span>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-6">{project.title}</h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mb-10">{project.description}</p>
            
            <div className="flex flex-wrap gap-4 items-center">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                project.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                project.status === 'ongoing' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                'bg-amber-500/10 border-amber-500/20 text-amber-500'
              }`}>
                {project.status}
              </span>
            </div>
          </div>
        </div>

        {/* Restricted Message instead of Finances */}
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="mb-8 p-8 rounded-full bg-brand/5 border border-brand/10 w-fit mx-auto">
              <span className="text-5xl">🔐</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter mb-4">Member Access Required</h2>
          <p className="max-w-md mx-auto text-gray-500 text-sm leading-relaxed mb-10 uppercase font-bold tracking-widest">
            Detailed project ledgers, cash flows, and member contributions are exclusively available to <span className="text-brand">authenticated members</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="px-10 py-4 bg-brand text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-full hover:scale-105 transition-transform shadow-xl shadow-brand/20">
                Sign In to View
            </Link>
            <Link to="/register" className="px-10 py-4 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-full hover:bg-white/10 transition-all">
                Join Association
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-gray-200 pb-20">
      {/* Header Section */}
      <div className="bg-zinc-900/30 border-b border-white/5 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="section-eyebrow">Project Details</span>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-6">{project.title}</h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mb-10">{project.description}</p>
          
          <div className="flex flex-wrap gap-4 items-center">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${
              project.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
              project.status === 'ongoing' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
              'bg-amber-500/10 border-amber-500/20 text-amber-500'
            }`}>
              {project.status}
            </span>
            <div className="h-8 w-px bg-white/10 hidden sm:block" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Budget: <span className="text-white ml-2">NPR {project.estimatedBudget?.toLocaleString()}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-10">
        {/* Stat Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Total Income", value: totalIncome, color: "text-emerald-500", icon: "↑" },
            { label: "Total Expense", value: totalExpense, color: "text-red-500", icon: "↓" },
            { label: "Remaining", value: remainingBalance, color: "text-brand", icon: "◈" },
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-900 border border-white/5 p-8 rounded-[2rem] shadow-2xl transition-all hover:border-white/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{stat.label}</span>
                <span className={`text-xl ${stat.color}`}>{stat.icon}</span>
              </div>
              <p className={`text-3xl font-black tracking-tighter ${stat.color}`}>
                NPR {stat.value?.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          <div className="space-y-12">
            {/* Member Contributions */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-black text-white capitalize">Member Contributions</h2>
                <span className="px-3 py-1 rounded-full bg-white/5 text-gray-500 text-[10px] font-bold">{transactions.filter(t => t.memberId).length}</span>
              </div>
              <div className="overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/40">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Member</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {transactions.filter(t => t.memberId).length === 0 ? (
                      <tr><td colSpan="3" className="px-6 py-12 text-center text-xs text-gray-500 uppercase tracking-widest">No contributions recorded.</td></tr>
                    ) : (
                      transactions.filter(t => t.memberId).map((t) => (
                        <tr key={t._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 font-bold text-white">{t.memberId.name}</td>
                          <td className="px-6 py-4 font-mono text-emerald-500 font-bold">NPR {t.amount?.toLocaleString()}</td>
                          <td className="px-6 py-4 text-xs text-gray-500">{new Date(t.date).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Other Transactions */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-black text-white capitalize">Project Ledgers</h2>
                <span className="px-3 py-1 rounded-full bg-white/5 text-gray-500 text-[10px] font-bold">{transactions.filter(t => !t.memberId).length}</span>
              </div>
              <div className="overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/40">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Type</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Memo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {transactions.filter(t => !t.memberId).map((t) => (
                      <tr key={t._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-2 py-1 rounded-sm ${
                            t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {t.type}
                          </span>
                        </td>
                        <td className={`px-6 py-4 font-mono font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                          {t.amount?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-white font-medium">{t.sourceOrVendor}</p>
                          <p className="text-[10px] text-gray-500 line-clamp-1">{t.description}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            <div className="bg-zinc-900 border border-white/5 rounded-[2.5rem] p-8 sticky top-24">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 mb-8">Cash Analysis</h3>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} cornerRadius={4} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 flex justify-around text-center">
                <div>
                   <p className="text-emerald-500 text-lg font-black">{Math.round((totalIncome / (totalIncome + totalExpense || 1)) * 100)}%</p>
                   <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">In</p>
                </div>
                <div>
                   <p className="text-red-500 text-lg font-black">{Math.round((totalExpense / (totalIncome + totalExpense || 1)) * 100)}%</p>
                   <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Out</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}