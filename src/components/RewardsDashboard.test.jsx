import { render, screen, within } from "@testing-library/react";
import RewardsDashboard from "./RewardsDashboard";
import { useRewardsData } from "../hooks/useRewardsData";

jest.mock("../hooks/useRewardsData");

const mockedUseRewardsData = useRewardsData;

beforeEach(() => {
  jest.clearAllMocks();
});

const sampleTransactions = [
  // Alice: June and July
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
    date: "2025-07-10",
    amount: 60, // 10 points
  },
  // Bob: August
  {
    id: "t3",
    customerId: 2,
    customerName: "Bob",
    date: "2025-08-01",
    amount: 130, // 110 points
  },
];

describe("RewardsDashboard", () => {
  test("renders monthly and total rewards for loaded transactions", () => {
    mockedUseRewardsData.mockReturnValue({
      transactions: sampleTransactions,
      loading: false,
      error: null,
    });

    render(<RewardsDashboard />);

    // heading
    expect(
      screen.getByRole("heading", { name: /customer rewards/i })
    ).toBeInTheDocument();

    // monthly table rows
    const juneRow = screen.getByText("2025-06").closest("tr");
    expect(juneRow).toHaveTextContent("Alice");
    expect(juneRow).toHaveTextContent("90");

    const julyRow = screen.getByText("2025-07").closest("tr");
    expect(julyRow).toHaveTextContent("Alice");
    expect(julyRow).toHaveTextContent("10");

    const augustRow = screen.getByText("2025-08").closest("tr");
    expect(augustRow).toHaveTextContent("Bob");
    expect(augustRow).toHaveTextContent("110");

    // totals table heading
    const totalsHeading = screen.getByRole("heading", {
      name: /customer total points/i,
    });
    expect(totalsHeading).toBeInTheDocument();

    const totalsSection = totalsHeading.closest("section");
    const totalsTable = within(totalsSection).getByRole("table");

    // totals rows
    const aliceTotalRow = within(totalsTable).getByText("Alice").closest("tr");
    expect(aliceTotalRow).toHaveTextContent("100");

    const bobTotalRow = within(totalsTable).getByText("Bob").closest("tr");
    expect(bobTotalRow).toHaveTextContent("110");
  });

  test("shows loading state when hook reports loading", () => {
    mockedUseRewardsData.mockReturnValue({
      transactions: [],
      loading: true,
      error: null,
    });

    render(<RewardsDashboard />);

    expect(
      screen.getByText(/loading transactions/i)
    ).toBeInTheDocument();
  });

  test("shows error state when hook reports error", () => {
    mockedUseRewardsData.mockReturnValue({
      transactions: [],
      loading: false,
      error: new Error("Network"),
    });

    render(<RewardsDashboard />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(
      /something went wrong while loading transactions/i
    );
  });
});

