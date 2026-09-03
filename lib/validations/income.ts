import { z } from "zod";

import { INCOME_STATUSES, INCOME_TYPES } from "@/lib/income/constants";

export const incomeFormSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: "Amount is required" })
    .positive("Amount must be greater than 0")
    .max(999999999.99, "Amount is too large"),
  source: z
    .string()
    .min(1, "Source is required")
    .max(200, "Source must be 200 characters or less"),
  type: z.enum(INCOME_TYPES, {
    required_error: "Type is required",
    invalid_type_error: "Please select a valid type",
  }),
  date: z
    .string()
    .min(1, "Date is required")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Please enter a valid date",
    }),
  status: z.enum(INCOME_STATUSES, {
    required_error: "Status is required",
    invalid_type_error: "Please select a valid status",
  }),
  notes: z.string().max(1000, "Notes must be 1000 characters or less").default(""),
  recurring: z.boolean().default(false),
});

export type IncomeFormValues = z.infer<typeof incomeFormSchema>;

export const incomeIdSchema = z.object({
  id: z.string().min(1, "Income ID is required"),
});

export const updateIncomeStatusSchema = z.object({
  id: z.string().min(1, "Income ID is required"),
  status: z.enum(INCOME_STATUSES),
});
