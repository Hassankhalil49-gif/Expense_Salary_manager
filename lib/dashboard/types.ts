export type TransactionType = "income" | "expense";

export interface DashboardTransaction {
  id: string;
  type: TransactionType;
  description: string;
  category: string;
  amount: number;
  date: string;
}

export interface MonthlyComparisonPoint {
  month: string;
  income: number;
  expenses: number;
}

export interface ExpenseCategoryPoint {
  category: string;
  amount: number;
}

export interface SavingsTrendPoint {
  month: string;
  savings: number;
  savingsRate: number;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savings: number;
  savingsRate: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  monthlyComparison: MonthlyComparisonPoint[];
  expenseCategories: ExpenseCategoryPoint[];
  savingsTrend: SavingsTrendPoint[];
  recentTransactions: DashboardTransaction[];
  hasData: boolean;
}

export interface DashboardUser {
  name: string;
  email: string;
  image?: string | null;
}
