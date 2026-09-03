"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/format/currency";
import type { ExpenseCategoryPoint } from "@/lib/dashboard/types";

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

interface ExpenseCategoriesChartProps {
  data: ExpenseCategoryPoint[];
  hasData: boolean;
}

export function ExpenseCategoriesChart({
  data,
  hasData,
}: ExpenseCategoriesChartProps) {
  const hasCategories =
    hasData && data.length > 0 && data.some((item) => item.amount > 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Expense Categories</CardTitle>
        <CardDescription>Where your spending goes this month</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasCategories ? (
          <EmptyState
            icon={PieChartIcon}
            title="No expense categories yet"
            description="Once you log expenses, you'll see a breakdown by category here."
          />
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={2}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={entry.category}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    color: "hsl(var(--popover-foreground))",
                  }}
                  formatter={(value) => formatCurrency(Number(value ?? 0))}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
              {data.map((item, index) => (
                <div
                  key={item.category}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        CHART_COLORS[index % CHART_COLORS.length],
                    }}
                  />
                  {item.category}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
