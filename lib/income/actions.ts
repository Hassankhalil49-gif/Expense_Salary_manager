"use server";



import { revalidatePath } from "next/cache";



import { requireAuth } from "@/lib/auth/session";

import { formatAmountForDb } from "@/lib/income/decimal";

import {

  getUserIncomeById,

  updateIncomeStatusForUser,

} from "@/lib/income/queries";

import type { IncomeRecord } from "@/lib/income/types";

import { prisma } from "@/lib/db/prisma";

import {

  incomeFormSchema,

  incomeIdSchema,

  updateIncomeStatusSchema,

} from "@/lib/validations/income";



type ActionResult<T = undefined> =

  | { success: true; data?: T }

  | { success: false; error: string; fieldErrors?: Record<string, string[]> };



function revalidateIncomePaths() {

  revalidatePath("/dashboard");

  revalidatePath("/dashboard/income");

  revalidatePath("/income");

}



function parseIncomeDate(dateString: string): Date {

  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day));

}



export async function createIncome(

  input: unknown

): Promise<ActionResult<{ income: IncomeRecord }>> {

  const user = await requireAuth();

  const parsed = incomeFormSchema.safeParse(input);



  if (!parsed.success) {

    const fieldErrors = parsed.error.flatten().fieldErrors;

    const firstError =

      Object.values(fieldErrors)[0]?.[0] ?? "Invalid input. Please check your details.";



    return { success: false, error: firstError, fieldErrors };

  }



  const { amount, source, type, date, status, notes, recurring } = parsed.data;



  try {

    const income = await prisma.income.create({

      data: {

        userId: user.id,

        amount: formatAmountForDb(amount),

        source: source.trim(),

        type,

        date: parseIncomeDate(date),

        status,

        notes: notes.trim() || null,

        recurring,

      },

    });



    revalidateIncomePaths();



    const record = await getUserIncomeById(user.id, income.id);



    if (!record) {

      return { success: false, error: "Income was created but could not be loaded." };

    }



    return { success: true, data: { income: record } };

  } catch {

    return { success: false, error: "Something went wrong. Please try again." };

  }

}



export async function updateIncome(

  incomeId: string,

  input: unknown

): Promise<ActionResult<{ income: IncomeRecord }>> {

  const user = await requireAuth();

  const idParsed = incomeIdSchema.safeParse({ id: incomeId });



  if (!idParsed.success) {

    return { success: false, error: "Invalid income record." };

  }



  const parsed = incomeFormSchema.safeParse(input);



  if (!parsed.success) {

    const fieldErrors = parsed.error.flatten().fieldErrors;

    const firstError =

      Object.values(fieldErrors)[0]?.[0] ?? "Invalid input. Please check your details.";



    return { success: false, error: firstError, fieldErrors };

  }



  const existing = await getUserIncomeById(user.id, incomeId);



  if (!existing) {

    return { success: false, error: "Income record not found." };

  }



  const { amount, source, type, date, status, notes, recurring } = parsed.data;



  try {

    await prisma.income.update({

      where: { id: incomeId },

      data: {

        amount: formatAmountForDb(amount),

        source: source.trim(),

        type,

        date: parseIncomeDate(date),

        status,

        notes: notes.trim() || null,

        recurring,

      },

    });



    revalidateIncomePaths();



    const record = await getUserIncomeById(user.id, incomeId);



    if (!record) {

      return { success: false, error: "Income was updated but could not be loaded." };

    }



    return { success: true, data: { income: record } };

  } catch {

    return { success: false, error: "Something went wrong. Please try again." };

  }

}



export async function deleteIncome(incomeId: string): Promise<ActionResult> {

  const user = await requireAuth();

  const idParsed = incomeIdSchema.safeParse({ id: incomeId });



  if (!idParsed.success) {

    return { success: false, error: "Invalid income record." };

  }



  const existing = await getUserIncomeById(user.id, incomeId);



  if (!existing) {

    return { success: false, error: "Income record not found." };

  }



  try {

    await prisma.income.delete({

      where: { id: incomeId },

    });



    revalidateIncomePaths();

    return { success: true };

  } catch {

    return { success: false, error: "Something went wrong. Please try again." };

  }

}



export async function updateIncomeStatus(

  incomeId: string,

  status: unknown

): Promise<ActionResult<{ income: IncomeRecord }>> {

  const user = await requireAuth();

  const parsed = updateIncomeStatusSchema.safeParse({ id: incomeId, status });



  if (!parsed.success) {

    return { success: false, error: "Invalid status update." };

  }



  try {

    const record = await updateIncomeStatusForUser(

      user.id,

      parsed.data.id,

      parsed.data.status

    );



    if (!record) {

      return { success: false, error: "Income record not found." };

    }



    revalidateIncomePaths();

    return { success: true, data: { income: record } };

  } catch {

    return { success: false, error: "Something went wrong. Please try again." };

  }

}


