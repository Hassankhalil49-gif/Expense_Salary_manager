"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3 } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/format/currency";
import type { MonthlyComparisonPoint } from "@/lib/dashboard/types";

interface IncomeVsExpensesChartProps {
  data: MonthlyComparisonPoint[];
  hasData: boolean;
}

export function IncomeVsExpensesChart({
  data,
  hasData,
}: IncomeVsExpensesChartProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
        <CardDescription>Monthly comparison of inflows and outflows</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData || data.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            title="No comparison data yet"
            description="Add income and expenses to see how your cash flow compares month over month."
          />
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) =>
                    value >= 1000 ? `$${value / 1000}k` : `$${value}`
                  }
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    color: "hsl(var(--popover-foreground))",
                  }}
                  formatter={(value) => formatCurrency(Number(value ?? 0))}
                />
                <Legend />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="hsl(var(--chart-2))"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="hsl(var(--chart-1))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
