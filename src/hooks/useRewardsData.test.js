import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { useRewardsData } from "./useRewardsData";

// Mock the API module
jest.mock("../data/api", () => ({
  fetchAllTransactions: jest.fn(),
}));

// Pull the mock out so we can control it in tests
const { fetchAllTransactions } = require("../data/api");

function TestComponent() {
  const { transactions, loading, error } = useRewardsData();

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
    fetchAllTransactions.mockReset();
  });

  test("loads all transactions on mount", async () => {
    fetchAllTransactions.mockResolvedValue([
      { id: "t1" },
      { id: "t2" },
      { id: "t3" },
    ]);

    render(<TestComponent />);

    // initial state
    expect(screen.getByTestId("loading").textContent).toBe("true");
    expect(screen.getByTestId("error").textContent).toBe("false");
    expect(screen.getByTestId("count").textContent).toBe("0");

    // after load finishes
    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    expect(screen.getByTestId("error").textContent).toBe("false");
    expect(screen.getByTestId("count").textContent).toBe("3");
    expect(fetchAllTransactions).toHaveBeenCalledTimes(1);
  });

  test("sets error when loading fails and leaves transactions empty", async () => {
    fetchAllTransactions.mockRejectedValue(new Error("Network error"));

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    expect(screen.getByTestId("error").textContent).toBe("true");
    expect(screen.getByTestId("count").textContent).toBe("0");
    expect(fetchAllTransactions).toHaveBeenCalledTimes(1);
  });
});

