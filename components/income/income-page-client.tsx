"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { DeleteIncomeDialog } from "@/components/income/delete-income-dialog";
import { IncomeFormDialog } from "@/components/income/income-form-dialog";
import { IncomeSummaryCards } from "@/components/income/income-summary-cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  INCOME_STATUSES,
  INCOME_STATUS_LABELS,
  INCOME_TYPES,
  INCOME_TYPE_LABELS,
} from "@/lib/income/constants";
import { updateIncomeStatus } from "@/lib/income/actions";
import type { IncomePageData, IncomeRecord } from "@/lib/income/types";
import {
  formatCurrency,
  formatTransactionDate,
  getCurrentMonthLabel,
} from "@/lib/format/currency";
import { cn } from "@/lib/utils";

interface IncomePageClientProps {
  data: IncomePageData;
}

function StatusBadge({ status }: { status: IncomeRecord["status"] }) {
  return (
    <Badge
      variant={status === "RECEIVED" ? "default" : "secondary"}
      className={cn(
        status === "RECEIVED" &&
          "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400"
      )}
    >
      {INCOME_STATUS_LABELS[status]}
    </Badge>
  );
}

export function IncomePageClient({ data }: IncomePageClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<IncomeRecord | null>(
    null
  );

  const filteredIncomes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return data.incomes.filter((income) => {
      const matchesSearch =
        !query ||
        income.source.toLowerCase().includes(query) ||
        (income.notes?.toLowerCase().includes(query) ?? false) ||
        INCOME_TYPE_LABELS[income.type].toLowerCase().includes(query);

      const matchesType =
        typeFilter === "ALL" || income.type === typeFilter;

      const matchesStatus =
        statusFilter === "ALL" || income.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [data.incomes, search, typeFilter, statusFilter]);

  const openCreateDialog = () => {
    setSelectedIncome(null);
    setFormOpen(true);
  };

  const openEditDialog = (income: IncomeRecord) => {
    setSelectedIncome(income);
    setFormOpen(true);
  };

  const openDeleteDialog = (income: IncomeRecord) => {
    setSelectedIncome(income);
    setDeleteOpen(true);
  };

  const handleStatusToggle = (income: IncomeRecord) => {
    const nextStatus = income.status === "RECEIVED" ? "PENDING" : "RECEIVED";

    startTransition(async () => {
      const result = await updateIncomeStatus(income.id, nextStatus);

      if (!result.success) {
        toast({
          title: "Update failed",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Status updated",
        description: `Marked as ${INCOME_STATUS_LABELS[nextStatus].toLowerCase()}.`,
      });

      router.refresh();
    });
  };

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {getCurrentMonthLabel()}
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Income & Salary
          </h1>
          <p className="text-sm text-muted-foreground">
            Track salary, freelance work, and other income sources.
          </p>
        </div>

        <Button onClick={openCreateDialog} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Income
        </Button>
      </div>

      <IncomeSummaryCards summary={data.summary} />

      <Card>
        <CardHeader>
          <CardTitle>Income Records</CardTitle>
          <CardDescription>
            Search and filter your income entries. Toggle status between received
            and pending.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by source, type, or notes..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
                aria-label="Search income records"
              />
            </div>

            <Select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              aria-label="Filter by type"
              className="lg:w-44"
            >
              <option value="ALL">All types</option>
              {INCOME_TYPES.map((type) => (
                <option key={type} value={type}>
                  {INCOME_TYPE_LABELS[type]}
                </option>
              ))}
            </Select>

            <Select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
              className="lg:w-44"
            >
              <option value="ALL">All statuses</option>
              {INCOME_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {INCOME_STATUS_LABELS[status]}
                </option>
              ))}
            </Select>
          </div>

          {data.incomes.length === 0 ? (
            <EmptyState
              icon={Plus}
              title="No income records yet"
              description="Add your first salary or income entry to start tracking earnings this month."
            />
          ) : filteredIncomes.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No matching records"
              description="Try adjusting your search or filters to find income entries."
            />
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="w-[70px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIncomes.map((income) => (
                      <TableRow key={income.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{income.source}</p>
                            {income.recurring && (
                              <Badge variant="outline" className="text-[10px]">
                                <RefreshCw className="mr-1 h-3 w-3" />
                                Recurring salary
                              </Badge>
                            )}
                            {income.notes && (
                              <p className="max-w-xs truncate text-xs text-muted-foreground">
                                {income.notes}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {INCOME_TYPE_LABELS[income.type]}
                        </TableCell>
                        <TableCell>
                          {formatTransactionDate(income.date)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={income.status} />
                        </TableCell>
                        <TableCell className="text-right font-semibold tabular-nums">
                          {formatCurrency(income.amount)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Actions for ${income.source}`}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleStatusToggle(income)}
                                disabled={isPending}
                              >
                                Mark as{" "}
                                {income.status === "RECEIVED"
                                  ? "Pending"
                                  : "Received"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openEditDialog(income)}
                              >
                                <Pencil className="h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => openDeleteDialog(income)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-3 md:hidden">
                {filteredIncomes.map((income) => (
                  <div
                    key={income.id}
                    className="rounded-lg border p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <p className="font-medium">{income.source}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary" className="text-[10px]">
                            {INCOME_TYPE_LABELS[income.type]}
                          </Badge>
                          <StatusBadge status={income.status} />
                          {income.recurring && (
                            <Badge variant="outline" className="text-[10px]">
                              Recurring
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="shrink-0 font-semibold tabular-nums">
                        {formatCurrency(income.amount)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatTransactionDate(income.date)}</span>
                      {income.notes && (
                        <span className="max-w-[160px] truncate">
                          {income.notes}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleStatusToggle(income)}
                        disabled={isPending}
                      >
                        Mark {income.status === "RECEIVED" ? "Pending" : "Received"}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(income)}
                        aria-label="Edit income"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openDeleteDialog(income)}
                        aria-label="Delete income"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <IncomeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        income={selectedIncome}
      />

      <DeleteIncomeDialog
        income={selectedIncome}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}
