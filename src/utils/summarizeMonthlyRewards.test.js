import { summarizeMonthlyRewards } from "./summarizeMonthlyRewards";

describe("summarizeMonthlyRewards", () => {
  test("aggregates points per customer per month for the last three months", () => {
    const referenceDate = new Date("2025-08-15T00:00:00Z");

    const transactions = [
      // Alice in June, two transactions
      {
        id: "t1",
        customerId: 1,
        customerName: "Alice",
        date: "2025-06-10",
        amount: 120, // 90 points
      },
      {
        id: "t2",
        customerId: 1,
        customerName: "Alice",
        date: "2025-06-15",
        amount: 60, // 10 points
      },
      // Alice in July
      {
        id: "t3",
        customerId: 1,
        customerName: "Alice",
        date: "2025-07-01",
        amount: 200, // 250 points
      },
      // Alice in May, should be ignored (older than three months)
      {
        id: "t4",
        customerId: 1,
        customerName: "Alice",
        date: "2025-05-30",
        amount: 120,
      },
      // Bob in August
      {
        id: "t5",
        customerId: 2,
        customerName: "Bob",
        date: "2025-08-05",
        amount: 101, // 52 points
      },
      // Bob many months ago, should be ignored
      {
        id: "t6",
        customerId: 2,
        customerName: "Bob",
        date: "2024-12-01",
        amount: 300,
      },
    ];

    const result = summarizeMonthlyRewards(transactions, referenceDate);

    // Turn the result into a lookup for easier assertions
    const byKey = Object.fromEntries(
      result.map((summary) => [`${summary.customerId}-${summary.month}`, summary])
    );

    // We expect three summaries:
    // Alice June, Alice July, Bob August
    expect(Object.keys(byKey)).toHaveLength(3);

    // Alice June 2025 06: 120 gives 90 points, 60 gives 10 points, total 100
    expect(byKey["1-2025-06"]).toBeDefined();
    expect(byKey["1-2025-06"].points).toBe(100);
    expect(byKey["1-2025-06"].customerName).toBe("Alice");

    // Alice July 2025 07: single 200 amount gives 250 points
    expect(byKey["1-2025-07"]).toBeDefined();
    expect(byKey["1-2025-07"].points).toBe(250);

    // Bob August 2025 08: 101 gives 52 points
    expect(byKey["2-2025-08"]).toBeDefined();
    expect(byKey["2-2025-08"].points).toBe(52);
    expect(byKey["2-2025-08"].customerName).toBe("Bob");

    // No summary for May or older months
    expect(byKey["1-2025-05"]).toBeUndefined();
  });

  test("returns an empty array when no transactions are in the last three months", () => {
    const referenceDate = new Date("2025-08-15T00:00:00Z");

    const oldTransactions = [
      {
        id: "old1",
        customerId: 1,
        customerName: "Alice",
        date: "2025-01-10",
        amount: 200,
      },
      {
        id: "old2",
        customerId: 2,
        customerName: "Bob",
        date: "2024-12-01",
        amount: 300,
      },
    ];

    const result = summarizeMonthlyRewards(oldTransactions, referenceDate);

    expect(result).toEqual([]);
  });
});

