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
         <p className="text-center p-5 text-gray-500">Please login as a member to view detailed financial audits.</p>
       ) : loading ? (
         <div className="text-center p-5"><div className="loader-spinner"></div></div>
       ) : (
         <div>
            <div className="grid grid-cols-2 gap-2.5 mb-5">
               <div className="stat-card stat-card--income p-[15px]">
                  <p className="stat-card__label">Project Income</p>
                  <p className="stat-card__value text-lg">NPR {totalIncome.toLocaleString()}</p>
               </div>
               <div className="stat-card stat-card--expense p-[15px]">
                  <p className="stat-card__label">Project Expense</p>
                  <p className="stat-card__value text-lg">NPR {totalExpense.toLocaleString()}</p>
               </div>
            </div>

            <div className="table-wrapper">
               <table>
                  <thead>
                     <tr><th>Source/Vendor</th><th>Amount</th><th>Type</th></tr>
                  </thead>
                  <tbody>
                     {finances.length === 0 ? (
                       <tr><td colSpan="3" className="text-center p-[15px] text-gray-600">No transactions recorded yet.</td></tr>
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

            <div className="mt-5 text-right text-gray-500 text-xs">
               Remaining balance for this project: <span className="text-[#d97706] font-bold">NPR {(totalIncome - totalExpense).toLocaleString()}</span>
            </div>
         </div>
       )}
    </Modal>
  );
}
