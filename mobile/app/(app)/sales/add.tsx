/**
 * Sotuv yozish — ENG MUHIM EKRAN.
 * Maqsad: 3 sekundda sotuv yozib bo'lish.
 * WatermelonDB — avval telephonga yozadi (<80ms), keyin serverga.
 */
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from "react-native";
import { router } from "expo-router";
import { database, productsCollection, salesCollection } from "@/db";
import { Product } from "@/db/models/Product";
import { useProducts } from "@/hooks/useProducts";
import { useT } from "@/hooks/useT";
import { Search, CheckCircle } from "lucide-react-native";
import { Q } from "@nozbe/watermelondb";

export default function AddSaleScreen() {
  const t = useT();
  const allProducts = useProducts();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [qty, setQty] = useState("1");
  const [saving, setSaving] = useState(false);
  const [lastSale, setLastSale] = useState<{ name: string; profit: number } | null>(null);

  const filtered = allProducts.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase())
  );

  const qtyNum = Number(qty) || 0;
  const totalAmount = selected ? selected.sellPrice * qtyNum : 0;
  const totalProfit = selected ? (selected.sellPrice - selected.buyPrice) * qtyNum : 0;

  async function handleSale() {
    if (!selected || qtyNum <= 0) return;
    if (qtyNum > selected.stockQty) {
      Alert.alert("Xato", `${t.sales.stock} ${selected.stockQty} ${selected.unit}`);
      return;
    }
    setSaving(true);
    try {
      // WatermelonDB: avval telephonga yoz (<80ms)
      await database.write(async () => {
        await salesCollection.create((s) => {
          s.productId = selected.id;
          s.productName = selected.name;
          s.qty = qtyNum;
          s.sellPrice = selected.sellPrice;
          s.profit = totalProfit;
          s.note = null;
          s.soldAt = Date.now();
          s.isSynced = false;
          s.serverId = null;
        });
        // Stock kamaytirish
        await selected.update((p) => {
          p.stockQty = p.stockQty - qtyNum;
          p.isSynced = false;
        });
      });
      setLastSale({ name: selected.name, profit: totalProfit });
      setSelected(null);
      setSearch("");
      setQty("1");
    } catch {
      Alert.alert("Xato", "Saqlashda muammo");
    } finally {
      setSaving(false);
    }
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-4 pt-14 pb-4">
        <TouchableOpacity onPress={() => router.back()} className="mb-3">
          <Text className="text-green-600">← {t.products.cancel}</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-800">{t.sales.addSale}</Text>
      </View>

      {/* Oxirgi sotuv banner */}
      {lastSale && (
        <View className="mx-4 mt-3 bg-green-50 border border-green-200 rounded-xl p-3 flex-row items-center gap-2">
          <CheckCircle size={20} color="#16a34a" />
          <Text className="text-green-700 font-medium flex-1">
            {lastSale.name} — +{lastSale.profit.toLocaleString()} so'm {t.sales.written}
          </Text>
        </View>
      )}

      <View className="px-4 mt-3 flex-1">
        {!selected ? (
          <>
            <View className="flex-row items-center bg-white border border-gray-300 rounded-xl px-3 mb-3">
              <Search size={18} color="#9ca3af" />
              <TextInput
                className="flex-1 h-12 ml-2 text-base"
                placeholder={t.sales.searchProduct}
                value={search}
                onChangeText={setSearch}
                autoFocus
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")}>
                  <Text className="text-gray-400 px-2">✕</Text>
                </TouchableOpacity>
              )}
            </View>
            <FlatList
              data={filtered}
              keyExtractor={(p) => p.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`bg-white rounded-xl p-4 mb-2 shadow-sm flex-row justify-between items-center ${
                    item.stockQty === 0 ? "opacity-50" : ""
                  }`}
                  onPress={() => { if (item.stockQty > 0) { setSelected(item); setSearch(""); } }}
                  disabled={item.stockQty === 0}
                >
                  <View>
                    <Text className="font-medium text-gray-800">{item.name}</Text>
                    <Text className={`text-xs mt-0.5 ${item.isLowStock ? "text-amber-500" : "text-gray-400"}`}>
                      {t.sales.stock} {item.stockQty} {item.unit}
                    </Text>
                  </View>
                  <Text className="text-green-600 font-semibold">
                    {item.sellPrice.toLocaleString()} so'm
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text className="text-center text-gray-400 mt-8">
                  {search ? t.sales.noProduct : t.sales.searchProduct}
                </Text>
              }
            />
          </>
        ) : (
          <View className="gap-4">
            <View className="bg-white rounded-xl p-4 flex-row justify-between items-center shadow-sm">
              <View className="flex-1">
                <Text className="font-semibold text-lg text-gray-800">{selected.name}</Text>
                <Text className="text-gray-400 text-sm">
                  {t.sales.stock} {selected.stockQty} {selected.unit} • {selected.sellPrice.toLocaleString()} so'm
                </Text>
              </View>
              <TouchableOpacity onPress={() => { setSelected(null); setQty("1"); }}>
                <Text className="text-gray-400 text-xl px-2">✕</Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text className="text-gray-600 font-medium mb-1">{t.sales.qty}</Text>
              <View className="flex-row gap-2 items-center">
                <TouchableOpacity
                  className="w-12 h-16 bg-white border border-gray-300 rounded-xl items-center justify-center"
                  onPress={() => setQty(String(Math.max(1, qtyNum - 1)))}
                >
                  <Text className="text-2xl text-gray-600">−</Text>
                </TouchableOpacity>
                <TextInput
                  className="flex-1 bg-white border border-gray-300 rounded-xl h-16 text-3xl text-center font-bold"
                  keyboardType="numeric"
                  value={qty}
                  onChangeText={setQty}
                  selectTextOnFocus
                />
                <TouchableOpacity
                  className="w-12 h-16 bg-white border border-gray-300 rounded-xl items-center justify-center"
                  onPress={() => setQty(String(qtyNum + 1))}
                >
                  <Text className="text-2xl text-gray-600">+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="bg-green-50 rounded-xl p-4 border border-green-100 gap-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">{t.sales.totalAmount}</Text>
                <Text className="font-bold text-gray-800">{totalAmount.toLocaleString()} so'm</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">{t.sales.totalProfit}</Text>
                <Text className="font-bold text-green-600">{totalProfit.toLocaleString()} so'm</Text>
              </View>
            </View>

            <TouchableOpacity
              className={`rounded-xl h-16 items-center justify-center shadow-sm ${saving ? "bg-gray-400" : "bg-green-600"}`}
              onPress={handleSale}
              disabled={saving}
            >
              <Text className="text-white font-bold text-xl">
                {saving ? "..." : `✓  ${t.sales.write}`}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
