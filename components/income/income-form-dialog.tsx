"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  INCOME_STATUSES,
  INCOME_STATUS_LABELS,
  INCOME_TYPES,
  INCOME_TYPE_LABELS,
} from "@/lib/income/constants";
import { createIncome, updateIncome } from "@/lib/income/actions";
import type { IncomeRecord } from "@/lib/income/types";
import {
  incomeFormSchema,
  type IncomeFormValues,
} from "@/lib/validations/income";

interface IncomeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  income?: IncomeRecord | null;
}

function getDefaultValues(income?: IncomeRecord | null): Partial<IncomeFormValues> {
  if (income) {
    return {
      amount: income.amount,
      source: income.source,
      type: income.type,
      date: income.date,
      status: income.status,
      notes: income.notes ?? "",
      recurring: income.recurring,
    };
  }

  return {
    amount: undefined,
    source: "",
    type: "SALARY",
    date: new Date().toISOString().slice(0, 10),
    status: "PENDING",
    notes: "",
    recurring: false,
  };
}

export function IncomeFormDialog({
  open,
  onOpenChange,
  income,
}: IncomeFormDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [serverError, setServerError] = useState<string | null>(null);
  const isEditing = Boolean(income);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: getDefaultValues(income),
  });

  useEffect(() => {
    if (open) {
      reset(getDefaultValues(income));
      setServerError(null);
    }
  }, [open, income, reset]);

  const onSubmit = async (data: IncomeFormValues) => {
    setServerError(null);

    const result = isEditing && income
      ? await updateIncome(income.id, data)
      : await createIncome(data);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    toast({
      title: isEditing ? "Income updated" : "Income added",
      description: isEditing
        ? "Your income record has been updated."
        : "Your income record has been added.",
    });

    onOpenChange(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Income" : "Add Income"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of this income record."
              : "Record a new income entry for your account."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <div
              className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {serverError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              disabled={isSubmitting}
              aria-invalid={!!errors.amount}
              {...register("amount")}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              placeholder="e.g. Acme Corp, Client Project"
              disabled={isSubmitting}
              aria-invalid={!!errors.source}
              {...register("source")}
            />
            {errors.source && (
              <p className="text-sm text-destructive">{errors.source.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                id="type"
                disabled={isSubmitting}
                aria-invalid={!!errors.type}
                {...register("type")}
              >
                {INCOME_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {INCOME_TYPE_LABELS[type]}
                  </option>
                ))}
              </Select>
              {errors.type && (
                <p className="text-sm text-destructive">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                disabled={isSubmitting}
                aria-invalid={!!errors.status}
                {...register("status")}
              >
                {INCOME_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {INCOME_STATUS_LABELS[status]}
                  </option>
                ))}
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              disabled={isSubmitting}
              aria-invalid={!!errors.date}
              {...register("date")}
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Optional notes..."
              disabled={isSubmitting}
              aria-invalid={!!errors.notes}
              {...register("notes")}
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
          </div>

          <div className="flex items-start gap-3 rounded-lg border p-3">
            <input
              id="recurring"
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-input"
              disabled={isSubmitting}
              {...register("recurring")}
            />
            <div>
              <Label htmlFor="recurring" className="cursor-pointer">
                Recurring monthly salary
              </Label>
              <p className="text-xs text-muted-foreground">
                Mark this as your regular monthly salary for salary tracking.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Save changes"
              ) : (
                "Add income"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
