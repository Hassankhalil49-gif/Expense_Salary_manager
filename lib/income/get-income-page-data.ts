import type { IncomePageData } from "@/lib/income/types";

import {

  getIncomeSummaryForMonth,

  getUserIncomes,

} from "@/lib/income/queries";



export async function getIncomePageData(

  userId: string

): Promise<IncomePageData> {

  const [incomes, summary] = await Promise.all([

    getUserIncomes(userId),

    getIncomeSummaryForMonth(userId),

  ]);



  return { incomes, summary };

}


