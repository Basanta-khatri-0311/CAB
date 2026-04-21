import { useState, useEffect } from "react";
import API from "../api/axios";
import Modal from "./ui/Modal";
import { useAuth } from "../context/AuthContext";

const defaultForm = {
  type: "income",
  donorType: "member",
  memberId: "",
  sourceOrVendor: "",
  amount: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
  billImage: "",
};

export default function ProjectFinancialModal({ isOpen, onClose, project }) {
  const { user, loading: authLoading } = useAuth();
  const [finances, setFinances] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFinance, setEditingFinance] = useState(null);
  const [formData, setFormData] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleBillUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("image", file);

    setUploading(true);
    try {
      const { data } = await API.post("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFormData({ ...formData, billImage: data });
    } catch (err) {
      alert("Bill upload failed");
    } finally {
      setUploading(false);
    }
  };

  const fetchData = async () => {
    if (!project) return;
    try {
      const [fRes, mRes] = await Promise.all([
        API.get(`/finances/${project._id}`),
        API.get("/public/members")
      ]);
      setFinances(fRes.data);
      setMembers(mRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (isOpen && project && !authLoading) {
      if (user) {
        setLoading(true);
        fetchData();
      } else {
        setLoading(false);
      }
    }
  }, [isOpen, project, user, authLoading]);

  const handleAction = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData, projectId: project._id };
      if (formData.donorType === 'member') {
        const m = members.find(m => m._id === formData.memberId);
        payload.sourceOrVendor = m?.name || "Member";
      }

      if (editingFinance) {
        await API.put(`/finances/${editingFinance._id}`, payload);
      } else {
        await API.post("/finances", payload);
      }
      
      setFormData(defaultForm);
      setShowAddForm(false);
      setEditingFinance(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (f) => {
    setEditingFinance(f);
    setFormData({
      type: f.type,
      donorType: f.donorType || "member",
      memberId: f.memberId?._id || f.memberId || "",
      sourceOrVendor: f.sourceOrVendor || "",
      amount: f.amount,
      description: f.description || "",
      date: new Date(f.date).toISOString().split("T")[0],
      billImage: f.billImage || "",
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await API.delete(`/finances/${id}`);
      fetchData();
    } catch (err) { alert("Delete failed."); }
  };

  if (!project) return null;

  const totalIncome = finances.filter(f => f.type === 'income').reduce((sum, f) => sum + (f.amount || 0), 0);
  const totalExpense = finances.filter(f => f.type === 'expense').reduce((sum, f) => sum + (f.amount || 0), 0);
  const balance = totalIncome - totalExpense;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Financials: ${project.title}`}>
       {loading || authLoading ? (
         <div className="p-20 text-center text-xs text-gray-500 font-bold uppercase tracking-widest animate-pulse">Syncing Ledger...</div>
       ) : !user ? (
         <div className="p-20 text-center space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">
              Detailed financial records are restricted to <br/>
              <span className="text-brand">Verified Association Members</span>
            </p>
            <div className="pt-4">
               <a href="/login" className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-brand hover:text-black transition-all">Identify Yourself</a>
            </div>
         </div>
       ) : (
         <div className="max-h-[80vh] overflow-y-auto px-2 custom-scrollbar space-y-8">
            <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-8">
               <div className="text-center">
                  <p className="text-[9px] uppercase font-bold text-gray-500 mb-1">Income</p>
                  <p className="text-emerald-500 font-bold">NPR {totalIncome.toLocaleString()}</p>
               </div>
               <div className="text-center">
                  <p className="text-[9px] uppercase font-bold text-gray-500 mb-1">Expenses</p>
                  <p className="text-red-500 font-bold">NPR {totalExpense.toLocaleString()}</p>
               </div>
               <div className="text-center">
                  <p className="text-[9px] uppercase font-bold text-gray-500 mb-1">Balance</p>
                  <p className={`font-bold ${balance >= 0 ? 'text-brand' : 'text-red-900'}`}>NPR {balance.toLocaleString()}</p>
               </div>
            </div>

            {user?.role === 'admin' && (
              <div className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5">
                 <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest">{editingFinance ? 'Edit Record' : 'Add Record'}</h4>
                    <button 
                      onClick={() => { setShowAddForm(!showAddForm); setEditingFinance(null); setFormData(defaultForm); }}
                      className="text-[10px] text-brand hover:underline font-bold uppercase tracking-widest"
                    >
                      {showAddForm ? '✕ Hide Form' : '+ Add New'}
                    </button>
                 </div>

                 {showAddForm && (
                   <form onSubmit={handleAction} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                         <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none">
                            <option value="income">Income (+)</option>
                            <option value="expense">Expense (-)</option>
                         </select>
                         <input type="number" placeholder="Amount" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none" required />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         <select value={formData.donorType} onChange={e => setFormData({...formData, donorType: e.target.value})} className="bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none">
                            <option value="member">Inside Member</option>
                            <option value="outside">Outside Source</option>
                            <option value="government">Government</option>
                         </select>
                         {formData.donorType === 'member' && formData.type === 'income' ? (
                            <select value={formData.memberId} onChange={e => setFormData({...formData, memberId: e.target.value})} className="bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none" required>
                               <option value="">Choose Member...</option>
                               {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                            </select>
                         ) : (
                            <input type="text" placeholder="Vendor / Name" value={formData.sourceOrVendor} onChange={e => setFormData({...formData, sourceOrVendor: e.target.value})} className="bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none" required />
                         )}
                      </div>

                      {formData.type === 'expense' && (
                         <div className="space-y-2">
                            <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-2">Digital Receipt / Bill</label>
                            <div className="flex gap-3">
                               <input type="text" placeholder="Bill URL (or upload)" value={formData.billImage} onChange={e => setFormData({...formData, billImage: e.target.value})} className="flex-grow bg-black border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white outline-none" />
                               <label className="shrink-0 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg px-4 py-2 cursor-pointer hover:bg-white/10 transition-all">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{uploading ? '...' : 'Upload'}</span>
                                  <input type="file" className="hidden" onChange={handleBillUpload} />
                               </label>
                            </div>
                         </div>
                      )}

                      <button type="submit" disabled={saving || uploading} className="w-full bg-brand text-black py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-brand-dark transition-all disabled:opacity-50">
                         {saving ? 'Saving...' : (editingFinance ? 'Save Changes' : 'Record Entry')}
                      </button>
                   </form>
                 )}
              </div>
            )}

            <div className="space-y-2">
               <h4 className="text-[10px] uppercase font-bold text-gray-600 mb-4 px-2">Transactions</h4>
               {finances.length === 0 ? (
                 <p className="text-center py-10 text-xs text-gray-700">No records found.</p>
               ) : (
                 <div className="divide-y divide-white/5 bg-zinc-900/20 rounded-xl overflow-hidden">
                    {finances.map(f => (
                      <div key={f._id} className="p-4 flex justify-between items-center group hover:bg-white/[0.02]">
                         <div className="flex gap-4 items-center">
                            <div className={`w-1 h-6 rounded-full ${f.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            <div>
                               <p className="text-sm font-bold text-gray-200">{f.memberId?.name || f.sourceOrVendor}</p>
                               <p className="text-[9px] text-gray-600 uppercase font-medium">{new Date(f.date).toLocaleDateString()} • {f.donorType || 'Direct'}</p>
                            </div>
                         </div>
                         <div className="text-right flex items-center gap-6">
                            {f.billImage && (
                               <a href={f.billImage} target="_blank" rel="noreferrer" title="View Bill" className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center group/bill hover:bg-brand/10 hover:border-brand/20 transition-all">
                                  <span className="text-xs group-hover/bill:scale-110 transition-transform">📄</span>
                               </a>
                            )}
                            <div>
                               <p className={`text-sm font-bold ${f.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                                  {f.type === 'income' ? '+' : '-'} {f.amount.toLocaleString()}
                               </p>
                            </div>
                            {user?.role === 'admin' && (
                               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => startEdit(f)} className="text-[10px] text-gray-500 hover:text-white uppercase font-bold">Edit</button>
                                  <button onClick={() => handleDelete(f._id)} className="text-[10px] text-red-900 hover:text-red-500 uppercase font-bold">Del</button>
                               </div>
                            )}
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
         </div>
       )}
    </Modal>
  );
}
