// @/app/actions.ts
"use server";

import { z } from "zod";
import { categorizeTransaction } from "@/ai/flows/categorize-transaction";
import type { Transaction, TransactionFormValues } from "@/types";

export async function createTransactionAction(
  values: TransactionFormValues
): Promise<{ data: Transaction | null; error: string | null }> {
  try {
    const { description } = values;

    const { category } = await categorizeTransaction({ description });

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      ...values,
      amount: Number(values.amount),
      category: category || "Uncategorized",
    };

    return { data: newTransaction, error: null };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: "Failed to create transaction. Please try again.",
    };
  }
}
