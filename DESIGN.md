# Customer Rewards React App - Design Document

## 1. Problem Statement

A retailer awards reward points to customers based on each purchase.

### Point Rule

Customer receives:

1. Zero points for the first fifty dollars in a transaction
2. One point for every dollar between fifty-one and one hundred
3. Two points for every dollar above one hundred

### Example

A transaction of one hundred twenty dollars:

1. Fifty dollars at zero points
2. Fifty dollars at one point each gives fifty points
3. Twenty dollars above one hundred at two points each gives forty points

**Total: ninety points**

### Goal

Given all transactions during a three-month period, compute:

1. Reward points per customer per month
2. Total reward points per customer across that period

### Requirements

The solution must:

1. Use React without TypeScript
2. Simulate asynchronous API calls
3. Use a realistic mock data set
4. Be easy for another developer to read and extend
5. Include meaningful tests

---

## 2. Data Model

### Transaction

Each transaction in `src/data/mockTransactions.js` has this shape:

```js
{
  id: string,
  customerId: number,
  customerName: string,
  date: string,     // "YYYY-MM-DD"
  amount: number    // dollars, may include cents
}
```

### Design Decisions

- **`customerId` and `customerName`** are both stored to make grouping simple and to avoid extra lookups
- **`date`** is stored as an ISO string and converted to a `Date` where needed
- **`amount`** may contain cents but the reward rule always floors to whole dollars

---

## 3. Architecture Overview

The app is split into four main layers:

1. Data and mock API
2. Core reward logic
3. Data fetching hook
4. UI components

### 3.1 Data and Mock API

- `src/data/mockTransactions.js` holds all test transactions
- `src/data/api.js` provides async functions that simulate fetching data

### 3.2 Core Reward Logic

- `src/utils/calculatePoints.js` applies the point rule for a single transaction
- `src/utils/summarizeMonthlyRewards.js` groups transactions into monthly summaries for the last three months

### 3.3 Data Fetching Hook

- `src/hooks/useRewardsData.js` is a custom hook that hides data fetching, loading, and error handling behind a simple interface

### 3.4 UI Components

- `src/components/RewardsDashboard.jsx` is the main container for the rewards view
- `src/components/CustomerSelector.jsx` renders the dropdown for customers
- `src/components/MonthlyRewardsTable.jsx` renders the monthly breakdown table
- `src/components/CustomerTotalsTable.jsx` renders total points per customer
- `src/styles/rewardsDashboard.css` contains all styles used by the dashboard

This structure keeps business logic and data flow separated from presentation and matches the client review notes about component-based design.

---

## 4. Core Reward Logic

### 4.1 Single Transaction Rule

**File:** `src/utils/calculatePoints.js`

#### Responsibilities

- Accept a numeric amount
- Floor it to whole dollars
- Apply the point rule
- Return an integer number of points

#### Key Decisions

- Floor using built-in `Math.floor` so all decimal inputs are handled consistently
- Use a single source of truth for the rule so all other code calls this function rather than reimplementing the math

This function is **pure**:

- No side effects
- Given the same input it always returns the same output

This makes it simple to unit test.

### 4.2 Monthly Aggregation and Three-Month Window

**File:** `src/utils/summarizeMonthlyRewards.js`

#### Responsibilities

- Filter transactions to a three-month period
- Group by customer and calendar month
- Use `calculatePoints` to compute points for each transaction
- Produce a summary per customer per month

#### Signature

```js
summarizeMonthlyRewards(transactions, referenceDate)
```

Where:

- `transactions` is an array of transaction objects
- `referenceDate` is an optional `Date`. If not provided, the caller supplies a computed value

#### Implementation Details

**Month Key:**

- A helper turns a `Date` into `"YYYY-MM"` so month grouping is stable and readable

**Three-Month Filter:**

- Compute the difference in calendar months between the transaction date and the reference date
- Keep transactions where the month difference is zero, one, or two
- This represents the current month and the two previous months

**Grouping:**

- Use a `Map` keyed by `customerId-monthKey`
- For each transaction within the window:
  - Compute `pointsForTransaction` using `calculatePoints`
  - Add those points into the appropriate entry in the `Map`

**Output:**

Convert the `Map` to an array of objects:

```js
{
  customerId,
  customerName,
  month,   // "YYYY-MM"
  points   // total points for that customer in that month
}
```

This function is also pure and does not depend on React.

---

## 5. Data and Mock API Layer

### 5.1 Mock Data

**File:** `src/data/mockTransactions.js`

#### Design Goals

- Multiple customers so the UI can show both filter and aggregate behavior
- Transactions across several months so the three-month window logic has something real to work with
- Amounts that hit rule edges such as fifty, fifty-one, one hundred, one hundred one

This makes both manual checks and automated tests straightforward.

### 5.2 Async Simulation

**File:** `src/data/api.js`

#### Functions

**`fetchAllTransactions()`**

- Returns a `Promise` that resolves to the full transaction array after a small delay

