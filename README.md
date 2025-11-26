# Customer Rewards React Assessment

Customer rewards calculator built with React.  
It simulates async API calls, applies the Charter reward rules to three months of transactions, and shows monthly and total reward points per customer.

---

## Requirements checklist

* Use React JS for the UI and do not use TypeScript  
  Implementation  The app is created with Create React App and uses plain JavaScript files under `src`. There are no TypeScript files or TypeScript dependencies.

* Simulate asynchronous API calls to fetch data  
  Implementation  `src/data/api.js` exports functions that return Promises and resolve mock transaction data after a short timeout to simulate network latency.

* Make up a data set that clearly demonstrates the solution  
  Implementation  `src/data/mockTransactions.js` defines multiple customers with transactions across several months, including amounts around the reward rule boundaries.

* Given all transactions in a three month period compute reward points for each customer per month and total  
  Implementation  
  * `src/utils/calculatePoints.js` implements the per transaction reward rule.  
  * `src/utils/summarizeMonthlyRewards.js` groups transactions by customer and month, applies the three month window, and returns monthly point totals.  
  * `src/components/RewardsDashboard.jsx` and its child components render a monthly breakdown table and a per customer totals table.

* Include unit tests that are clear and easy to understand  
  Implementation  Jest and React Testing Library tests live in `src/utils/*.test.js`, `src/data/api.test.js`, `src/App.test.js`, and `src/components/RewardsDashboard.test.jsx`. They cover the reward rule, three month aggregation, mock API behavior, and the main UI states.

---

## Running the app

Prerequisites  Node and npm installed.

Install dependencies

```bash
npm install

