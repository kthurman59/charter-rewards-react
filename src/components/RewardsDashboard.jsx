import React, { useMemo, useState } from "react";
import { useRewardsData } from "../hooks/useRewardsData";
import { summarizeMonthlyRewards } from "../utils/summarizeMonthlyRewards";
import "../styles/rewardsDashboard.css";
import CustomerSelector from "./CustomerSelector";
import MonthlyRewardsTable from "./MonthlyRewardsTable";
import CustomerTotalsTable from "./CustomerTotalsTable";

function RewardsDashboard() {
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const { transactions, loading, error } = useRewardsData();

  // All customers from the full data set
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

  // Current view, optionally filtered by customer
  const filteredTransactions = useMemo(() => {
    if (selectedCustomerId == null) {
      return transactions;
    }
    return transactions.filter((tx) => tx.customerId === selectedCustomerId);
  }, [transactions, selectedCustomerId]);

  // Anchor three month window on latest visible transaction
  const referenceDate = useMemo(() => {
    if (!filteredTransactions.length) {
      return null;
    }

    const latestIsoDate = filteredTransactions.reduce((latest, tx) => {
      return tx.date > latest ? tx.date : latest;
    }, filteredTransactions[0].date);

    return new Date(latestIsoDate);
  }, [filteredTransactions]);

  const monthlySummaries = useMemo(() => {
    if (!filteredTransactions.length) {
      return [];
    }

    const ref = referenceDate || new Date();
    const summaries = summarizeMonthlyRewards(filteredTransactions, ref);

    // Sort by customer name, then by month
    summaries.sort((a, b) => {
      const nameCompare = a.customerName.localeCompare(b.customerName);
      if (nameCompare !== 0) {
        return nameCompare;
      }
      return a.month.localeCompare(b.month);
    });

    return summaries;
  }, [filteredTransactions, referenceDate]);

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

    const totalsArray = Array.from(totalsByCustomer.values());

    // Sort totals by customer name
    totalsArray.sort((a, b) =>
      a.customerName.localeCompare(b.customerName)
    );

    return totalsArray;
  }, [monthlySummaries]);

  function handleCustomerChange(event) {
    const value = event.target.value;
    if (value === "") {
      setSelectedCustomerId(null);
    } else {
      setSelectedCustomerId(Number(value));
    }
  }

  const hasNoTransactionsForView =
    !loading && !error && !filteredTransactions.length;

  const emptyMessage = selectedCustomerId
    ? "No transactions found for this customer"
    : "No transactions found";

  return (
    <main className="rewards-dashboard">
      <h1>Customer Rewards</h1>

      <CustomerSelector
        customers={customers}
        selectedCustomerId={selectedCustomerId}
        onChange={handleCustomerChange}
      />

      {loading && <p>Loading transactions</p>}

      {error && (
        <p role="alert">Something went wrong while loading transactions</p>
      )}

      {hasNoTransactionsForView && <p>{emptyMessage}</p>}

      <MonthlyRewardsTable
        monthlySummaries={monthlySummaries}
        loading={loading}
        error={error}
      />

      <CustomerTotalsTable
        customerTotals={customerTotals}
        loading={loading}
        error={error}
      />
    </main>
  );
}

export default RewardsDashboard;

