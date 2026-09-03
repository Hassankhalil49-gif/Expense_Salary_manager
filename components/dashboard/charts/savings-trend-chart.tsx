"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/format/currency";
import type { SavingsTrendPoint } from "@/lib/dashboard/types";

interface SavingsTrendChartProps {
  data: SavingsTrendPoint[];
  hasData: boolean;
}

export function SavingsTrendChart({ data, hasData }: SavingsTrendChartProps) {
  const hasTrend =
    hasData && data.length > 0 && data.some((item) => item.savings !== 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Savings Trend</CardTitle>
        <CardDescription>Track your savings over time</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasTrend ? (
          <EmptyState
            icon={TrendingUp}
            title="No savings trend yet"
            description="Your monthly savings trend will appear here after you add financial records."
          />
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
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
                  formatter={(value, name) => {
                    const numericValue = Number(value ?? 0);
                    if (name === "savingsRate") {
                      return formatPercent(numericValue);
                    }
                    return formatCurrency(numericValue);
                  }}
                  labelFormatter={(label) => label}
                />
                <Line
                  type="monotone"
                  dataKey="savings"
                  name="Savings"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-2))", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
