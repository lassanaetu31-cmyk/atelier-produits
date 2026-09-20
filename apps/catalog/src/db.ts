import { createDb } from "@atelier/core";
import type { Table } from "dexie";
import type { Product, ShopProfile } from "./types";

const raw = createDb(
  "atelier_catalog",
  {
    products: "++id, name, category, createdAt",
    settings: "++id",
  },
  1,
);

export const db = raw as typeof raw & {
  products: Table<Product, number>;
  settings: Table<ShopProfile, number>;
};
