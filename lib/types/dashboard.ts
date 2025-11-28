export interface Overview {
  totalBalance: number;
  monthlyChange: number; // positive or negative
}

export type TransactionType = "income" | "expense";

export interface Transaction {
  _id?: string;
  date: string;
  company: string;
  amount: number | string; // negative = expense, positive = income
  transactionType: TransactionType;
}

export interface UpcomingCharge {
  _id?: string;
  date: string;
  company: string;
  amount: number | string; // negative number (-)
}
export interface Subscriptions {
  _id?: string;
  date: string;
  company: string;
  amount: number; // negative number (-)
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
  subscriptions: Subscriptions[];
  debts: Debt[];
  goals: Goal[];
  income: Income[];
}

// modal types
export type ModalType =
  | "transactions"
  | "upcomingCharges"
  | "settings"
  | "debts "
  | "savings"
  | "addTransaction"
  | "editTransaction"
  | "addUpcomingCharge"
  | "editUpcomingCharge"
  | "none";

// // for sending to API
// export type TransactionPayload = Omit<Transaction, "_id">;
// export type TransactionResponse = Required<Transaction>;
// // response includes _id, but request doesn't as _id is assigned by mongodb
export type UpcomingChargePayload = {
  date: string;
  company: string;
  amount: string | number;
};
