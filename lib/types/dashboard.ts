export interface Overview {
  totalBalance: number;
  monthlyChange: number; // positive or negative
}
export interface EditOverview {
  totalBalance: number;
  accounts: Account[];
}

export type AccountType = "checking" | "savings" | "credit" | "cash";
export interface Account {
  _id?: string;
  userId?: string;
  type: AccountType;
  balance: number;
  createdAt?: string;
}

export type TransactionType = "income" | "expense";
export type ExpenseCategory =
  | "Subscription"
  | "Bill"
  | "Loan"
  | "Insurance"
  | "Tax"
  | "Other";

export type RepeatingUpcomingCharge =
  | "noRepeat"
  | "Weekly"
  | "BiWeekly"
  | "Monthly"
  | "Yearly";
export interface Transaction {
  _id?: string;
  date: string;
  company: string;
  amount: number | string; // negative = expense, positive = income
  transactionType: TransactionType;
  category: ExpenseCategory;
}

export interface UpcomingCharge {
  _id?: string;
  date: string;
  company: string;
  amount: number | string; // negative number (-)
  category: ExpenseCategory;
  recurring?: boolean; // may use it later, for a recurring charge
}

export interface Debt {
  _id?: string;
  company: string;
  currentPaid: number | string;
  totalAmount: number | string;
  dueDate: string;
}

export interface Goal {
  _id?: string;
  title: string;
  targetDate: string;
  currentAmount: number | string;
  targetAmount: number | string;
}

export interface Income {
  _id: string;
  company: string;
  amount: number | string;
}

// for the whole dashboard

export interface DashboardData {
  overview: Overview;
  accounts: Account[]; // will hold all of user's accounts
  transactions: Transaction[];
  upcomingCharges: UpcomingCharge[];
  debts: Debt[];
  goals: Goal[];
  income: Income[];
}

// modal types
export type ModalType =
  | "transactions"
  | "addTransaction"
  | "editTransaction"
  | "upcomingCharges"
  | "addUpcomingCharge"
  | "editUpcomingCharge"
  | "settings"
  | "editOverview"
  | "goals"
  | "addGoal"
  | "editGoal"
  | "debts"
  | "addDebt"
  | "editDebt"
  | "none";

export type MonthlySpending = {
  name: string;
  Spending: number;
};
