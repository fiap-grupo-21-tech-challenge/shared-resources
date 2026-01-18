import { BiDollar, BiTrendingDown, BiTrendingUp } from "react-icons/bi";

export const colorsByType = {
  balance: {
    bg: "bg-blue-100",
    text: "text-blue-500",
    icon: BiDollar,
    transactionTitle: "Saldo Total",
    balanceTitle: "Saldo Atual",
    caption: "Conta corrente",
  },
  monthlyIncome: {
    bg: "bg-green-100",
    text: "text-green-600",
    icon: BiTrendingUp,
    transactionTitle: "Total de Depósitos",
    balanceTitle: "Entradas do mês",
    // caption: getCaption("deposito"),
  },
  monthlyExpenses: {
    bg: "bg-red-100",
    text: "text-red-500",
    icon: BiTrendingDown,
    transactionTitle: "Total de Saques",
    balanceTitle: "Saídas do mês",
    // caption: getCaption("saque"),
  },
};