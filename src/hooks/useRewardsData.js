import { useEffect, useState } from "react";
import { fetchAllTransactions } from "../data/api";

export function useRewardsData() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchAllTransactions();
        if (!isCancelled) {
          setTransactions(data);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, []);

  return { transactions, loading, error };
}

