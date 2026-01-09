export interface Overview {
  totalBalance: number;
  monthlyChange: number; // positive or negative
}
export interface EditOverview {
  totalBalance: number;
  accounts: Account[];
}

export const currencies = {
  EUR: { symbol: "€", label: "Euro" },
  USD: { symbol: "$", label: "US Dollar" },
  GBP: { symbol: "£", label: "British Pound" },
} as const;
export type CurrencyCode = keyof typeof currencies;

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
  | "subscription"
  | "bill"
  | "loan"
  | "insurance"
  | "tax"
  | "other";

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
  account: AccountType;
}

export interface UpcomingCharge {
  _id?: string;
  date: string;
  company: string;
  amount: number | string; // negative number (-)
  category: ExpenseCategory;
  recurring?: boolean; // may use it later, for a recurring charge
  parentRecurringId?: string; // a reference to recurringcharge _id when generated
  repeating?: RepeatingUpcomingCharge; // optional copy of the rule
}

export interface RecurringCharge {
  _id?: string;
  startDate: string; // when the recurrence starts (first occurrence)
  company: string;
  amount: number;
  category: ExpenseCategory;
  repeating: RepeatingUpcomingCharge;
  interval?: number; // e.g., every 1 month, every 2 weeks (default 1)
  endDate?: string; // optional ISO date to stop creating occurrences
  count?: number; // optional number of total occurrences
  lastGenerated?: string; // ISO date of last-generated instance
  userId?: string;
  createdAt?: string;
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
  date: string;
}

export interface IncomeSummary {
  // no need for _id because this is not stored in mongodb, not queried, not updated, not referenced, not uniquely identifiable
  // it is computed from other data, exists only in memory, only for this response, only as a calculation result, there's nothing to identify
  thisMonth: number;
  lastMonth: number;
  difference: number;
}

// for the whole dashboard

export interface DashboardData {
  overview: Overview;
  accounts: Account[]; // will hold all of user's accounts
  transactions: Transaction[];
  upcomingCharges: UpcomingCharge[];
  debts: Debt[];
  goals: Goal[];
  // income: Income[];
  incomeSummary: IncomeSummary;
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
  | "editSettings"
  | "editOverview"
  | "goals"
  | "addGoal"
  | "editGoal"
  | "debts"
  | "addDebt"
  | "editDebt"
  | "contact"
  | "importExport"
  | "none";

export type MonthlySpending = {
  name: string;
  Spending: number;
};
