export const TEMPLATES = {
  transactions: [
    ["date", "company", "amount", "transactionType", "category", "account"],
    ["2024-01-25", "Starbucks", "5.50", "expense", "other", "cash"],
  ],
  upcomingCharges: [
    ["date", "company", "amount", "category", "recurring", "repeating"],
    ["2024-02-01", "Netflix", "15.99", "subscription", "true", "Monthly"],
  ],
  debts: [
    ["company", "currentPaid", "totalAmount", "dueDate"],
    ["Chase Visa", "500.00", "2000.00", "2024-06-01"],
  ],
  goals: [
    ["title", "targetDate", "currentAmount", "targetAmount"],
    ["Europe Trip", "2024-08-15", "2000.00", "5000.00"],
  ],
};

export type TemplateEntity = keyof typeof TEMPLATES;
