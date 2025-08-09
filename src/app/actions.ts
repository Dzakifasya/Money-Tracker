// @/app/actions.ts
"use server";

import { z } from "zod";
import { categorizeTransaction } from "@/ai/flows/categorize-transaction";
import type { Transaction, TransactionFormValues } from "@/types";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "@/lib/firebase";

const db = getFirestore(app);

export async function createTransactionAction(
  values: TransactionFormValues,
  userId: string
): Promise<{ data: Transaction | null; error: string | null }> {
  try {
    if (!userId) {
      return { data: null, error: "You must be logged in to create a transaction." };
    }

    const { description } = values;

    const { category } = await categorizeTransaction({ description });
    
    const docRef = await addDoc(collection(db, "users", userId, "transactions"), {
      ...values,
      amount: Number(values.amount),
      category: category || "Uncategorized",
      createdAt: new Date(),
    });

    const newTransaction: Transaction = {
      id: docRef.id,
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
