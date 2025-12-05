export interface Overview {
  totalBalance: number;
  monthlyChange: number; // positive or negative
}
export interface EditOverview {
  totalBalance: number;
}

export type TransactionType = "income" | "expense";
export type ExpenseCategory =
  | "Subscription"
  | "Bill"
  | "Loan"
  | "Insurance"
  | "Tax"
  | "Other";
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
  currentPaid: number;
  totalAmount: number;
  dueDate: string;
}

export interface Goal {
  _id: string;
  title: string;
  targetDate: string;
  currentAmount: number;
  targetAmount: number;
}

export interface Income {
  _id: string;
  company: string;
  amount: number;
}

// for the whole dashboard

export interface DashboardData {
  overview: Overview;
  transactions: Transaction[];
  upcomingCharges: UpcomingCharge[];
  debts: Debt[];
  goals: Goal[];
  income: Income[];
}

// modal types
export type ModalType =
  | "transactions"
  | "upcomingCharges"
  | "settings"
  | "debts"
  | "savings"
  | "addTransaction"
  | "editTransaction"
  | "editOverview"
  | "addUpcomingCharge"
  | "editUpcomingCharge"
  | "none";
