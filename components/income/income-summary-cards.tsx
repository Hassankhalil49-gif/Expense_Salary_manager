import {
  ArrowUpRight,
  Clock,
  RefreshCw,
  Wallet,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, getCurrentMonthLabel } from "@/lib/format/currency";
import type { IncomeSummary } from "@/lib/income/types";
import { cn } from "@/lib/utils";

interface IncomeSummaryCardsProps {
  summary: IncomeSummary;
}

const cards = [
  {
    key: "total" as const,
    title: "Total Income",
    icon: Wallet,
    iconClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-500/10",
    getValue: (summary: IncomeSummary) => formatCurrency(summary.totalIncome),
    getSubtext: () => getCurrentMonthLabel(),
  },
  {
    key: "received" as const,
    title: "Received",
    icon: ArrowUpRight,
    iconClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-500/10",
    getValue: (summary: IncomeSummary) => formatCurrency(summary.receivedIncome),
    getSubtext: () => "Confirmed this month",
  },
  {
    key: "pending" as const,
    title: "Pending",
    icon: Clock,
    iconClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-500/10",
    getValue: (summary: IncomeSummary) => formatCurrency(summary.pendingIncome),
    getSubtext: () => "Awaiting payment",
  },
  {
    key: "salary" as const,
    title: "Monthly Salary",
    icon: RefreshCw,
    iconClass: "text-violet-600 dark:text-violet-400",
    bgClass: "bg-violet-500/10",
    getValue: (summary: IncomeSummary) => formatCurrency(summary.monthlySalary),
    getSubtext: () => "Recurring salary total",
  },
];

export function IncomeSummaryCards({ summary }: IncomeSummaryCardsProps) {
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
              {card.getSubtext()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
