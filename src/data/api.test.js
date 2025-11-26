import { fetchAllTransactions, fetchTransactionsByCustomer } from "./api";
import { mockTransactions } from "./mockTransactions";

describe("mock API", () => {
  test("fetchAllTransactions returns all mock transactions", async () => {
    const result = await fetchAllTransactions();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(mockTransactions.length);
    // simple sanity check that ids match
    const resultIds = result.map((tx) => tx.id).sort();
    const mockIds = mockTransactions.map((tx) => tx.id).sort();
    expect(resultIds).toEqual(mockIds);
  });

  test("fetchTransactionsByCustomer filters by customer id", async () => {
    const customerId = 2;
    const result = await fetchTransactionsByCustomer(customerId);

    expect(result.length).toBeGreaterThan(0);
    result.forEach((tx) => {
      expect(tx.customerId).toBe(customerId);
    });

    // make sure it is a subset of the full mock set
    const allForCustomer = mockTransactions.filter(
      (tx) => tx.customerId === customerId
    );
    expect(result.length).toBe(allForCustomer.length);
  });

  test("fetchTransactionsByCustomer returns empty array for unknown customer", async () => {
    const result = await fetchTransactionsByCustomer(9999);
    expect(result).toEqual([]);
  });
});

