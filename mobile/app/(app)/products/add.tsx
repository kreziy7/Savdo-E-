import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { database, productsCollection } from "@/db";
import { useT } from "@/hooks/useT";
import { Ionicons } from "@expo/vector-icons";

const UNIT_KEYS = ["kg", "dona", "litr", "metr", "paket", "quti"] as const;
type UnitKey = typeof UNIT_KEYS[number];

export default function AddProductScreen() {
  const t = useT();
  const [name, setName] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState<UnitKey>("dona");
  const [saving, setSaving] = useState(false);

  const profit = buyPrice && sellPrice ? Number(sellPrice) - Number(buyPrice) : null;

  async function handleSave() {
    if (!name.trim() || !buyPrice || !sellPrice) {
      Alert.alert("Xato", "Nomi, xarid va sotuv narxini kiriting");
      return;
    }
    setSaving(true);
    try {
      await database.write(async () => {
        await productsCollection.create((p) => {
          p.name = name.trim();
          p.buyPrice = Number(buyPrice);
          p.sellPrice = Number(sellPrice);
          p.stockQty = Number(stock) || 0;
          p.unit = unit;
          p.archivedAt = null;
          p.isSynced = false;
          p.serverId = null;
        });
      });
      router.back();
    } catch {
      Alert.alert("Xato", "Saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FBE8CE" }} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={{ backgroundColor: "#FBE8CE", paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
          <Ionicons name="chevron-back" size={20} color="#9AB17A" />
          <Text style={{ color: "#9AB17A", fontWeight: "600", fontSize: 14 }}>{t.products.cancel}</Text>
        </TouchableOpacity>
        <Text style={{ color: "#2D3A1E", fontSize: 26, fontWeight: "800" }}>{t.products.addProduct}</Text>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 14, paddingBottom: 40 }}>
        <Field label={t.products.name} value={name} onChangeText={setName} placeholder="Masalan: Shakar" />
        <Field label={t.products.buyPrice} value={buyPrice} onChangeText={setBuyPrice} keyboardType="numeric" placeholder="0" />
        <Field label={t.products.sellPrice} value={sellPrice} onChangeText={setSellPrice} keyboardType="numeric" placeholder="0" />
        <Field label={t.products.stock} value={stock} onChangeText={setStock} keyboardType="numeric" placeholder="0" />

        {/* Unit */}
        <View>
          <Text style={{ color: "#5C7045", fontWeight: "700", marginBottom: 8 }}>{t.products.unit}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {UNIT_KEYS.map((u) => (
              <TouchableOpacity
                key={u}
                onPress={() => setUnit(u)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 12,
                  backgroundColor: unit === u ? "#9AB17A" : "#E4DFB5",
                }}
              >
                <Text style={{ color: unit === u ? "#fff" : "#5C7045", fontWeight: "700" }}>
                  {t.products.units[u]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Profit preview */}
        {profit !== null && (
          <View style={{ backgroundColor: profit >= 0 ? "#E4DFB5" : "#FEE2E2", borderRadius: 16, padding: 14 }}>
            <Text style={{ color: profit >= 0 ? "#7A9460" : "#EF4444", fontSize: 12, fontWeight: "600" }}>
              {t.products.profit}
            </Text>
            <Text style={{ color: profit >= 0 ? "#5C7045" : "#EF4444", fontWeight: "800", fontSize: 22, marginTop: 2 }}>
              {profit >= 0 ? "+" : ""}{profit.toLocaleString()} so'm
            </Text>
          </View>
        )}

        {/* Save */}
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
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 17 }}>
            {saving ? "..." : t.products.save}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function Field({ label, ...props }: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View>
      <Text style={{ color: "#5C7045", fontWeight: "700", marginBottom: 6 }}>{label}</Text>
      <TextInput
        style={{
          backgroundColor: "#fff",
          borderWidth: 1.5,
          borderColor: "#E4DFB5",
          borderRadius: 14,
          paddingHorizontal: 14,
          height: 50,
          fontSize: 15,
          color: "#2D3A1E",
        }}
        placeholderTextColor="#C3CC9B"
        {...props}
      />
    </View>
  );
}
