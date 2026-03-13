import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Modal from "../../components/ui/Modal";

const defaultForm = {
  projectId: "",
  type: "income",
  amount: "",
  sourceOrVendor: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
};

export default function FinancesPage() {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(defaultForm);

  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:5500/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (err) { console.error("Failed to fetch projects", err); }
  };

  const fetchFinances = async () => {
    try {
      const res = await fetch("http://localhost:5500/api/finances");
      const data = await res.json();
      setFinances(data);
    } catch (err) { console.error("Failed to fetch finances", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); fetchFinances(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const closeModal = () => { setIsOpen(false); setFormData(defaultForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("http://localhost:5500/api/finances", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify(formData),
      });
      closeModal();
      fetchFinances();
    } catch (err) { console.error("Failed to save", err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    await fetch("http://localhost:5500/api/finances/" + id, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });
    fetchFinances();
  };

  const totalIncome = finances.filter((f) => f.type === "income").reduce((s, f) => s + (f.amount || 0), 0);
  const totalExpense = finances.filter((f) => f.type === "expense").reduce((s, f) => s + (f.amount || 0), 0);
  const balance = totalIncome - totalExpense;
  return (
    <div>
      <div className="page-header-left">
        <div className="page-wrapper">
          <p className="section-eyebrow">◆ Admin Panel</p>
          <h1 className="page-title">Manage Finances</h1>
          <p className="project-description">Record and review income and expense transactions across all projects.</p>
        </div>
      </div>


      <div className="page-wrapper">
        <div className="finances-summary fade-up">
          <div className="stat-card stat-card--income">
            <div className="stat-card__top">
              <p className="stat-card__label">Total Income</p>
              <span className="stat-card__icon">&#8593;</span>
            </div>
            <p className="stat-card__value">NPR {totalIncome.toLocaleString()}</p>
          </div>

          
          <div className="stat-card stat-card--expense">
            <div className="stat-card__top">
              <p className="stat-card__label">Total Expenses</p>
              <span className="stat-card__icon">&#8595;</span>
            </div>
            <p className="stat-card__value">NPR {totalExpense.toLocaleString()}</p>
          </div>
          <div className="stat-card stat-card--balance">
            <div className="stat-card__top">
              <p className="stat-card__label">Balance</p>
              <span className="stat-card__icon">&#9672;</span>
            </div>
            <p className="stat-card__value">NPR {balance.toLocaleString()}</p>
          </div>
        </div>

        <div className="admin-page-header fade-up">
          <p style={{ color: "#4b5563", fontSize: "13px" }}>
            {finances.length} transaction{finances.length !== 1 ? "s" : ""} total
          </p>
          <button className="admin-add-btn" onClick={() => setIsOpen(true)}>+ Add Transaction</button>
        </div>

        {loading ? (
          <div className="loader-screen" style={{ minHeight: "240px" }}>
            <div className="loader-spinner" />
            <p className="loader-text">Loading transactions</p>
          </div>
        ) : (
          <div className="admin-table-wrapper fade-up">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Type</th>
                  <th>Amount (NPR)</th>
                  <th>Source / Vendor</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {finances.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="admin-table__empty">No transactions yet. Add one to get started.</td>
                  </tr>
                ) : (
                  finances.map((f) => (
                    <tr key={f._id}>
                      <td className="admin-table__name">{f.projectId?.title ?? "—"}</td>
                      <td>
                        <span className={"tx-type-badge " + (f.type === "income" ? "tx-type-badge--income" : "tx-type-badge--expense")}>
                          {f.type === "income" ? "↑" : "↓"} {f.type}
                        </span>
                      </td>
                      <td className={f.type === "income" ? "tx-amount--income" : "tx-amount--expense"}>
                        {f.type === "income" ? "+" : "−"} {f.amount?.toLocaleString()}
                      </td>
                      <td className="tx-source">{f.sourceOrVendor ?? "—"}</td>
                      <td className="tx-desc">{f.description ?? "—"}</td>
                      <td className="tx-date">
                        {f.date ? new Date(f.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                      </td>
                      <td>
                        <div className="admin-table__actions">
                          <button className="admin-btn-delete" onClick={() => handleDelete(f._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <Modal isOpen={isOpen} onClose={closeModal} title="Add Transaction">
          <form onSubmit={handleSubmit}>

            <div className="form-field">
              <label className="form-label">Project</label>
              <select name="projectId" value={formData.projectId} onChange={handleChange} className="form-select" required>
                <option value="">Select a project...</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="form-select">
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Amount (NPR)</label>
              <input type="number" name="amount" placeholder="e.g. 25000" value={formData.amount} onChange={handleChange} className="form-input" min="0" required />
            </div>

            <div className="form-field">
              <label className="form-label">Source / Vendor</label>
              <input type="text" name="sourceOrVendor" placeholder="e.g. Government Grant" value={formData.sourceOrVendor} onChange={handleChange} className="form-input" />
            </div>

            <div className="form-field">
              <label className="form-label">Description</label>
              <textarea name="description" placeholder="Brief note about this transaction..." value={formData.description} onChange={handleChange} className="form-textarea" />
            </div>

            <div className="form-field">
              <label className="form-label">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-input" />
            </div>

            <div className="form-actions">
              <button type="button" className="form-btn-cancel" onClick={closeModal}>Cancel</button>
              <button type="submit" className="form-btn-save" disabled={saving}>{saving ? "Saving..." : "Save Transaction"}</button>
            </div>

          </form>
        </Modal>
      </div>
    </div>
  );
}