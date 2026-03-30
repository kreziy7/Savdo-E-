import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "products",
      columns: [
        { name: "name", type: "string" },
        { name: "buy_price", type: "number" },
        { name: "sell_price", type: "number" },
        { name: "stock_qty", type: "number" },
        { name: "unit", type: "string" },
        { name: "archived_at", type: "number", isOptional: true },
        { name: "is_synced", type: "boolean" },
        { name: "server_id", type: "string", isOptional: true },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "sales",
      columns: [
        { name: "product_id", type: "string", isIndexed: true },
        { name: "product_name", type: "string" },
        { name: "qty", type: "number" },
        { name: "sell_price", type: "number" },
        { name: "profit", type: "number" },
        { name: "note", type: "string", isOptional: true },
        { name: "sold_at", type: "number", isIndexed: true },
        { name: "is_synced", type: "boolean" },
        { name: "server_id", type: "string", isOptional: true },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
  ],
});
