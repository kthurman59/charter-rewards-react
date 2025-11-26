import { useEffect, useState } from "react";
import {
  fetchAllTransactions,
  fetchTransactionsByCustomer,
} from "../data/api";

export function useRewardsData(selectedCustomerId) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = selectedCustomerId
          ? await fetchTransactionsByCustomer(selectedCustomerId)
          : await fetchAllTransactions();

        if (!isCancelled) {
          setTransactions(data);
          setLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err);
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, [selectedCustomerId]);

  return { transactions, loading, error };
}

