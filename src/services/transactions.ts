"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
  onSnapshot,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { waitForAuth } from "./auth";
import { Transaction, TransactionInput } from "../models/transactions";

async function requireUid(): Promise<string> {
  const userUid = await waitForAuth()
  if (!userUid) throw new Error("Usuário não autenticado.");
  return userUid;
}

function colRef(uid: string) {
  return collection(db, "users", uid, "transactions");
}

export async function addTransaction(input: TransactionInput): Promise<string> {
  const uid = await requireUid();
  const ref = await addDoc(colRef(uid), {
    uid,
    type: input.type,
    value: input.value,
    description: input.description,
    category: input.category,
    date: Timestamp.fromDate(input.date ?? new Date()),
    createdAt: Timestamp.now(),
  });
  return ref.id;
}

export async function updateTransaction(
  id: string,
  patch: Partial<Omit<TransactionInput, "date">> & { date?: Date }
): Promise<void> {
  const uid = await requireUid();
  await updateDoc(doc(db, "users", uid, "transactions", id), {
    ...("type" in patch ? { type: patch.type } : {}),
    ...("value" in patch ? { value: patch.value } : {}),
    ...("description" in patch ? { description: patch.description } : {}),
    ...("category" in patch ? { category: patch.category } : {}),
    ...("date" in patch && patch.date
      ? { date: Timestamp.fromDate(patch.date) }
      : {}),
  });
}

export async function deleteTransaction(id: string): Promise<void> {
  const uid = await requireUid();
  await deleteDoc(doc(db, "users", uid, "transactions", id));
}

export async function getTransaction(id: string): Promise<Transaction | null> {
  const uid = await requireUid();
  const snap = await getDoc(doc(db, "users", uid, "transactions", id));
  if (!snap.exists()) return null;
  const data = snap.data() as any;
  return {
    id: snap.id,
    uid: data.uid,
    type: data.type,
    value: data.value,
    description: data.description,
    category: data.category,
    date: (data.date as Timestamp).toDate(),
    createdAt: data.createdAt
      ? (data.createdAt as Timestamp).toDate()
      : undefined,
  };
}

export async function listTransactionsByMonth(
  year: number,
  month1to12: number
): Promise<Transaction[]> {
  const uid = await requireUid();
  const start = new Date(year, month1to12 - 1, 1);
  const end = new Date(year, month1to12, 1);
  const q = query(
    colRef(uid),
    where("date", ">=", Timestamp.fromDate(start)),
    where("date", "<", Timestamp.fromDate(end)),
    orderBy("date", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      uid: data.uid,
      type: data.type,
      value: data.value,
      description: data.description,
      category: data.category,
      date: (data.date as Timestamp).toDate(),
      createdAt: data.createdAt
        ? (data.createdAt as Timestamp).toDate()
        : undefined,
    } as Transaction;
  });
}

export async function onTransationsByMonth(
  year: number,
  month1to12: number,
  cb: (items: Transaction[]) => void
) {
  const uid = await requireUid();
  const start = new Date(year, month1to12 - 1, 1);
  const end = new Date(year, month1to12, 1);
  const q = query(
    colRef(uid),
    where("date", ">=", Timestamp.fromDate(start)),
    where("date", "<", Timestamp.fromDate(end)),
    orderBy("date", "desc")
  );
  return onSnapshot(q, (snap: QuerySnapshot<DocumentData>) => {
    const list = snap.docs.map((d) => {
      const data = d.data() as any;
      return {
        id: d.id,
        uid: data.uid,
        type: data.type,
        value: data.value,
        description: data.description,
        category: data.category,
        date: (data.date as Timestamp).toDate(),
        createdAt: data.createdAt
          ? (data.createdAt as Timestamp).toDate()
          : undefined,
      } as Transaction;
    });
    cb(list);
  });
}

export async function getMonthySummary(year: number, month1to12: number) {
  const items = await listTransactionsByMonth(year, month1to12);
  const income = items
    .filter((t) => t.type === "deposito")
    .reduce((s, t) => s + t.value, 0);
  const expenses = items
    .filter((t) => t.type !== "deposito")
    .reduce((s, t) => s + t.value, 0);
  const balance = income - expenses;
  return { income, expenses, balance, count: items.length };
}

export async function onAllTransactions(cb: (items: Transaction[]) => void) {
  const uid = await requireUid();
  const q = query(colRef(uid), orderBy("date", "desc"));

  return onSnapshot(q, (snap: QuerySnapshot<DocumentData>) => {
    const list = snap.docs.map((d) => {
      const data = d.data() as any;
      return {
        id: d.id,
        uid: data.uid,
        type: data.type,
        value: data.value,
        description: data.description,
        category: data.category,
        date: (data.date as Timestamp).toDate(),
        createdAt: data.createdAt
          ? (data.createdAt as Timestamp).toDate()
          : undefined,
      } as Transaction;
    });
    cb(list);
  });
}
