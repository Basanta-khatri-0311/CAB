import { useState, useEffect } from "react";
import API from "../api/axios";
import Modal from "./ui/Modal";

export default function ProjectFinancialModal({ isOpen, onClose, project, user }) {
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && project && user) {
      const fetchFinances = async () => {
        try {
          const res = await API.get(`/finances/${project._id}`);
          setFinances(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
      };
      fetchFinances();
    }
  }, [isOpen, project, user]);

  if (!project) return null;

  const totalIncome = finances.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0);
  const totalExpense = finances.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${project.title} - Financial Audit`}>
       {!user ? (
         <p style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>Please login as a member to view detailed financial audits.</p>
       ) : loading ? (
         <div style={{ textAlign: "center", padding: "20px" }}><div className="loader-spinner"></div></div>
       ) : (
         <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
               <div className="stat-card stat-card--income" style={{ padding: "15px" }}>
                  <p className="stat-card__label">Project Income</p>
                  <p className="stat-card__value" style={{ fontSize: "18px" }}>NPR {totalIncome.toLocaleString()}</p>
               </div>
               <div className="stat-card stat-card--expense" style={{ padding: "15px" }}>
                  <p className="stat-card__label">Project Expense</p>
                  <p className="stat-card__value" style={{ fontSize: "18px" }}>NPR {totalExpense.toLocaleString()}</p>
               </div>
            </div>

            <div className="table-wrapper">
               <table>
                  <thead>
                     <tr><th>Source/Vendor</th><th>Amount</th><th>Type</th></tr>
                  </thead>
                  <tbody>
                     {finances.length === 0 ? (
                       <tr><td colSpan="3" style={{ textAlign: "center", padding: "15px", color: "#4b5563" }}>No transactions recorded yet.</td></tr>
                     ) : (
                       finances.map(f => (
                         <tr key={f._id} className="tx-row">
                            <td className="tx-desc">{f.sourceOrVendor}</td>
                            <td className={f.type === 'income' ? 'tx-amount--income' : 'tx-amount--expense'}>
                               NPR {f.amount.toLocaleString()}
                            </td>
                            <td>
                               <span className={f.type === 'income' ? 'tx-type-badge--income' : 'tx-type-badge--expense'}>
                                  {f.type}
                               </span>
                            </td>
                         </tr>
                       ))
                     )}
                  </tbody>
               </table>
            </div>

            <div style={{ marginTop: "20px", textAlign: "right", color: "#6b7280", fontSize: "12px" }}>
               Remaining balance for this project: <span style={{ color: "#d97706", fontWeight: "700" }}>NPR {(totalIncome - totalExpense).toLocaleString()}</span>
            </div>
         </div>
       )}
    </Modal>
  );
}
