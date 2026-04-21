import { useEffect, useState } from "react";
import API from "../../api/axios";
import Modal from "../../components/ui/Modal";
import MemberForm from "../../components/Admin/MemberForm";
import { useToast } from "../../context/ToastContext";
import { useConfirm } from "../../context/ConfirmContext";
import { HiPencil, HiTrash, HiCheck, HiXMark } from "react-icons/hi2";

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const { showToast } = useToast();
  const confirm = useConfirm();

  const fetchMembers = async () => {
    try {
      const res = await API.get("/users");
      setMembers(res.data || []);
    } catch (err) {
      setError("Failed to fetch members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleStatusChange = async (member, newStatus) => {
    confirm({
      title: "Update Member Status",
      message: `Are you sure you want to set ${member.name}'s account to ${newStatus}?`,
      onConfirm: async () => {
        try {
          await API.put(`/users/${member._id}`, { status: newStatus });
          showToast(`Member status updated to ${newStatus}`, "success");
          fetchMembers();
        } catch (err) {
          showToast("Status update failed.", "error");
        }
      }
    });
  };


  const handleEdit = (member) => {
    setEditingMember(member);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    confirm({
      title: "Purge Record",
      message: "Are you sure you want to remove this member permanently? This action is irreversible.",
      onConfirm: async () => {
        try {
          await API.delete(`/users/${id}`);
          showToast("Member record purged", "success");
          fetchMembers();
        } catch (err) {
          showToast("Error deleting member.", "error");
        }
      }
    });
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingMember) {
        await API.put(`/users/${editingMember._id}`, formData);
      } else {
        await API.post("/users", formData);
      }
      setIsOpen(false);
      showToast(editingMember ? "Record updated" : "Member registered", "success");
      fetchMembers();
    } catch (err) {
      showToast("Failed to save changes.", "error");
    }
  };

  const toggleAdmin = async (member) => {
    const newRole = member.role === "admin" ? "user" : "admin";
    confirm({
      title: "Change System Role",
      message: `Are you sure you want to change ${member.name}'s role to ${newRole}?`,
      onConfirm: async () => {
        try {
          await API.put(`/users/${member._id}`, { role: newRole });
          showToast(`Role updated to ${newRole}`, "success");
          fetchMembers();
        } catch (err) {
          showToast("Error updating role.", "error");
        }
      }
    });
  };


  return (
    <div className="bg-black min-h-screen text-gray-200 pb-20">
      <div className="py-16 px-6 bg-zinc-900/10 border-b border-white/5 mb-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="max-w-2xl">
            <span className="section-eyebrow tracking-[0.2em]">Council Management</span>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 decoration-brand underline underline-offset-8 decoration-4">Roster & Access</h1>
            <p className="text-gray-500 text-xs max-w-lg leading-relaxed">
              Verify new registrations, manage club roles, and audit system-wide permissions.
            </p>
          </div>
          
          <button 
            onClick={() => { setEditingMember(null); setIsOpen(true); }}
            className="bg-brand hover:bg-brand-dark text-black font-black uppercase tracking-widest px-8 py-3 rounded-xl text-xs transition-all shadow-xl shadow-brand/20 active:scale-95"
          >
            + Register New Member
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Decrypting Roster...</p>
          </div>
        ) : (
          <div className="bg-zinc-900/50 border border-white/5 rounded-[3rem] overflow-hidden shadow-3xl backdrop-blur-sm">
            <table className="w-full text-left font-sans">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Identity</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Access Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Club Role</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Draft Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {members.map((member) => (
                  <tr key={member._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-black border-2 border-white/5 overflow-hidden flex-shrink-0 shadow-2xl">
                          {member.photo ? (
                            <img loading="lazy" src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-brand text-xl font-black">{member.name.charAt(0)}</div>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-black text-xl tracking-tight group-hover:text-brand transition-colors">{member.name}</p>
                          <p className="text-[10px] text-gray-600 font-bold mt-1 uppercase tracking-widest">{member.email}</p>
                        </div>
                        {member.role === 'admin' && <span className="text-[8px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded uppercase font-black tracking-widest">Root Admin</span>}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                       {member.status === 'pending' ? (
                          <div className="flex gap-2">
                             <button onClick={() => handleStatusChange(member, 'active')} className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-black border border-emerald-500/30 font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest transition-all flex items-center gap-2">
                                <HiCheck size={14} /> Approve
                             </button>
                             <button onClick={() => handleStatusChange(member, 'rejected')} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest transition-all flex items-center gap-2">
                                <HiXMark size={14} /> Reject
                             </button>
                          </div>
                       ) : (
                          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                             member.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
                          }`}>
                             <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                             {member.status}
                          </span>
                       )}
                    </td>
                    <td className="px-10 py-8">
                       <p className="text-white font-bold text-xs tracking-tight">{(Array.isArray(member.roleInClub) ? member.roleInClub : [member.roleInClub || 'Player']).join(' • ')}</p>
                    </td>
                    <td className="px-10 py-8 text-right underline underline-offset-4 decoration-white/5">
                      <div className="flex justify-end gap-4">
                        <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xs hover:bg-brand hover:text-black transition-all shadow-xl" onClick={() => handleEdit(member)} title="Edit Configuration"><HiPencil size={18} /></button>
                        <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xs hover:bg-red-500 transition-all shadow-xl" onClick={() => handleDelete(member._id)} title="Purge Record"><HiTrash size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editingMember ? "Modify Member Access" : "Provision Member"} wide={true}>
          <MemberForm initialData={editingMember} onSubmit={handleSubmit} onClose={() => setIsOpen(false)} />
        </Modal>
      </div>
    </div>
  );
}
