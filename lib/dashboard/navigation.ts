import type { LucideIcon } from "lucide-react";
import {
  ArrowLeftRight,
  BarChart3,
  LayoutDashboard,
  Lightbulb,
  PiggyBank,
  RefreshCw,
  Settings,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  enabled: boolean;
}

export const dashboardNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, enabled: true },
  { title: "Income", href: "/dashboard/income", icon: TrendingUp, enabled: true },
  { title: "Expenses", href: "/dashboard/expenses", icon: TrendingDown, enabled: false },
  { title: "Budgets", href: "/dashboard/budgets", icon: Wallet, enabled: false },
  {
    title: "Savings Goals",
    href: "/dashboard/savings-goals",
    icon: PiggyBank,
    enabled: false,
  },
  {
    title: "Recurring Expenses",
    href: "/dashboard/recurring-expenses",
    icon: RefreshCw,
    enabled: false,
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: ArrowLeftRight,
    enabled: false,
  },
  { title: "Reports", href: "/dashboard/reports", icon: BarChart3, enabled: false },
  { title: "Insights", href: "/dashboard/insights", icon: Lightbulb, enabled: false },
  { title: "Settings", href: "/dashboard/settings", icon: Settings, enabled: false },
];
