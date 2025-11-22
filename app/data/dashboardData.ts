// data/dashboardData.ts

export const dashboardData = {
  overview: {
    totalBalance: 7532,
    monthlyChange: 324, // positive or negative
  },

  transactions: [
    {
      id: "tx1",
      date: "2025-11-20",
      company: "Spotify",
      amount: -9.99,
      type: "expense",
    },
    {
      id: "tx2",
      date: "2025-11-19",
      company: "Salary - Acme Corp",
      amount: 3200,
      type: "income",
    },
    {
      id: "tx3",
      date: "2025-11-18",
      company: "Starbucks",
      amount: -4.5,
      type: "expense",
    },
    {
      id: "tx4",
      date: "2025-11-17",
      company: "Freelance Project",
      amount: 460,
      type: "income",
    },
  ],

  upcomingCharges: [
    {
      id: "uc1",
      date: "2025-12-01",
      company: "Rent",
      amount: -620,
    },
    {
      id: "uc2",
      date: "2025-12-03",
      company: "Netflix",
      amount: -10.99,
    },
    {
      id: "uc3",
      date: "2025-12-05",
      company: "Internet Provider",
      amount: -27.0,
    },
  ],

  debts: [
    {
      id: "db1",
      company: "Student Loan",
      currentPaid: 1200,
      totalAmount: 5500,
      dueDate: "2026-08-01",
    },
    {
      id: "db2",
      company: "Credit Card",
      currentPaid: 400,
      totalAmount: 2400,
      dueDate: "2025-12-15",
    },
  ],

  goals: [
    {
      id: "gl1",
      title: "Summer Vacation",
      targetDate: "2026-07-01",
      currentAmount: 850,
      targetAmount: 1500,
    },
    {
      id: "gl2",
      title: "New Laptop",
      targetDate: "2025-04-15",
      currentAmount: 600,
      targetAmount: 1200,
    },
  ],
};
