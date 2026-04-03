import { Database } from "@nozbe/watermelondb";
import LokiJSAdapter from "@nozbe/watermelondb/adapters/lokijs";
import { schema } from "./schema";
import { Product } from "./models/Product";
import { Sale } from "./models/Sale";

const adapter = new LokiJSAdapter({
  schema,
  useWebWorker: false,
  useIncrementalIndexedDB: false,
});

export const database = new Database({
  adapter,
  modelClasses: [Product, Sale],
});

export const productsCollection = database.collections.get<Product>("products");
export const salesCollection = database.collections.get<Sale>("sales");
