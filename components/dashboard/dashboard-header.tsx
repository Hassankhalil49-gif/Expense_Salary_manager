"use client";

import Link from "next/link";
import { Bell, Plus } from "lucide-react";

import { LogoutButton } from "@/components/auth/dashboard-content";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getCurrentMonthLabel, getInitials } from "@/lib/format/currency";
import type { DashboardUser } from "@/lib/dashboard/types";

interface DashboardHeaderProps {
  user: DashboardUser;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const firstName = user.name.split(" ")[0] ?? user.name;

  return (
    <TooltipProvider delayDuration={0}>
      <header className="border-b bg-card/50">
        <div className="flex flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {getCurrentMonthLabel()}
              </p>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome back, {firstName}
              </h1>
              <p className="text-sm text-muted-foreground">
                Here&apos;s an overview of your finances this month.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Notifications"
                  >
                    <Bell className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>No new notifications</TooltipContent>
              </Tooltip>

              <ThemeToggle />

              <Avatar className="h-9 w-9 border">
                {user.image ? (
                  <AvatarImage src={user.image} alt={user.name} />
                ) : null}
                <AvatarFallback className="text-xs font-medium">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button className="w-full sm:w-auto" asChild>
              <Link href="/dashboard/income">
                <Plus className="h-4 w-4" />
                Add Income
              </Link>
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto" disabled>
                  <Plus className="h-4 w-4" />
                  Add Expense
                  <Badge variant="secondary" className="ml-1 text-[10px]">
                    Soon
                  </Badge>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Expense tracking will be available in the next step
              </TooltipContent>
            </Tooltip>

            <div className="hidden sm:ml-auto lg:block">
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