**`fetchTransactionsByCustomer(customerId)`**

- Returns a `Promise` that resolves to only the transactions with that `customerId`

The delay is implemented with a timer so that the UI can show a real loading state. This simulates calls like `GET /transactions` and `GET /transactions?customerId=` without adding actual network calls or a backend.

---

## 6. Data Fetching Hook

**File:** `src/hooks/useRewardsData.js`

### Responsibilities

- Decide which mock API function to call based on `selectedCustomerId`
- Expose three pieces of state for the UI:
  - `transactions`
  - `loading`
  - `error`
- Handle async lifecycle and cancellation

### Flow

- On mount and whenever `selectedCustomerId` changes, the effect runs
- Set `loading` true and reset `error` to `null`
- Choose the API:
  - No customer selected: call `fetchAllTransactions`
  - Customer selected: call `fetchTransactionsByCustomer` with that id
- On success (if the effect has not been cancelled):
  - Set the `transactions` array
  - Set `loading` to false
- On failure (if not cancelled):
  - Set `error` to the error object
  - Set `loading` to false
- On cleanup: mark the effect as cancelled so late responses do not update state

### Design Rationale

- `RewardsDashboard` does not know anything about API details—it just uses the hook result
- The hook can be tested in isolation by mocking the API module

---

## 7. UI Components

### 7.1 Rewards Dashboard Container

**File:** `src/components/RewardsDashboard.jsx`

#### Responsibilities

- Hold the selected customer state
- Call `useRewardsData` to fetch transactions
- Derive:
  - Unique customers for the selector
  - A reference date based on the latest transaction date
  - Monthly summaries via `summarizeMonthlyRewards`
  - Customer totals grouped across months
- Render:
  - Page heading
  - Customer selector
  - Loading, error, and empty states
  - Monthly breakdown table
  - Total points table

#### Reference Date Logic

- When transactions are loaded, pick the maximum date value in the list
- Convert that string to a `Date`
- Use that as the `referenceDate` passed to `summarizeMonthlyRewards`

**Reason:** This makes the three-month window tied to the data set itself, not to the current clock on the machine. The mock data can be adjusted without breaking the logic.

#### Totals Logic

- Start from the monthly summaries
- Build a `Map` keyed by `customerId`
- For each summary, add points into the total for that customer
- Output an array of:

```js
{
  customerId,
  customerName,
  totalPoints
}
```

### 7.2 Customer Selector

**File:** `src/components/CustomerSelector.jsx`

Simple presentational component that:

- Renders a label and select element
- Shows an "All customers" option and then one option per customer
- Raises `onChange` with the event

### 7.3 Monthly Rewards Table

**File:** `src/components/MonthlyRewardsTable.jsx`

Presentational component that:

- Accepts `monthlySummaries`, `loading`, and `error`
- Returns `null` if there is nothing to display
- Renders a table with columns:
  - Customer
  - Month
  - Points

Each row corresponds to a `{ customerId, month }` pair.

### 7.4 Customer Totals Table

**File:** `src/components/CustomerTotalsTable.jsx`

Presentational component that:

- Accepts `customerTotals`, `loading`, and `error`
- Returns `null` if there is nothing to display
- Renders a section with heading "Customer total points" and a table with:
  - Customer
  - Total points

Each row corresponds to one customer for the three-month window.

---

## 8. Styling

**File:** `src/styles/rewardsDashboard.css`

All UI styling for the dashboard lives in this file.

It defines:

- Root layout for the dashboard
- Spacing for the control section and totals section
- Basic table styling for borders, padding, and alignment

The component files just use class names and do not embed layout rules.

---

## 9. Testing Approach

Testing is designed around clear boundaries.

### Reward Logic

- `calculatePoints.test.js` covers the single transaction rule with boundary and decimal cases
- `summarizeMonthlyRewards.test.js` covers grouping, three-month filtering, and ignoring old months

### Mock API

- `api.test.js` confirms that the mock functions return all data, filter by customer, and handle unknown ids

### Data Hook

- `useRewardsData.test.js` mocks the API and checks:
  - Loading state and count when no customer is selected
  - Behavior when a customer id is passed
  - Error state when the API rejects

### UI

- `App.test.js` is a simple smoke test for the root app
- `RewardsDashboard.test.jsx` mocks the hook and checks:
  - The main heading
  - Monthly table content for an example data set
  - Customer totals table content
  - Loading message
  - Accessible error message with role `alert`

### Summary

This combination means:

- Pure logic can evolve safely with tests guarding it
- The main user-facing screen is covered in its important states
- The tests together directly address the client feedback about missing or unclear tests

---

## 10. Possible Future Improvements

If the app needed to grow, likely next steps would be:

- Add sorting or paging for large transaction sets
- Parameterize the point rule so it can change without code changes
- Add a simple routing structure if more screens appear
- Replace the mock API layer with real HTTP calls while keeping the rest of the structure intact

For the current assessment scope, the existing design keeps the code small, clear, and testable while matching the stated requirements.
