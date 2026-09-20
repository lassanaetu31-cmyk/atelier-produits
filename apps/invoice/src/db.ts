import { createDb } from "@atelier/core";
import type { Table } from "dexie";
import type { Client, CompanyProfile, Counter, SavedDocument } from "./types";

const raw = createDb(
  "atelier_invoice",
  {
    clients: "++id, name, createdAt",
    documents: "++id, number, kind, clientId, createdAt",
    settings: "++id",
    counters: "key",
  },
  3,
);

export const db = raw as typeof raw & {
  clients: Table<Client, number>;
  documents: Table<SavedDocument, number>;
  settings: Table<CompanyProfile, number>;
  counters: Table<Counter, string>;
};
