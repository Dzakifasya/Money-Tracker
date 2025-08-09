import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["Income", "Expense", "Investment"], {
    required_error: "Transaction type is required.",
  }),
  amount: z.coerce
    .number({ invalid_type_error: "Amount must be a number." })
    .positive({ message: "Amount must be a positive number." }),
  date: z.date({
    required_error: "A date is required.",
  }),
  description: z
    .string()
    .min(1, "Description is required.")
    .max(100, "Description is too long."),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

export type Transaction = TransactionFormValues & {
  id: string;
  category: string;
};
