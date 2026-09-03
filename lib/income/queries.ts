import type { Income, IncomeStatus } from "@prisma/client";



import { INCOME_TYPE_LABELS } from "@/lib/income/constants";
import { decimalToNumber } from "@/lib/income/decimal";

import type { IncomeRecord, IncomeSummary } from "@/lib/income/types";

import { prisma } from "@/lib/db/prisma";



function toIncomeRecord(income: Income): IncomeRecord {

  return {

    id: income.id,

    amount: decimalToNumber(income.amount),

    source: income.source,

    type: income.type,

    date: income.date.toISOString().slice(0, 10),

    status: income.status,

    notes: income.notes,

    recurring: income.recurring,

    createdAt: income.createdAt.toISOString(),

    updatedAt: income.updatedAt.toISOString(),

  };

}



function getCurrentMonthRange(date = new Date()) {

  const start = new Date(date.getFullYear(), date.getMonth(), 1);

  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);



  return { start, end };

}



export async function getUserIncomes(userId: string): Promise<IncomeRecord[]> {

  const incomes = await prisma.income.findMany({

    where: { userId },

    orderBy: [{ date: "desc" }, { createdAt: "desc" }],

  });



  return incomes.map(toIncomeRecord);

}



export async function getUserIncomeById(

  userId: string,

  incomeId: string

): Promise<IncomeRecord | null> {

  const income = await prisma.income.findFirst({

    where: { id: incomeId, userId },

  });



  return income ? toIncomeRecord(income) : null;

}



export async function getIncomeSummaryForMonth(

  userId: string,

  date = new Date()

): Promise<IncomeSummary> {

  const { start, end } = getCurrentMonthRange(date);



  const [monthlyIncomes, recurringSalaries] = await Promise.all([

    prisma.income.findMany({

      where: {

        userId,

        date: { gte: start, lte: end },

      },

      select: { amount: true, status: true },

    }),

    prisma.income.findMany({

      where: {

        userId,

        recurring: true,

      },

      select: { amount: true },

    }),

  ]);



  let totalIncome = 0;

  let receivedIncome = 0;

  let pendingIncome = 0;



  for (const income of monthlyIncomes) {

    const amount = decimalToNumber(income.amount);

    totalIncome += amount;



    if (income.status === "RECEIVED") {

      receivedIncome += amount;

    } else {

      pendingIncome += amount;

    }

  }



  const monthlySalary = recurringSalaries.reduce(

    (sum, income) => sum + decimalToNumber(income.amount),

    0

  );



  return {

    totalIncome,

    receivedIncome,

    pendingIncome,

    monthlySalary,

  };

}



export async function getCurrentMonthTotalIncome(

  userId: string,

  date = new Date()

): Promise<number> {

  const summary = await getIncomeSummaryForMonth(userId, date);

  return summary.totalIncome;

}



export async function getRecentIncomeTransactions(

  userId: string,

  limit = 5

) {

  const incomes = await prisma.income.findMany({

    where: { userId },

    orderBy: [{ date: "desc" }, { createdAt: "desc" }],

    take: limit,

  });



  return incomes.map((income) => ({

    id: income.id,

    type: "income" as const,

    description: income.source,

    category: INCOME_TYPE_LABELS[income.type],

    amount: decimalToNumber(income.amount),

    date: income.date.toISOString(),

  }));

}



export async function updateIncomeStatusForUser(

  userId: string,

  incomeId: string,

  status: IncomeStatus

): Promise<IncomeRecord | null> {

  const existing = await prisma.income.findFirst({

    where: { id: incomeId, userId },

  });



  if (!existing) {

    return null;

  }



  const updated = await prisma.income.update({

    where: { id: incomeId },

    data: { status },

  });



  return toIncomeRecord(updated);

}


