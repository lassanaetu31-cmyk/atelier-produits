import { createDb } from "@atelier/core";
import type { Table } from "dexie";
import type {
  Client,
  CompanyProfile,
  Counter,
  FormConfig,
  Member,
  SavedProposal,
  Submission,
} from "./types";

const raw = createDb(
  "atelier_proposal",
  {
    clients: "++id, name, createdAt",
    proposals: "++id, number, clientId, status, createdAt",
    members: "++id, matricule, name, paid, createdAt",
    submissions: "++id, createdAt",
    forms: "++id",
    settings: "++id",
    counters: "key",
  },
  3,
);

export const db = raw as typeof raw & {
  clients: Table<Client, number>;
  proposals: Table<SavedProposal, number>;
  members: Table<Member, number>;
  submissions: Table<Submission, number>;
  forms: Table<FormConfig, number>;
  settings: Table<CompanyProfile, number>;
  counters: Table<Counter, string>;
};
