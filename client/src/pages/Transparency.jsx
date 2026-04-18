import { useState, useEffect } from "react";
import API from "../api/axios";

export default function Transparency() {
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinances = async () => {
      try {
        const res = await API.get("/finances");
        setFinances(res.data);
      } catch (error) {
        console.error("Error fetching detailed transparency data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFinances();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold tracking-widest text-gray-500 uppercase">Auditing Treasury</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-gray-200 pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-20">
        <header className="mb-16">
          <span className="section-eyebrow">Internal Audit</span>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">Detailed Transparency</h1>
          <p className="text-gray-500 max-w-xl text-sm">
            A real-time ledger of every rupee collected and spent by the Cricket Association of Bhaluhi.
          </p>
        </header>

        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
             <span className="w-2 h-2 rounded-full bg-brand" />
             Contribution Records
          </h2>
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{finances.length} Audit Entries</span>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-zinc-900/30 backdrop-blur-sm shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Timestamp</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Source / Donor</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Category</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Memo</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] text-right">Ledger Amt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {finances.map((tx) => (
                  <tr key={tx._id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-8 py-5 text-[11px] text-gray-500 font-medium">
                      {new Date(tx.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-5 font-bold text-white tracking-tight">
                      {tx.donorType === 'member' && tx.memberId ? tx.memberId.name : tx.sourceOrVendor}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        tx.donorType === 'member' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 
                        tx.donorType === 'outside' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 
                        'bg-zinc-500/10 border-zinc-500/20 text-zinc-500'
                      }`}>
                        {tx.donorType || 'Other'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1">
                        {tx.projectId && (
                          <span className="text-[9px] font-bold text-brand uppercase tracking-widest flex items-center gap-1">
                             <span className="w-1 h-1 rounded-full bg-brand" /> {tx.projectId.title}
                          </span>
                        )}
                        <span className="text-xs text-gray-400 font-medium group-hover:text-gray-200 transition-colors line-clamp-1">{tx.description}</span>
                      </div>
                    </td>
                    <td className={`px-8 py-5 text-right font-black tracking-tighter text-lg ${tx.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {tx.type === 'income' ? '+' : '-'} <span className="text-xs font-bold mr-1">Rs.</span>{tx.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
