import React from "react";

function MonthlyRewardsTable({ monthlySummaries, loading, error }) {
  if (loading || error || monthlySummaries.length === 0) {
    return null;
  }

  return (
    <section className="rewards-dashboard__monthly">
      <h2>Monthly reward points</h2>
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Month</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {monthlySummaries.map((summary) => (
            <tr key={`${summary.customerId}-${summary.month}`}>
              <td>{summary.customerName}</td>
              <td>{summary.month}</td>
              <td>{summary.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default MonthlyRewardsTable;

