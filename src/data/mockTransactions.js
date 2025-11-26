// Shape:
// {
//    id: string,
//    customerId: number,
//    customerName: string,
//    date: string,   // ISO date "YYYY-MM-DD"
//    amount: number // dollars, may include cents
// }

export const mockTransactions = [
  // Alice, three months of activity
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
  {
    id: "t3",
    customerId: 1,
    customerName: "Alice",
    date: "2025-07-01",
    amount: 200, // 250 points
  },
  {
    id: "t4",
    customerId: 1,
    customerName: "Alice",
    date: "2025-08-05",
    amount: 75, // 25 points
  },

  // Bob, smaller set
    {
    id: "t5",
    customerId: 2,
    customerName: "Bob",
    date: "2025-06-20",
    amount: 51, // 1 point
  },
  {
    id: "t6",
    customerId: 2,
    customerName: "Bob",
    date: "2025-07-18",
    amount: 99, // 49 points
  },
  {
    id: "t7",
    customerId: 2,
    customerName: "Bob",
    date: "2025-08-02",
    amount: 130, // 110 points
  },

  // Carol, one month with several transactions
  {
    id: "t8",
    customerId: 3,
    customerName: "Carol",
    date: "2025-08-10",
    amount: 40, // 0 points
  },
  {
    id: "t9",
    customerId: 3,
    customerName: "Carol",
    date: "2025-08-11",
    amount: 100, // 50 points
  },
  {
    id: "t10",
    customerId: 3,
    customerName: "Carol",
    date: "2025-08-12",
    amount: 220, // 290 points
  },

  // One old transaction to prove three month filtering works if used
  {
    id: "t11",
    customerId: 1,
    customerName: "Alice",
    date: "2025-01-01",
    amount: 500,
  },
];
