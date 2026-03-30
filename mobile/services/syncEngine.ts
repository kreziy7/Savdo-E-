/**
 * Oflayn sync engine.
 * Internet kelganda telefondagi yozilmagan ma'lumotlarni serverga yuboradi.
 *
 * Qanday ishlaydi:
 *  1. is_synced = false bo'lgan barcha yozuvlarni topadi
 *  2. Ularni batch API'ga yuboradi
 *  3. server_id va is_synced = true qilib yangilaydi
 *
 * runSync() — root layout da AppState "active" bo'lganda chaqiriladi.
 */
import { database } from "@/db";
import { Product } from "@/db/models/Product";
import { Sale } from "@/db/models/Sale";
import { Q } from "@nozbe/watermelondb";
import { api } from "./api";
import { useSyncStore } from "@/store/syncStore";

export async function runSync() {
  if (useSyncStore.getState().isSyncing) return;

  // Pending count yangilash — UI ko'rsatish uchun
  const pending = await getPendingCount();
  useSyncStore.getState().setPendingCount(pending);
  if (pending === 0) return;

  useSyncStore.getState().setSyncing(true);
  try {
    await syncProducts();
    await syncSales();
    useSyncStore.getState().setLastSynced();
    useSyncStore.getState().setPendingCount(0);
  } catch (err) {
    console.warn("Sync error:", err);
    // Xato bo'lsa — pendingCount ni qayta hisoblash
    const remaining = await getPendingCount();
    useSyncStore.getState().setPendingCount(remaining);
  } finally {
    useSyncStore.getState().setSyncing(false);
  }
}

async function syncProducts() {
  const unsynced = await database.collections
    .get<Product>("products")
    .query(Q.where("is_synced", false))
    .fetch();

  if (unsynced.length === 0) return;

  const payload = unsynced.map((p) => ({
    localId: p.id,
    name: p.name,
    buyPrice: p.buyPrice,
    sellPrice: p.sellPrice,
    stockQty: p.stockQty,
    unit: p.unit,
    archivedAt: p.archivedAt,
  }));

  const { data } = await api.post("/sync/products", { products: payload });

  await database.write(async () => {
    for (const item of data.synced) {
      const product = unsynced.find((p) => p.id === item.localId);
      if (product) {
        await product.update((p) => {
          p.serverId = item.serverId;
          p.isSynced = true;
        });
      }
    }
  });
}

async function syncSales() {
  const unsynced = await database.collections
    .get<Sale>("sales")
    .query(Q.where("is_synced", false))
    .fetch();

  if (unsynced.length === 0) return;

  const payload = unsynced.map((s) => ({
    localId: s.id,
    productId: s.productId,
    productName: s.productName,
    qty: s.qty,
    sellPrice: s.sellPrice,
    profit: s.profit,
    note: s.note,
    soldAt: s.soldAt,
  }));

  const { data } = await api.post("/sync/sales", { sales: payload });

  await database.write(async () => {
    for (const item of data.synced) {
      const sale = unsynced.find((s) => s.id === item.localId);
      if (sale) {
        await sale.update((s) => {
          s.serverId = item.serverId;
          s.isSynced = true;
        });
      }
    }
  });
}

export async function getPendingCount(): Promise<number> {
  const [products, sales] = await Promise.all([
    database.collections.get<Product>("products").query(Q.where("is_synced", false)).fetchCount(),
    database.collections.get<Sale>("sales").query(Q.where("is_synced", false)).fetchCount(),
  ]);
  return products + sales;
}
