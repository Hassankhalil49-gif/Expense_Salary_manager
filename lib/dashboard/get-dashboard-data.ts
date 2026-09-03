import { calculateSummary } from "@/lib/dashboard/calculations";
import type { DashboardData } from "@/lib/dashboard/types";
import {
  getCurrentMonthTotalIncome,
  getRecentIncomeTransactions,
} from "@/lib/income/queries";

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const [totalIncome, recentTransactions] = await Promise.all([
    getCurrentMonthTotalIncome(userId),
    getRecentIncomeTransactions(userId),
  ]);

  const totalExpenses = 0;
  const summary = calculateSummary(totalIncome, totalExpenses);
  const hasData = totalIncome > 0 || recentTransactions.length > 0;

  const now = new Date();
  const monthLabel = now.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return {
    summary,
    monthlyComparison: hasData
      ? [{ month: monthLabel, income: totalIncome, expenses: totalExpenses }]
      : [],
    expenseCategories: [],
    savingsTrend: hasData
      ? [
          {
            month: monthLabel,
            savings: summary.savings,
            savingsRate: summary.savingsRate,
          },
        ]
      : [],
    recentTransactions,
    hasData,
  };
}
