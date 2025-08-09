"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Transaction } from "@/types";
import { cn } from "@/lib/utils";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";

interface TransactionsTableProps {
  transactions: Transaction[];
}

const TypeIcon = ({ type }: { type: Transaction["type"] }) => {
  if (type === "Income") {
    return <ArrowUpCircle className="h-5 w-5 text-success" />;
  }
  if (type === "Expense") {
    return <ArrowDownCircle className="h-5 w-5 text-destructive" />;
  }
  return <TrendingUp className="h-5 w-5 text-blue-500" />;
};

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
  
  return (
    <ScrollArea className="h-[450px]">
      <Table>
        <TableHeader className="sticky top-0 bg-card">
          <TableRow>
            <TableHead className="w-[50px]">Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TableRow key={transaction.id} className="transition-all">
                <TableCell>
                  <TypeIcon type={transaction.type} />
                </TableCell>
                <TableCell className="font-medium">
                  {transaction.description}
                </TableCell>
                <TableCell>{format(transaction.date, "MMM d, yyyy")}</TableCell>
                <TableCell>
                  <Badge variant="outline">{transaction.category}</Badge>
                </TableCell>
                <TableCell
                  className={cn("text-right font-semibold", {
                    "text-success": transaction.type === "Income",
                    "text-destructive": transaction.type === "Expense",
                  })}
                >
                  {transaction.type === "Expense" ? "- " : "+ "}
                  {formatCurrency(transaction.amount)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No transactions yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
