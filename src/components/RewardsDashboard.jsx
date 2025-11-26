import React, { useMemo, useState } from "react";
import { useRewardsData } from "../hooks/useRewardsData";
import { summarizeMonthlyRewards } from "../utils/summarizeMonthlyRewards";

function RewardsDashboard() {
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const { transactions, loading, error } = useRewardsData(selectedCustomerId);

  // derive unique customers from the loaded transactions
  const customers = useMemo(() => {
    const map = new Map();
    transactions.forEach((tx) => {
      if (!map.has(tx.customerId)) {
        map.set(tx.customerId, tx.customerName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  }, [transactions]);

  // choose a reference date based on the latest transaction in the data
  const referenceDate = useMemo(() => {
    if (!transactions.length) {
      return null;
    }

    const latestIsoDate = transactions.reduce((latest, tx) => {
      return tx.date > latest ? tx.date : latest;
    }, transactions[0].date);

    return new Date(latestIsoDate);
  }, [transactions]);

  // summarize monthly rewards using that reference date
  const monthlySummaries = useMemo(() => {
    if (!transactions.length) {
      return [];
    }

    const ref = referenceDate || new Date();
    return summarizeMonthlyRewards(transactions, ref);
  }, [transactions, referenceDate]);

  // compute total points per customer across the summarized months
  const customerTotals = useMemo(() => {
    const totalsByCustomer = new Map();

    monthlySummaries.forEach((summary) => {
      const existing = totalsByCustomer.get(summary.customerId);

      if (!existing) {
        totalsByCustomer.set(summary.customerId, {
          customerId: summary.customerId,
          customerName: summary.customerName,
          totalPoints: summary.points,
        });
      } else {
        existing.totalPoints += summary.points;
      }
    });

    return Array.from(totalsByCustomer.values());
  }, [monthlySummaries]);

  function handleCustomerChange(event) {
    const value = event.target.value;
    if (value === "") {
      setSelectedCustomerId(null);
    } else {
      setSelectedCustomerId(Number(value));
    }
  }

  return (
    <main>
      <h1>Customer Rewards</h1>

      <section style={{ marginBottom: "1rem" }}>
        <label htmlFor="customer-select">Customer</label>{" "}
        <select
          id="customer-select"
          value={selectedCustomerId ?? ""}
          onChange={handleCustomerChange}
        >
          <option value="">All customers</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </section>

      {loading && <p>Loading transactions</p>}

      {error && (
        <p role="alert">
          Something went wrong while loading transactions
        </p>
      )}

      {!loading && !error && !transactions.length && (
        <p>No transactions found</p>
      )}

      {!loading && !error && monthlySummaries.length > 0 && (
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
      )}

      {!loading && !error && customerTotals.length > 0 && (
        <section style={{ marginTop: "1.5rem" }}>
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
      )}
    </main>
  );
}

export default RewardsDashboard;

