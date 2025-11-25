Problem statement
Build a React client that shows reward points per customer per month and total for the last three months of transactions.  Points are given as one point for each dollar between fifty and one hundred and two points for each dollar above one hundred.

Reward rules


Simulated endpoints
  - RewardsDashboard fetch data, hold state, wire everything

  - RewardsTable render monthly and total rewards for one customer

  - CustomerSelector dropdown or list for picking customer

  - rewardsCalculator pure functions to calculate points and monthly totals

Data model

Folder structure

Test strategy
  Pure function tests

    calculatePoints(amount) with boundary amounts 49, 50, 51, 100, 101, 120

    Aggregation function that converts transactions into monthly totals

  Component tests

    RewardsTable renders correct totals for given props

    RewardsDashboard shows loading state then table once fake API resolves

    Customer change updates displayed data


Naming and conventions note
  Rule: variable names describe contents, no single letters except trivial map args in very small scopes

  Example names: transactions, monthlyRewards, selectedCustomerId, pointsForTransaction

  No generic names like data, info, obj unless truly generic
