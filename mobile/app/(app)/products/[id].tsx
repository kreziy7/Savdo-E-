import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { database } from "@/db";
import { useProduct } from "@/hooks/useProducts";
import { useT } from "@/hooks/useT";
import { Ionicons } from "@expo/vector-icons";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = useProduct(id);
  const t = useT();

  const [name, setName] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [stock, setStock] = useState("");
  const [saving, setSaving] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (product && !initialized.current) {
      setName(product.name);
      setBuyPrice(String(product.buyPrice));
      setSellPrice(String(product.sellPrice));
      setStock(String(product.stockQty));
      initialized.current = true;
    }
  }, [product]);

  if (!product || !initialized.current) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FBE8CE" }}>
        <Text style={{ color: "#C3CC9B" }}>Yuklanmoqda...</Text>
      </View>
    );
  }

  async function handleUpdate() {
    if (!product) return;
    setSaving(true);
    try {
      await database.write(async () => {
        await product.update((p) => {
          p.name = name.trim();
          p.buyPrice = Number(buyPrice);
          p.sellPrice = Number(sellPrice);
          p.stockQty = Number(stock);
          p.isSynced = false;
        });
      });
      router.back();
    } catch {
      Alert.alert("Xato", "Yangilashda xatolik");
    } finally {
      setSaving(false);
    }
  }

  function handleArchive() {
    Alert.alert(t.products.delete, t.products.confirmDelete, [
      { text: t.products.cancel, style: "cancel" },
      {
        text: t.products.delete,
        style: "destructive",
        onPress: async () => {
          await database.write(async () => {
            await product.update((p) => {
              p.archivedAt = Date.now();
              p.isSynced = false;
            });
          });
          router.back();
        },
      },
    ]);
  }

  const profit = Number(sellPrice) - Number(buyPrice);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FBE8CE" }} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={{ backgroundColor: "#FBE8CE", paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="chevron-back" size={20} color="#9AB17A" />
          <Text style={{ color: "#9AB17A", fontWeight: "600" }}>{t.products.cancel}</Text>
        </TouchableOpacity>
        <Text style={{ color: "#2D3A1E", fontSize: 18, fontWeight: "800" }}>{t.products.update}</Text>
        <TouchableOpacity onPress={handleArchive} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Ionicons name="trash" size={16} color="#EF4444" />
          <Text style={{ color: "#EF4444", fontSize: 13, fontWeight: "600" }}>{t.products.delete}</Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 14, paddingBottom: 40 }}>
        {[
          { label: t.products.name, value: name, setter: setName, numeric: false },
          { label: t.products.buyPrice, value: buyPrice, setter: setBuyPrice, numeric: true },
          { label: t.products.sellPrice, value: sellPrice, setter: setSellPrice, numeric: true },
          { label: t.products.stock, value: stock, setter: setStock, numeric: true },
        ].map(({ label, value, setter, numeric }) => (
          <View key={label}>
            <Text style={{ color: "#5C7045", fontWeight: "700", marginBottom: 6 }}>{label}</Text>
            <TextInput
              style={{ backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#E4DFB5", borderRadius: 14, paddingHorizontal: 14, height: 50, fontSize: 15, color: "#2D3A1E" }}
              value={value}
              onChangeText={setter}
              keyboardType={numeric ? "numeric" : "default"}
              placeholderTextColor="#C3CC9B"
            />
          </View>
        ))}

        {buyPrice && sellPrice && (
          <View style={{ backgroundColor: profit >= 0 ? "#E4DFB5" : "#FEE2E2", borderRadius: 16, padding: 16 }}>
            <Text style={{ color: profit >= 0 ? "#7A9460" : "#EF4444", fontSize: 12, fontWeight: "600" }}>
              {t.products.profit}
            </Text>
            <Text style={{ color: profit >= 0 ? "#5C7045" : "#EF4444", fontWeight: "800", fontSize: 24, marginTop: 2 }}>
              {profit >= 0 ? "+" : ""}{profit.toLocaleString()} so'm
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={{
            backgroundColor: saving ? "#C3CC9B" : "#9AB17A",
            borderRadius: 16,
            height: 56,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 8,
            shadowColor: "#9AB17A",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 8,
            elevation: 5,
          }}
          onPress={handleUpdate}
          disabled={saving}
        >
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 17 }}>
            {saving ? "..." : t.products.update}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
