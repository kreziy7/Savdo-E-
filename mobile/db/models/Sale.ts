import { Model } from "@nozbe/watermelondb";
import { field, date, readonly } from "@nozbe/watermelondb/decorators";

export class Sale extends Model {
  static table = "sales";

  @field("product_id") productId!: string;
  @field("product_name") productName!: string;
  @field("qty") qty!: number;
  @field("sell_price") sellPrice!: number;
  @field("profit") profit!: number;
  @field("note") note!: string | null;
  @field("sold_at") soldAt!: number;
  @field("is_synced") isSynced!: boolean;
  @field("server_id") serverId!: string | null;
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;

  get totalAmount() {
    return this.sellPrice * this.qty;
  }
}
