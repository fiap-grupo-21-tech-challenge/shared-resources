
export type CardType = "balance" | "monthlyIncome" | "monthlyExpenses";

export type CardProps = {
  amount: number;
  type: CardType;
};

export type BalanceCardProps = {};

export type TransactionType = "deposito" | "saque" | "transferencia";
export type TransactionCategory =
  | "salario"
  | "moradia"
  | "alimentacao"
  | "saude"
  | "investimento"
  | "utilidades";

export type TransactionInput = {
  type: TransactionType;
  value: number;
  description: string;
  category: TransactionCategory;
  date?: Date;
};

export type Transaction = TransactionInput & {
  id: string;
  uid: string;
  date: Date;
  createdAt?: Date;
};