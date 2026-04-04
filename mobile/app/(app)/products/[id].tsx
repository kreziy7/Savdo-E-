import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { database } from "@/db";
import { useProduct } from "@/hooks/useProducts";
import { useT } from "@/hooks/useT";
import { useTheme } from "@/hooks/useTheme";
import { useRoleStore } from "@/store/roleStore";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = useProduct(id);
  const t = useT();
  const { c } = useTheme();
  const { isAdmin } = useRoleStore();

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
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: c.bg }}>
        <Ionicons name="hourglass" size={32} color={c.border} />
        <Text style={{ color: c.textMuted, marginTop: 8 }}>{t.common.loading}</Text>
      </View>
    );
  }

  async function handleUpdate() {
    if (!product) return;
    if (!isAdmin()) {
      Alert.alert(t.employees.restricted, t.employees.adminOnly);
      return;
    }
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
      Alert.alert(t.common.error, t.common.saveError);
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
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={{ backgroundColor: c.bg, paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Ionicons name="chevron-back" size={20} color={c.primary} />
          <Text style={{ color: c.primary, fontWeight: "600" }}>{t.products.cancel}</Text>
        </TouchableOpacity>
        <Text style={{ color: c.text, fontSize: 18, fontWeight: "800" }}>{t.products.update}</Text>
        <TouchableOpacity onPress={handleArchive} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Ionicons name="trash" size={16} color={c.danger} />
          <Text style={{ color: c.danger, fontSize: 13, fontWeight: "600" }}>{t.products.delete}</Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 14, paddingBottom: 40 }}>
        {[
          { label: t.products.name,      value: name,      setter: setName,      numeric: false },
          { label: t.products.buyPrice,  value: buyPrice,  setter: setBuyPrice,  numeric: true },
          { label: t.products.sellPrice, value: sellPrice, setter: setSellPrice, numeric: true },
          { label: t.products.stock,     value: stock,     setter: setStock,     numeric: true },
        ].map(({ label, value, setter, numeric }) => (
          <View key={label}>
            <Text style={{ color: c.primaryDark, fontWeight: "700", marginBottom: 6 }}>{label}</Text>
            <TextInput
              style={{ backgroundColor: c.bgCard, borderWidth: 1.5, borderColor: c.border, borderRadius: 14, paddingHorizontal: 14, height: 50, fontSize: 15, color: c.text }}
              value={value}
              onChangeText={setter}
              keyboardType={numeric ? "numeric" : "default"}
              placeholderTextColor={c.border}
            />
          </View>
        ))}

        {buyPrice && sellPrice && (
          <View style={{ backgroundColor: profit >= 0 ? c.bgMuted : "#FEE2E2", borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons
              name={profit >= 0 ? "trending-up" : "trending-down"}
              size={20}
              color={profit >= 0 ? c.primaryDark : c.danger}
            />
            <View>
              <Text style={{ color: profit >= 0 ? c.accent : c.danger, fontSize: 12, fontWeight: "600" }}>
                {t.products.profit}
              </Text>
              <Text style={{ color: profit >= 0 ? c.primaryDark : c.danger, fontWeight: "800", fontSize: 24, marginTop: 2 }}>
                {profit >= 0 ? "+" : ""}{profit.toLocaleString()} so'm
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={{
            backgroundColor: saving ? c.border : c.primary,
            borderRadius: 16,
            height: 56,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 8,
            marginTop: 8,
            shadowColor: c.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 8,
            elevation: 5,
          }}
          onPress={handleUpdate}
          disabled={saving}
        >
          {saving ? (
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 17 }}>...</Text>
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 17 }}>{t.products.update}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
