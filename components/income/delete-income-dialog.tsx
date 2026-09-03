"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { useToast } from "@/components/ui/use-toast";
import { deleteIncome } from "@/lib/income/actions";
import type { IncomeRecord } from "@/lib/income/types";
import { formatCurrency } from "@/lib/format/currency";

interface DeleteIncomeDialogProps {
  income: IncomeRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteIncomeDialog({
  income,
  open,
  onOpenChange,
}: DeleteIncomeDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!income || isDeleting) return;

    setIsDeleting(true);
    setError(null);

    const result = await deleteIncome(income.id);

    if (!result.success) {
      setError(result.error);
      setIsDeleting(false);
      return;
    }

    toast({
      title: "Income deleted",
      description: "The income record has been removed.",
    });

    onOpenChange(false);
    router.refresh();
    setIsDeleting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete income</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the income
            record
            {income ? (
              <>
                {" "}
                for <span className="font-medium">{income.source}</span> (
                {formatCurrency(income.amount)}).
              </>
            ) : (
              "."
            )}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div
            className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {error}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || !income}
          >
            {isDeleting ? (
              <>
                <Loader2 className="animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
