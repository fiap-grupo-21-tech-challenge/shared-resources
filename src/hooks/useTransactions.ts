import { useEffect, useState } from "react";
import * as transactionService from '../services/transactions'
import { Transaction } from "../models/transactions";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;

  const { onTransationsByMonth } = transactionService;


  useEffect(() => {
    let unsub: (() => void) | undefined;

    onTransationsByMonth(y, m, setTransactions).then((unsubscribe) => {
      unsub = unsubscribe;
    });

    return () => {
      if (unsub) unsub();
    };
  }, [y, m]);

  const deposits = transactions.filter((t) => t.type === "deposito");
  const withdrawals = transactions.filter((t) => t.type === "saque");

  const totalDeposits = deposits.reduce((sum, t) => sum + t.value, 0);
  const totalWithdrawals = withdrawals.reduce((sum, t) => sum + t.value, 0);
  const balance = totalDeposits - totalWithdrawals;

  const currentMonth = new Date().getMonth();
  const monthlyIncome = deposits
    .filter((t) => new Date(t.date).getMonth() === currentMonth)
    .reduce((sum, t) => sum + t.value, 0);

  const totalIncome = deposits.reduce((sum, t) => sum + t.value, 0);

  const monthlyExpenses = withdrawals
    .filter((t) => new Date(t.date).getMonth() === currentMonth)
    .reduce((sum, t) => sum + t.value, 0);

  const totalExpenses = withdrawals.reduce((sum, t) => sum + t.value, 0);

  return {
    balance,
    totalIncome,
    totalExpenses,
    totalDeposits,
    monthlyIncome,
    monthlyExpenses
  }
}