import type { DashboardSummary } from "@/lib/dashboard/types";

export function calculateSummary(
  totalIncome: number,
  totalExpenses: number
): DashboardSummary {
  const balance = totalIncome - totalExpenses;
  const savings = balance;
  const savingsRate =
    totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

  return {
    totalIncome,
    totalExpenses,
    balance,
    savings,
    savingsRate,
  };
}

export function getEmptySummary(): DashboardSummary {
  return calculateSummary(0, 0);
}
