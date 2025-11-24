// Customer data
{
  "customerId": 1,
  "customerName": "Alice",
  "monthlyRewards": [
	{ "month": "2025-06", "points": 120 },
	{ "month": "2025-07", "points": 90 },
	{ "month": "2025-08", "points": 45 }
  ],
  "total points": 255
}

// Transaction
{
  id: string,
  customerId: number,
  customerName: string,
  date: string,   // ISO date
  amount: number  // dollars, may include cents
}

// Customer per month
{
  customerId: number,
  customerName: string,
  month: string,  // "2025-06"
  points: number
}
