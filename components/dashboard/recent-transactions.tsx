import { ArrowDownLeft, ArrowUpRight, Receipt } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatTransactionDate } from "@/lib/format/currency";
import type { DashboardTransaction } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

interface RecentTransactionsProps {
  transactions: DashboardTransaction[];
  hasData: boolean;
}

export function RecentTransactions({
  transactions,
  hasData,
}: RecentTransactionsProps) {
  const hasTransactions = hasData && transactions.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest income and expense activity</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasTransactions ? (
          <EmptyState
            icon={Receipt}
            title="No transactions yet"
            description="Your recent income and expense entries will show up here once you start tracking."
          />
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const isIncome = transaction.type === "income";

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between gap-4 rounded-lg border p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                        isIncome
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      )}
                    >
                      {isIncome ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {transaction.description}
                      </p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="text-[10px]">
                          {transaction.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTransactionDate(transaction.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p
                    className={cn(
                      "shrink-0 text-sm font-semibold tabular-nums",
                      isIncome
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    )}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
