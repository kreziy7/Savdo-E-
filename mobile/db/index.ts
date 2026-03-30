import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import { schema } from "./schema";
import { Product } from "./models/Product";
import { Sale } from "./models/Sale";

const adapter = new SQLiteAdapter({
  schema,
  dbName: "savdo_v1",
  jsi: true, // JSI — JavaScript Interface, eng tez yo'l
  onSetUpError: (error) => {
    console.error("WatermelonDB setup xatosi:", error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [Product, Sale],
});

// Collection shortcuts
export const productsCollection = database.collections.get<Product>("products");
export const salesCollection = database.collections.get<Sale>("sales");
