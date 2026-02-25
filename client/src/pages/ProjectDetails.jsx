import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProjectById } from "../services/projects.api";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import TransactionRow from "../components/TransactionRow";

const COLORS = ["#10b981", "#ef4444"];

const statusClass = {
  planning: "status-planning",
  ongoing: "status-ongoing",
  completed: "status-completed",
};

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__name">{payload[0].name}</p>
      <p className="chart-tooltip__value">NPR {payload[0].value?.toLocaleString()}</p>
    </div>
  );
}

export default function ProjectDetails() {
  const { id } = useParams();
  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    fetchProjectById(id).then((data) => setProjectData(data));
  }, [id]);

  if (!projectData)
    return (
      <div className="loader-screen">
        <div className="loader-spinner" />
        <p className="loader-text">Loading Project</p>
      </div>
    );

  const { project, totalIncome, totalExpense, remainingBalance, transactions } = projectData;

  const pieData = [
    { name: "Income",  value: totalIncome },
    { name: "Expense", value: totalExpense },
  ];

  return (
    <div>
      {/* Header */}
      <div className="page-header-left">
        <div className="page-wrapper">
          <p className="section-eyebrow">◆ Project Details</p>
          <h1 className="page-title">{project.title}</h1>
          <p className="project-description">{project.description}</p>
          <div className="meta-tags">
            <span className={`status-badge ${statusClass[project.status] || "status-planning"}`}>
              <span className="dot" />
              {project.status}
            </span>
            <span className="budget-pill">
              Budget: NPR {project.estimatedBudget?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="page-wrapper">

        {/* Stat Cards */}
        <div className="stat-cards-grid fade-up">
          <div className="stat-card stat-card--income">
            <div className="stat-card__top">
              <p className="stat-card__label">Total Income</p>
              <span className="stat-card__icon">↑</span>
            </div>
            <p className="stat-card__value">NPR {totalIncome?.toLocaleString()}</p>
          </div>
          <div className="stat-card stat-card--expense">
            <div className="stat-card__top">
              <p className="stat-card__label">Total Expense</p>
              <span className="stat-card__icon">↓</span>
            </div>
            <p className="stat-card__value">NPR {totalExpense?.toLocaleString()}</p>
          </div>
          <div className="stat-card stat-card--balance">
            <div className="stat-card__top">
              <p className="stat-card__label">Remaining Balance</p>
              <span className="stat-card__icon">◈</span>
            </div>
            <p className="stat-card__value">NPR {remainingBalance?.toLocaleString()}</p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="chart-section fade-up">
          <p className="section-eyebrow">Income vs Expense</p>
          <PieChart width={280} height={260}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={40}
              paddingAngle={3}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ color: "#9ca3af", fontSize: "12px" }} />
          </PieChart>
        </div>

        {/* Transactions */}
        <div className="fade-up">
          <h2 className="section-title">
            Transactions
            <span className="tx-count">{transactions.length}</span>
          </h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {["Type", "Amount (NPR)", "Source / Vendor", "Description", "Date"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <TransactionRow key={t._id} transaction={t} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}