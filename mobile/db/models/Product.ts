import { Model } from "@nozbe/watermelondb";
import { field, date, readonly, writer } from "@nozbe/watermelondb/decorators";

export class Product extends Model {
  static table = "products";

  @field("name") name!: string;
  @field("buy_price") buyPrice!: number;
  @field("sell_price") sellPrice!: number;
  @field("stock_qty") stockQty!: number;
  @field("unit") unit!: string;
  @field("archived_at") archivedAt!: number | null;
  @field("is_synced") isSynced!: boolean;
  @field("server_id") serverId!: string | null;
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;

  get profit() {
    return this.sellPrice - this.buyPrice;
  }

  get isLowStock() {
    return this.stockQty <= 5;
  }
}
