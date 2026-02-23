export default function TransactionRow({ transaction }) {
  const isIncome = transaction.type === "income";

  return (
    <tr className="tx-row">
      <td>
        <span className={`tx-type-badge ${isIncome ? "tx-type-badge--income" : "tx-type-badge--expense"}`}>
          {isIncome ? "↑" : "↓"} {transaction.type}
        </span>
      </td>
      <td className={isIncome ? "tx-amount--income" : "tx-amount--expense"}>
        {isIncome ? "+" : "−"} NPR {transaction.amount?.toLocaleString()}
      </td>
      <td className="tx-source">{transaction.sourceOrVendor}</td>
      <td className="tx-desc">{transaction.description}</td>
      <td className="tx-date">
        {new Date(transaction.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </td>
    </tr>
  );
}