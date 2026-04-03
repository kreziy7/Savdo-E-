import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from "react-native";
import { router } from "expo-router";
import { database, salesCollection } from "@/db";
import { Product } from "@/db/models/Product";
import { useProducts } from "@/hooks/useProducts";
import { useT } from "@/hooks/useT";
import { Ionicons } from "@expo/vector-icons";

interface SaleResult {
  name: string;
  qty: number;
  totalAmount: number;
  profit: number;
}

export default function AddSaleScreen() {
  const t = useT();
  const allProducts = useProducts();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [qty, setQty] = useState("1");
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<SaleResult | null>(null);

  const filtered = allProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
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
        await selected.update((p) => {
          p.stockQty = p.stockQty - qtyNum;
          p.isSynced = false;
        });
      });
      setResult({ name: selected.name, qty: qtyNum, totalAmount, profit: totalProfit });
    } catch {
      Alert.alert("Xato", "Saqlashda muammo");
    } finally {
      setSaving(false);
    }
  }

  function resetForNextSale() {
    setResult(null);
    setSelected(null);
    setSearch("");
    setQty("1");
  }

  // ────────────────────────────────────────────────
  // NATIJA EKRANI
  // ────────────────────────────────────────────────
  if (result) {
    return (
      <View style={{ flex: 1, backgroundColor: "#9AB17A", justifyContent: "center", alignItems: "center", paddingHorizontal: 32 }}>
        {/* Big check */}
        <View style={{ width: 96, height: 96, backgroundColor: "#FBE8CE", borderRadius: 48, alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <Text style={{ fontSize: 48 }}>✓</Text>
        </View>

        <Text style={{ color: "#FBE8CE", fontSize: 22, fontWeight: "800", marginBottom: 4, textAlign: "center" }}>
          Sotuv yozildi!
        </Text>
        <Text style={{ color: "#E4DFB5", fontSize: 15, marginBottom: 36, textAlign: "center" }}>
          {result.name} · {result.qty} {t.sales.qty}
        </Text>

        {/* Stats */}
        <View style={{ width: "100%", gap: 12, marginBottom: 40 }}>
          <View style={{ backgroundColor: "rgba(251,232,206,0.18)", borderRadius: 18, padding: 18, flexDirection: "row", alignItems: "center", gap: 14 }}>
            <Ionicons name="bag" size={28} color="#FBE8CE" />
            <View>
              <Text style={{ color: "#E4DFB5", fontSize: 12, fontWeight: "600" }}>TUSHUM</Text>
              <Text style={{ color: "#fff", fontSize: 26, fontWeight: "800" }}>
                {result.totalAmount.toLocaleString()} so'm
              </Text>
            </View>
          </View>

          <View style={{ backgroundColor: "#FBE8CE", borderRadius: 18, padding: 18, flexDirection: "row", alignItems: "center", gap: 14 }}>
            <Ionicons name="trending-up" size={28} color="#9AB17A" />
            <View>
              <Text style={{ color: "#9AB17A", fontSize: 12, fontWeight: "600" }}>SOF FOYDA</Text>
              <Text style={{ color: "#5C7045", fontSize: 32, fontWeight: "800" }}>
                +{result.profit.toLocaleString()} so'm
              </Text>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          onPress={resetForNextSale}
          style={{ backgroundColor: "#FBE8CE", borderRadius: 16, height: 54, width: "100%", alignItems: "center", justifyContent: "center", marginBottom: 12 }}
        >
          <Text style={{ color: "#5C7045", fontWeight: "800", fontSize: 16 }}>+ Yana sotuv yozish</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/(app)")}
          style={{ height: 54, width: "100%", alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: "#E4DFB5", fontWeight: "600", fontSize: 15 }}>Bosh sahifaga qaytish</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ────────────────────────────────────────────────
  // SOTUV YOZISH EKRANI
  // ────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: "#FBE8CE" }}>
      <View style={{ backgroundColor: "#FBE8CE", paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
          <Ionicons name="chevron-back" size={20} color="#9AB17A" />
          <Text style={{ color: "#9AB17A", fontWeight: "600", fontSize: 14 }}>{t.products.cancel}</Text>
        </TouchableOpacity>
        <Text style={{ color: "#2D3A1E", fontSize: 26, fontWeight: "800" }}>{t.sales.addSale}</Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        {!selected ? (
          <>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: 12, marginBottom: 12, borderWidth: 1, borderColor: "#E4DFB5" }}>
              <Ionicons name="search" size={18} color="#9AB17A" />
              <TextInput
                style={{ flex: 1, height: 48, marginLeft: 8, fontSize: 15, color: "#2D3A1E" }}
                placeholder={t.sales.searchProduct}
                placeholderTextColor="#C3CC9B"
                value={search}
                onChangeText={setSearch}
                autoFocus
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")}>
                  <Text style={{ color: "#C3CC9B", fontSize: 18, paddingHorizontal: 4 }}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={filtered}
              keyExtractor={(p) => p.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    backgroundColor: item.stockQty === 0 ? "#f5f5f5" : "#fff",
                    borderRadius: 16,
                    padding: 14,
                    marginBottom: 8,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#E4DFB5",
                    opacity: item.stockQty === 0 ? 0.5 : 1,
                  }}
                  onPress={() => { if (item.stockQty > 0) { setSelected(item); setSearch(""); } }}
                  disabled={item.stockQty === 0}
                >
                  <View>
                    <Text style={{ color: "#2D3A1E", fontWeight: "700", fontSize: 15 }}>{item.name}</Text>
                    <Text style={{ color: item.isLowStock ? "#D97706" : "#C3CC9B", fontSize: 12, marginTop: 2 }}>
                      {t.sales.stock} {item.stockQty} {item.unit}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ color: "#9AB17A", fontWeight: "800", fontSize: 15 }}>
                      {item.sellPrice.toLocaleString()} so'm
                    </Text>
                    <Text style={{ color: "#C3CC9B", fontSize: 11 }}>
                      foyda: +{item.profit.toLocaleString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={{ color: "#C3CC9B", textAlign: "center", marginTop: 32, fontSize: 15 }}>
                  {search ? t.sales.noProduct : t.sales.searchProduct}
                </Text>
              }
            />
          </>
        ) : (
          <View style={{ gap: 12 }}>
            <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#E4DFB5" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#2D3A1E", fontWeight: "700", fontSize: 16 }}>{selected.name}</Text>
                <Text style={{ color: "#C3CC9B", fontSize: 13, marginTop: 2 }}>
                  {t.sales.stock} {selected.stockQty} {selected.unit} · {selected.sellPrice.toLocaleString()} so'm
                </Text>
              </View>
              <TouchableOpacity onPress={() => { setSelected(null); setQty("1"); }} style={{ padding: 4 }}>
                <Text style={{ color: "#C3CC9B", fontSize: 20 }}>✕</Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text style={{ color: "#5C7045", fontWeight: "700", marginBottom: 8 }}>{t.sales.qty}</Text>
              <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                <TouchableOpacity
                  style={{ width: 52, height: 64, backgroundColor: "#E4DFB5", borderRadius: 14, alignItems: "center", justifyContent: "center" }}
                  onPress={() => setQty(String(Math.max(1, qtyNum - 1)))}
                >
                  <Text style={{ fontSize: 26, color: "#5C7045", fontWeight: "700" }}>−</Text>
                </TouchableOpacity>
                <TextInput
                  style={{ flex: 1, backgroundColor: "#fff", borderRadius: 14, height: 64, fontSize: 32, textAlign: "center", fontWeight: "800", color: "#2D3A1E", borderWidth: 1, borderColor: "#E4DFB5" }}
                  keyboardType="numeric"
                  value={qty}
                  onChangeText={setQty}
                  selectTextOnFocus
                />
                <TouchableOpacity
                  style={{ width: 52, height: 64, backgroundColor: "#9AB17A", borderRadius: 14, alignItems: "center", justifyContent: "center" }}
                  onPress={() => setQty(String(qtyNum + 1))}
                >
                  <Text style={{ fontSize: 26, color: "#fff", fontWeight: "700" }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Foyda preview */}
            <View style={{ backgroundColor: "#E4DFB5", borderRadius: 16, padding: 16, gap: 8 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: "#7A9460" }}>{t.sales.totalAmount}</Text>
                <Text style={{ color: "#2D3A1E", fontWeight: "700" }}>{totalAmount.toLocaleString()} so'm</Text>
              </View>
              <View style={{ height: 1, backgroundColor: "#C3CC9B" }} />
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ color: "#5C7045", fontWeight: "700" }}>SOF FOYDA</Text>
                <Text style={{ color: "#5C7045", fontWeight: "800", fontSize: 20 }}>+{totalProfit.toLocaleString()} so'm</Text>
              </View>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: saving ? "#C3CC9B" : "#9AB17A",
                borderRadius: 16,
                height: 64,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#9AB17A",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.35,
                shadowRadius: 8,
                elevation: 5,
              }}
              onPress={handleSale}
              disabled={saving}
            >
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 20 }}>
                {saving ? "..." : `✓  ${t.sales.write}`}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
