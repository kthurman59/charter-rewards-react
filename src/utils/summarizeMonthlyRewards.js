import { calculatePoints } from "./calculatePoints";

function getMonthKey(date) {
  const year = date.getFullYear();
  const monthNumber = date.getMonth() + 1; // Date months are zero-based
  const month = String(monthNumber).padStart(2, "0");
  return `${year}-${month}`; // e.g. "2025-06"
}

function isWithinLastNMonths(txDate, referenceDate, n) {
  const txYear = txDate.getFullYear();
  const txMonth = txDate.getMonth();
  const refYear = referenceDate.getFullYear();
  const refMonth = referenceDate.getMonth();

  const monthDifference = (refYear - txYear) * 12 + (refMonth - txMonth);

  // include this month (0), previous month (1), month before that (2) when n = 3
  return monthDifference >= 0 && monthDifference < n;
}

// Takes an array of transactions and an optional reference date
// Returns an array of monthly reward summaries per customer
export function summarizeMonthlyRewards(transactions, referenceDate = new Date()) {
  const summariesByKey = new Map();

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);

    if (!isWithinLastNMonths(transactionDate, referenceDate, 3)) {
      return;
    }

    const monthKey = getMonthKey(transactionDate);
    const mapKey = `${transaction.customerId}-${monthKey}`;
    const pointsForTransaction = calculatePoints(transaction.amount);

    if (!summariesByKey.has(mapKey)) {
      summariesByKey.set(mapKey, {
        customerId: transaction.customerId,
        customerName: transaction.customerName,
        month: monthKey,
        points: 0,
      });
    }

    const summary = summariesByKey.get(mapKey);
    summary.points += pointsForTransaction;
  });

  return Array.from(summariesByKey.values());
}

