"use client";

import * as React from "react";
import { useState } from "react";
import type { Transaction } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionForm } from "@/components/transaction-form";
import { TransactionsTable } from "@/components/transactions-table";

const initialTransactions: Transaction[] = [
  {
    id: "1",
    type: "Income",
    amount: 5000,
    date: new Date("2024-07-15"),
    description: "Monthly Salary",
    category: "Income",
  },
  {
    id: "2",
    type: "Expense",
    amount: 75.5,
    date: new Date("2024-07-16"),
    description: "Grocery Shopping at SuperMart",
    category: "Expense",
  },
  {
    id: "3",
    type: "Expense",
    amount: 1200,
    date: new Date("2024-07-01"),
    description: "Apartment Rent",
    category: "Expense",
  },
  {
    id: "4",
    type: "Investment",
    amount: 300,
    date: new Date("2024-07-10"),
    description: "Stocks purchase",
    category: "Investment",
  },
];


export default function Home() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);

  const handleTransactionAdded = (newTransaction: Transaction) => {
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <header className="bg-primary text-primary-foreground p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold font-headline">Money Tracker</h1>
        </div>
      </header>
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline">Add New Transaction</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionForm onTransactionAdded={handleTransactionAdded} />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionsTable transactions={transactions} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>Built with Next.js and ShadCN</p>
      </footer>
    </div>
  );
}
