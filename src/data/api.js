import { mockTransactions } from "./mockTransactions";

const SIMULATED_DELAY_MS = 300;

export function fetchAllTransactions() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTransactions);
    }, SIMULATED_DELAY_MS);
  });
}

export function fetchTransactionsByCustomer(customerId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = mockTransactions.filter(
        (transaction) => transaction.customerId === customerId
      );
      resolve(filtered);
    }, SIMULATED_DELAY_MS);
  });
}

