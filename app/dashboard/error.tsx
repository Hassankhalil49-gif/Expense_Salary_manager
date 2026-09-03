"use client";

import { AlertCircle } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <DashboardShell>
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Something went wrong</CardTitle>
            <CardDescription>
              We couldn&apos;t load your dashboard. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            {process.env.NODE_ENV === "development" && error.message ? (
              <p className="text-center text-xs text-muted-foreground">
                {error.message}
              </p>
            ) : null}
            <Button onClick={reset}>Try again</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
