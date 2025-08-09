"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import type { Transaction } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionForm } from "@/components/transaction-form";
import { TransactionsTable } from "@/components/transactions-table";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { getFirestore, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { app } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, LogOut } from "lucide-react";

const db = getFirestore(app);

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "users", user.uid, "transactions"), orderBy("date", "desc"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const transactionsData: Transaction[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          transactionsData.push({ 
            id: doc.id,
            ...data,
            date: data.date.toDate() 
          } as Transaction);
        });
        setTransactions(transactionsData);
      });
      return () => unsubscribe();
    }
  }, [user]);
  
  if (loading || !user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  const totalBalance = React.useMemo(() => {
    return transactions.reduce((acc, transaction) => {
      if (transaction.type === "Income") {
        return acc + transaction.amount;
      } else if (transaction.type === "Expense") {
        return acc - transaction.amount;
      }
      return acc;
    }, 0);
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
  
  const handleTransactionAdded = (newTransaction: Transaction) => {
    // Firestore real-time listener will handle updates
  };


  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <header className="bg-primary text-primary-foreground p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold font-headline">Money Tracker</h1>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-1 flex flex-col gap-8">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline">Total Balance</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsBalanceVisible(!isBalanceVisible)}>
                  {isBalanceVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </Button>
              </CardHeader>
              <CardContent>
                <p className={cn(
                  "text-3xl font-bold",
                  totalBalance >= 0 ? "text-success" : "text-destructive",
                  !isBalanceVisible && "blur-md"
                )}>
                  {formatCurrency(totalBalance)}
                </p>
              </CardContent>
            </Card>
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
