import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { useRewardsData } from "./useRewardsData";
import {
  fetchAllTransactions,
  fetchTransactionsByCustomer,
} from "../data/api";

jest.mock("../data/api");

function TestComponent({ selectedCustomerId }) {
  const { transactions, loading, error } = useRewardsData(selectedCustomerId);

  return (
    <div>
      <div data-testid="loading">{loading ? "true" : "false"}</div>
      <div data-testid="error">{error ? "true" : "false"}</div>
      <div data-testid="count">{transactions.length}</div>
    </div>
  );
}

describe("useRewardsData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("loads all transactions when no customer id is selected", async () => {
    fetchAllTransactions.mockResolvedValue([
      { id: "t1", customerId: 1, customerName: "Alice", date: "2025-06-10", amount: 120 },
      { id: "t2", customerId: 2, customerName: "Bob", date: "2025-07-10", amount: 60 },
    ]);

    render(<TestComponent selectedCustomerId={null} />);

    expect(screen.getByTestId("loading").textContent).toBe("true");

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    expect(screen.getByTestId("count").textContent).toBe("2");
    expect(fetchAllTransactions).toHaveBeenCalledTimes(1);
    expect(fetchTransactionsByCustomer).not.toHaveBeenCalled();
    expect(screen.getByTestId("error").textContent).toBe("false");
  });

  test("loads transactions for a specific customer", async () => {
    fetchTransactionsByCustomer.mockResolvedValue([
      { id: "t3", customerId: 1, customerName: "Alice", date: "2025-08-01", amount: 130 },
    ]);

    render(<TestComponent selectedCustomerId={1} />);

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    expect(fetchTransactionsByCustomer).toHaveBeenCalledTimes(1);
    expect(fetchTransactionsByCustomer).toHaveBeenCalledWith(1);
    expect(screen.getByTestId("count").textContent).toBe("1");
    expect(screen.getByTestId("error").textContent).toBe("false");
  });

  test("sets error when the api call fails", async () => {
    fetchAllTransactions.mockRejectedValue(new Error("Network"));

    render(<TestComponent selectedCustomerId={null} />);

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    expect(screen.getByTestId("error").textContent).toBe("true");
    expect(fetchAllTransactions).toHaveBeenCalledTimes(1);
  });
});

