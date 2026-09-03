import type { IncomeStatus, IncomeType } from "@prisma/client";



export const INCOME_TYPES = [

  "SALARY",

  "FREELANCE",

  "BUSINESS",

  "INVESTMENT",

  "BONUS",

  "OTHER",

] as const satisfies readonly IncomeType[];



export const INCOME_STATUSES = [

  "RECEIVED",

  "PENDING",

] as const satisfies readonly IncomeStatus[];



export const INCOME_TYPE_LABELS: Record<IncomeType, string> = {

  SALARY: "Salary",

  FREELANCE: "Freelance",

  BUSINESS: "Business",

  INVESTMENT: "Investment",

  BONUS: "Bonus",

  OTHER: "Other",

};



export const INCOME_STATUS_LABELS: Record<IncomeStatus, string> = {

  RECEIVED: "Received",

  PENDING: "Pending",

};


