export interface Overview {
  totalBalance: number;
  monthlyChange: number; // positive or negative
}

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  date: string;
  company: string;
  amount: number; // negative = expense, positive = income
  type: TransactionType;
}

export interface UpcomingCharge {
  id: string;
  date: string;
  company: string;
  amount: number; // negative number (-)
}
export interface Subscriptions {
  id: string;
  date: string;
  company: string;
  amount: number; // negative number (-)
}

export interface Debt {
  id: string;
  company: string;
  currentPaid: number;
  totalAmount: number;
  dueDate: string;
}

export interface Goal {
  id: string;
  title: string;
  targetDate: string;
  currentAmount: number;
  targetAmount: number;
}

// for the whole dashboard

export interface DashboardData {
  overview: Overview;
  transactions: Transaction[];
  upcomingCharges: UpcomingCharge[];
  subscriptions: Subscriptions[];
  debts: Debt[];
  goals: Goal[];
}

// modal types
export type ModalType =
  | "transactions"
  | "upcomingCharges"
  | "settings"
  | "debts "
  | "savings"
  | "none";
