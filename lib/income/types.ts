import type { IncomeStatus, IncomeType } from "@prisma/client";



export interface IncomeRecord {

  id: string;

  amount: number;

  source: string;

  type: IncomeType;

  date: string;

  status: IncomeStatus;

  notes: string | null;

  recurring: boolean;

  createdAt: string;

  updatedAt: string;

}



export interface IncomeSummary {

  totalIncome: number;

  receivedIncome: number;

  pendingIncome: number;

  monthlySalary: number;

}



export interface IncomePageData {

  incomes: IncomeRecord[];

  summary: IncomeSummary;

}


