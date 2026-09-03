import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ExpenseCategoriesChart } from "@/components/dashboard/charts/expense-categories-chart";
import { IncomeVsExpensesChart } from "@/components/dashboard/charts/income-vs-expenses-chart";
import { SavingsTrendChart } from "@/components/dashboard/charts/savings-trend-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import type { DashboardData, DashboardUser } from "@/lib/dashboard/types";

interface DashboardViewProps {
  user: DashboardUser;
  data: DashboardData;
}

export function DashboardView({ user, data }: DashboardViewProps) {
  return (
    <>
      <DashboardHeader user={user} />

      <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <SummaryCards summary={data.summary} />

        <div className="grid gap-6 lg:grid-cols-2">
          <IncomeVsExpensesChart
            data={data.monthlyComparison}
            hasData={data.hasData}
          />
          <ExpenseCategoriesChart
            data={data.expenseCategories}
            hasData={data.hasData}
          />
        </div>

        <SavingsTrendChart data={data.savingsTrend} hasData={data.hasData} />

        <RecentTransactions
          transactions={data.recentTransactions}
          hasData={data.hasData}
        />
      </div>
    </>
  );
}
