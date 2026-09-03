import type { Decimal } from "@prisma/client/runtime/library";



export function decimalToNumber(value: Decimal | number | string): number {

  if (typeof value === "number") {

    return value;

  }



  return Number(value.toString());

}



export function formatAmountForDb(amount: number): string {

  return amount.toFixed(2);

}


