import React from "react";

function MonthlyRewardsTable({ monthlySummaries, loading, error }) {
  if (loading || error || monthlySummaries.length === 0) {
    return null;
  }

  return (
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
  );
}

export default MonthlyRewardsTable;

