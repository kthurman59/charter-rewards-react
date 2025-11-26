import React from "react";

function CustomerTotalsTable({ customerTotals, loading, error }) {
  if (loading || error || customerTotals.length === 0) {
    return null;
  }

  return (
    <section className="rewards-dashboard__totals">
      <h2>Customer total points</h2>
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Total points</th>
          </tr>
        </thead>
        <tbody>
          {customerTotals.map((total) => (
            <tr key={total.customerId}>
              <td>{total.customerName}</td>
              <td>{total.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default CustomerTotalsTable;

