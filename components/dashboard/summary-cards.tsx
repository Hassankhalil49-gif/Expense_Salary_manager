import {
  ArrowDownRight,
  ArrowUpRight,
  PiggyBank,
  Wallet,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/format/currency";
import type { DashboardSummary } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

interface SummaryCardsProps {
  summary: DashboardSummary;
}

const cards = [
  {
    key: "income" as const,
    title: "Total Income",
    icon: ArrowUpRight,
    iconClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-500/10",
    getValue: (summary: DashboardSummary) => formatCurrency(summary.totalIncome),
    getSubtext: () => "This month",
  },
  {
    key: "expenses" as const,
    title: "Total Expenses",
    icon: ArrowDownRight,
    iconClass: "text-rose-600 dark:text-rose-400",
    bgClass: "bg-rose-500/10",
    getValue: (summary: DashboardSummary) =>
      formatCurrency(summary.totalExpenses),
    getSubtext: () => "This month",
  },
  {
    key: "balance" as const,
    title: "Remaining Balance",
    icon: Wallet,
    iconClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-500/10",
    getValue: (summary: DashboardSummary) => formatCurrency(summary.balance),
    getSubtext: () => "Income − Expenses",
  },
  {
    key: "savings" as const,
    title: "Savings",
    icon: PiggyBank,
    iconClass: "text-violet-600 dark:text-violet-400",
    bgClass: "bg-violet-500/10",
    getValue: (summary: DashboardSummary) => formatCurrency(summary.savings),
    getSubtext: (summary: DashboardSummary) =>
      `${formatPercent(summary.savingsRate)} savings rate`,
  },
];

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.key}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                card.bgClass
              )}
            >
              <card.icon className={cn("h-4 w-4", card.iconClass)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.getValue(summary)}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {card.getSubtext(summary)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
