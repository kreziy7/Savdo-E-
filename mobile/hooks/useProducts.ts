import { useEffect, useState } from "react";
import { productsCollection } from "@/db";
import { Product } from "@/db/models/Product";
import { Q } from "@nozbe/watermelondb";

/** Barcha aktiv tovarlar (real-time observable) */
export function useProducts(search?: string) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const query = search
      ? productsCollection.query(
          Q.where("archived_at", null),
          Q.where("name", Q.like(`%${Q.sanitizeLikeString(search)}%`))
        )
      : productsCollection.query(Q.where("archived_at", null));

    const sub = query.observe().subscribe(setProducts);
    return () => sub.unsubscribe();
  }, [search]);

  return products;
}

/** Bitta tovar (ID bo'yicha) */
export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!id) return;
    productsCollection.find(id).then(setProduct).catch(() => setProduct(null));
  }, [id]);

  return product;
}

/** Kam qolgan tovarlar soni (real-time) — tab badge uchun */
export function useLowStockCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sub = productsCollection
      .query(Q.where("archived_at", null), Q.where("stock_qty", Q.lte(5)))
      .observeCount()
      .subscribe(setCount);
    return () => sub.unsubscribe();
  }, []);

  return count;
}
