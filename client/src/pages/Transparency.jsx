import { useState, useEffect } from "react";
import axios from "axios";

export default function Transparency() {
  const [finances, setFinances] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [finRes, statsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/public/finances"),
          axios.get("http://localhost:5000/api/public/stats"),
        ]);
        setFinances(finRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error("Error fetching transparency data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loader-screen">
        <div className="loader-spinner"></div>
        <div className="loader-text">Loading Records...</div>
      </div>
    );
  }

  return (
    <div className="page-wrapper-wide fade-up">
      <header className="page-header" style={{ marginBottom: "40px", borderRadius: "20px" }}>
        <div className="section-eyebrow">Board Treasury</div>
        <h1 className="page-title">Financial Audit</h1>
        <p className="page-subtitle" style={{ margin: "0 auto" }}>
          Full accountability of the Cricket Association of Bhairahawa funds.
        </p>
      </header>

      {stats && (
        <div className="stat-cards-grid">
          <div className="stat-card stat-card--income cricket-card">
            <div className="stat-card__label">Total Fund Accumulation</div>
            <div className="stat-card__value">NPR {stats.totalIncome.toLocaleString()}</div>
          </div>
          <div className="stat-card stat-card--expense cricket-card">
            <div className="stat-card__label">Infrastructure & Events</div>
            <div className="stat-card__value">NPR {stats.totalExpense.toLocaleString()}</div>
          </div>
          <div className="stat-card stat-card--balance cricket-card">
            <div className="stat-card__label">Available Reserves</div>
            <div className="stat-card__value">NPR {stats.remainingBalance.toLocaleString()}</div>
          </div>
        </div>
      )}

      <div className="pitch-divider"></div>

      <div className="section-title">
        Audit Ledger
        <span className="tx-count">{finances.length}</span>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Source / Vendor</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {finances.map((tx) => (
              <tr key={tx._id} className="tx-row">
                <td className="tx-date">{new Date(tx.date).toLocaleDateString()}</td>
                <td>
                  <span className={`tx-type-badge ${tx.type === 'income' ? 'tx-type-badge--income' : 'tx-type-badge--expense'}`}>
                    {tx.type}
                  </span>
                </td>
                <td className="tx-source">{tx.sourceOrVendor}</td>
                <td className="tx-desc">{tx.description}</td>
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
