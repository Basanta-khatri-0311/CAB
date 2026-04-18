import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Modal from "../../components/ui/Modal";

const defaultForm = {
  donorType: "member",
  memberId: "",
  projectId: "",
  type: "income",
  amount: "",
  sourceOrVendor: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
};

export default function FinancesPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(defaultForm);

  const fetchData = async () => {
    try {
      const [pRes, mRes, fRes] = await Promise.all([
        API.get("/projects"),
        API.get("/public/members"),
        API.get("/finances")
      ]);
      setProjects(pRes.data);
      setMembers(mRes.data);
      setFinances(fRes.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const closeModal = () => { setIsOpen(false); setFormData(defaultForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...formData };
      if (data.donorType === 'member') {
        // Find member name to save as sourceOrVendor as fallback
        const m = members.find(mem => mem._id === data.memberId);
        data.sourceOrVendor = m?.name || "Member";
      }
      
      await API.post("/finances", data);
      closeModal();
      fetchData();
    } catch (err) { console.error("Failed to save", err); }
    finally { setSaving(false); }
  };

  const totalIncome = finances.filter(f => f.type === "income").reduce((s, f) => s + (f.amount || 0), 0);
  const totalExpense = finances.filter(f => f.type === "expense").reduce((s, f) => s + (f.amount || 0), 0);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
       <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin mb-6" />
       <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Loading Ledger...</p>
    </div>
  );

  return (
    <div className="bg-black min-h-screen text-gray-200 pb-20">
      <header className="bg-zinc-900/10 border-b border-white/5 py-20 px-6 mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10">
          <div>
            <span className="section-eyebrow tracking-[0.3em]">Treasury & Project Funding</span>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase mb-4 decoration-brand underline underline-offset-8">Money Records</h1>
            <p className="text-gray-500 text-sm max-w-lg mt-8 leading-relaxed">
               Comprehensive oversight of club finances, individual contributions, and project expenditures.
            </p>
          </div>
          <div className="flex gap-6">
             <div className="text-right">
                <p className="text-emerald-500 text-3xl font-black tracking-tighter">NPR {totalIncome.toLocaleString()}</p>
                <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Total Income</p>
             </div>
             <div className="w-[1px] h-12 bg-white/10" />
             <div className="text-right">
                <p className="text-red-500 text-3xl font-black tracking-tighter">NPR {totalExpense.toLocaleString()}</p>
                <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Total Expenses</p>
             </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
           <h2 className="text-2xl font-black text-white tracking-tight underline decoration-white/10 underline-offset-8">All Transactions</h2>
           <button onClick={() => setIsOpen(true)} className="bg-brand hover:bg-brand-dark px-10 py-4 rounded-xl text-black font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-brand/20 active:scale-95 transition-all">
              + New Entry
           </button>
        </div>

        {/* Unified Table */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-[3rem] overflow-hidden shadow-3xl backdrop-blur-md">
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Contributor / Vendor</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Target Project</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Amount</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {finances.map(f => (
                    <tr key={f._id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-10 py-8">
                         <div className="flex items-center gap-4">
                            <div className={`w-1 h-8 rounded-full ${f.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            <div>
                               <p className="text-white font-black text-lg tracking-tight group-hover:text-brand transition-colors">
                                  {f.memberId?.name || f.sourceOrVendor}
                               </p>
                               <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1">{new Date(f.date).toLocaleDateString()}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-10 py-8">
                         {f.projectId ? (
                           <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-brand/40 animate-pulse" />
                              <p className="text-white font-bold text-sm">{f.projectId.title}</p>
                           </div>
                         ) : (
                           <p className="text-gray-700 text-[10px] font-black uppercase tracking-widest">General Fund</p>
                         )}
                      </td>
                      <td className={`px-10 py-8 text-right font-black text-xl tracking-tighter ${f.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                         {f.type === 'income' ? '+' : '-'} {f.amount?.toLocaleString()}
                      </td>
                      <td className="px-10 py-8 text-center">
                         <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] border border-white/10 px-3 py-1 rounded-full group-hover:bg-white/5 transition-colors">
                            {f.donorType || 'Direct'}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} title="Record New Transaction">
         <form onSubmit={handleSubmit} className="p-4 space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4 mb-2 block">Action Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-[10px] font-black text-brand uppercase tracking-widest focus:border-brand">
                     <option value="income">Receiving Income (+)</option>
                     <option value="expense">Recording Expense (-)</option>
                  </select>
               </div>
               <div>
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4 mb-2 block">Source Category</label>
                  <select name="donorType" value={formData.donorType} onChange={handleChange} className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-[10px] font-black text-white uppercase tracking-widest focus:border-brand">
                     <option value="member">Club Member</option>
                     <option value="outside">Outside Donor</option>
                     <option value="government">Government Side</option>
                  </select>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4 mb-2 block">Target Destination</label>
                  <select name="projectId" value={formData.projectId} onChange={handleChange} className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-[10px] font-black text-white uppercase tracking-widest focus:border-brand">
                     <option value="">General (No Project)</option>
                     {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                  </select>
               </div>
               <div>
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4 mb-2 block">Amount (NPR)</label>
                  <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-lg font-black text-white tracking-tighter focus:border-brand" required />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4 block">
                  {formData.donorType === 'member' ? 'Select Member Account' : 'Payer / Vendor Name'}
               </label>
               {formData.donorType === 'member' ? (
                 <select name="memberId" value={formData.memberId} onChange={handleChange} className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-[10px] font-black text-white uppercase tracking-widest focus:border-brand" required>
                    <option value="">Select Warrior...</option>
                    {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                 </select>
               ) : (
                 <input type="text" name="sourceOrVendor" value={formData.sourceOrVendor} onChange={handleChange} placeholder="Full Name / Agency Name" className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-xs font-medium text-gray-400 focus:border-brand" required />
               )}
            </div>

            <div className="flex gap-4 pt-6">
               <button type="button" onClick={closeModal} className="flex-grow py-5 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-500 transition-all">Abort</button>
               <button type="submit" disabled={saving} className="flex-grow py-5 bg-brand hover:bg-brand-dark rounded-xl text-[9px] font-black uppercase tracking-widest text-black shadow-xl shadow-brand/20 transition-all">
                  {saving ? 'Syncing...' : 'Commit Transfer'}
               </button>
            </div>
         </form>
      </Modal>
    </div>
  );
}