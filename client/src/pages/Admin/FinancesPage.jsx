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
      // Prepare data
      const data = { ...formData };
      if (data.donorType === 'member') data.projectId = undefined;
      if (data.donorType === 'outside') { data.projectId = undefined; data.memberId = undefined; }
      if (data.donorType === 'project') data.memberId = undefined;

      await API.post("/finances", data);
      closeModal();
      fetchData();
    } catch (err) { console.error("Failed to save", err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await API.delete(`/finances/${id}`);
      fetchData();
    } catch (err) { console.error("Delete failed", err); }
  };

  const totalIncome = finances.filter(f => f.type === "income").reduce((s, f) => s + (f.amount || 0), 0);
  const totalExpense = finances.filter(f => f.type === "expense").reduce((s, f) => s + (f.amount || 0), 0);

  return (
    <div className="page-wrapper fade-up">
      <header className="page-header mb-10">
        <div className="section-eyebrow">Finance Control</div>
        <h1 className="page-title">Ledger Management</h1>
        <div className="flex gap-5 mt-5">
          <div className="status-badge status-completed">Income: NPR {totalIncome.toLocaleString()}</div>
          <div className="status-badge status-ongoing">Expenses: NPR {totalExpense.toLocaleString()}</div>
        </div>
      </header>

      <div className="admin-page-header">
        <h2 className="section-title">Collections Hub</h2>
        <button className="admin-add-btn" onClick={() => setIsOpen(true)}>+ Entry</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px] mt-[30px]">
        {/* General Collections */}
        <div className="project-card bg-[#050505]">
          <h3 className="section-title">General Fund</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Amt</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {finances.filter(f => !f.projectId).map(f => (
                  <tr key={f._id} className="tx-row">
                    <td className="tx-source">{f.memberId?.name || f.sourceOrVendor}</td>
                    {f.type === 'income' ? <td className="text-[#10b981]">{f.amount}</td> : <td className="text-[#ef4444]">{f.amount}</td>}
                    <td>{f.donorType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Project Specific Cards */}
        <div className="flex flex-col gap-5">
          {projects.map(p => {
            const projectTX = finances.filter(f => f.projectId?._id === p._id);
            if (projectTX.length === 0) return null;
            return (
              <div key={p._id} className="project-card cricket-card">
                <h3 className="project-card__title">{p.title}</h3>
                <div className="text-[12px] text-[#6b7280] mb-[10px]">Project Specific Audit</div>
                <div className="table-wrapper">
                  <table className="bg-transparent">
                    <tbody>
                      {projectTX.map(tx => (
                        <tr key={tx._id} className="border-b border-[#111]">
                          <td className="py-2 text-[12px]">{tx.sourceOrVendor}</td>
                          <td className="text-right text-[#d97706]">NPR {tx.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} title="Record Transaction">
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Collection Type</label>
            <select name="donorType" value={formData.donorType} onChange={handleChange} className="form-select">
              <option value="member">Inside Member</option>
              <option value="outside">Outside Member / Source</option>
              <option value="project">Specific Project Funding</option>
            </select>
          </div>

          {formData.donorType === 'member' && (
            <div className="form-field">
              <label className="form-label">Select Member</label>
              <select name="memberId" value={formData.memberId} onChange={handleChange} className="form-select" required>
                <option value="">Choose member...</option>
                {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
            </div>
          )}

          {formData.donorType === 'project' && (
            <div className="form-field">
              <label className="form-label">Target Project</label>
              <select name="projectId" value={formData.projectId} onChange={handleChange} className="form-select" required>
                <option value="">Choose project...</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
              </select>
            </div>
          )}

          <div className="form-field">
            <label className="form-label">Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="form-select">
              <option value="income">Income (Collection)</option>
              <option value="expense">Expense (Payout)</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">Amount (NPR)</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="form-input" required />
          </div>
          <div className="form-field">
            <label className="form-label">Source / Vendor Name</label>
            <input type="text" name="sourceOrVendor" value={formData.sourceOrVendor} onChange={handleChange} className="form-input" placeholder={formData.donorType === 'outside' ? "Full Name of Donor" : "e.g. Grass Maintenance"} />
          </div>
          <div className="form-field">
            <label className="form-label">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="form-textarea" />
          </div>
          <div className="form-actions">
            <button type="button" className="form-btn-cancel" onClick={closeModal}>Cancel</button>
            <button type="submit" className="form-btn-save" disabled={saving}>{saving ? "Recording..." : "Save Record"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}