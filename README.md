# Customer Rewards React Assessment

Customer rewards calculator built with React.

It simulates async API calls, applies Charter style reward rules to three months of transactions, and shows monthly and total reward points per customer.

***

## Requirements checklist

* Use React JS for the UI and do not use TypeScript  
  Implementation The app is created with Create React App and uses plain JavaScript files under `src`. There are no TypeScript files or TypeScript dependencies.

* Simulate asynchronous API calls to fetch data  
  Implementation `src/data/api.js` exports functions that return Promises and resolve mock transaction data after a short timeout to simulate network latency.

* Make up a data set that clearly demonstrates the solution  
  Implementation `src/data/mockTransactions.js` defines multiple customers with transactions across several months, including amounts around the reward rule boundaries.

* Given all transactions in a three month period compute reward points for each customer per month and total  
  Implementation  
  * `src/utils/calculatePoints.js` implements the per transaction reward rule. It uses whole dollar amounts and matches the example in the prompt.  
  * `src/utils/summarizeMonthlyRewards.js` groups transactions by customer and month, applies a three month window anchored on the latest visible transaction, and returns monthly point totals.  
  * `src/hooks/useRewardsData.js` loads all transactions once from the simulated API and exposes them with loading and error state.  
  * `src/components/RewardsDashboard.jsx` and its child components render a customer selector, a monthly breakdown table, and a per customer totals table. The selector filters in memory so the dropdown always lists every customer.

* Include unit tests that are clear and easy to understand  
  Implementation Jest and React Testing Library tests live in:
  * `src/utils/*.test.js`  
  * `src/hooks/useRewardsData.test.js`  
  * `src/App.test.js`  
  * `src/components/RewardsDashboard.test.jsx`  

  They cover the reward rule, three month aggregation, async data loading, and the main UI states.

***

## Architecture overview

* Data layer  
  * `src/data/mockTransactions.js` holds the in memory transaction data.  
  * `src/data/api.js` simulates async fetches of that data.

* Business logic  
  * `src/utils/calculatePoints.js` calculates reward points for a single transaction.  
  * `src/utils/summarizeMonthlyRewards.js` aggregates points per customer per month within the last three months relative to a reference date.

* Hooks  
  * `src/hooks/useRewardsData.js` is a custom hook that loads all transactions on mount and returns `{ transactions, loading, error }`.

* UI components  
  * `src/components/RewardsDashboard.jsx` is the main screen that wires everything together.  
  * `src/components/CustomerSelector.jsx` renders the customer dropdown.  
  * `src/components/MonthlyRewardsTable.jsx` renders monthly reward points per customer.  
  * `src/components/CustomerTotalsTable.jsx` renders total points per customer across the three month window.

***

## Running the app

Prerequisites Node and npm installed.

Install dependencies

```bash
npm install
