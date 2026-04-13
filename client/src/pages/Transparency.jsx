import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Transparency() {
  const { user } = useAuth();
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinances = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };
        const res = await axios.get("http://localhost:5500/api/finances", config);
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
      <div className="loader-screen">
        <div className="loader-spinner"></div>
        <div className="loader-text">Opening the Ledger...</div>
      </div>
    );
  }

  return (
    <div className="page-wrapper-wide fade-up">
      <header className="page-header mb-[50px] rounded-3xl border border-[#1a1a1a]">
        <div className="section-eyebrow">Internal Audit</div>
        <h1 className="page-title">Detailed Transparency</h1>
        <p className="page-subtitle my-[10px] mx-auto">
          Exclusive member view of all contributions and expenditures.
        </p>
      </header>

      <div className="section-title">
        Contribution Records
        <span className="tx-count">{finances.length} Entries</span>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Contributor / Source</th>
              <th>Category</th>
              <th>Purpose / Detail</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {finances.map((tx) => (
              <tr key={tx._id} className="tx-row">
                <td className="tx-date">{new Date(tx.date).toLocaleDateString()}</td>
                <td className="tx-source font-semibold text-[#f3f4f6]">
                  {tx.donorType === 'member' && tx.memberId ? tx.memberId.name : tx.sourceOrVendor}
                </td>
                <td>
                  <span className={`status-badge ${
                    tx.donorType === 'member' ? 'status-completed' : 
                    tx.donorType === 'outside' ? 'status-ongoing' : 'status-planning'
                  } text-[9px]`}>
                    <span className="dot"></span> {tx.donorType || 'Other'}
                  </span>
                </td>
                <td className="tx-desc">
                  {tx.projectId ? <span><strong className="text-[#d97706]">[{tx.projectId.title}]</strong> </span> : ""}
                  {tx.description}
                </td>
                <td className={tx.type === 'income' ? 'tx-amount--income' : 'tx-amount--expense'}>
                  {tx.type === 'income' ? '+' : '-'} Rs. {tx.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

