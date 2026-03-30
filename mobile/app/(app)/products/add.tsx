import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { database, productsCollection } from "@/db";
import { useT } from "@/hooks/useT";

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
    } catch (e) {
      Alert.alert("Xato", "Saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" keyboardShouldPersistTaps="handled">
      <View className="bg-white px-4 pt-14 pb-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Text className="text-green-600 text-base">← {t.products.cancel}</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">{t.products.addProduct}</Text>
      </View>

      <View className="px-4 mt-4 gap-4">
        <Field label={t.products.name} value={name} onChangeText={setName} placeholder="Masalan: Shakar" />
        <Field label={t.products.buyPrice} value={buyPrice} onChangeText={setBuyPrice} keyboardType="numeric" placeholder="0" />
        <Field label={t.products.sellPrice} value={sellPrice} onChangeText={setSellPrice} keyboardType="numeric" placeholder="0" />
        <Field label={t.products.stock} value={stock} onChangeText={setStock} keyboardType="numeric" placeholder="0" />

        <View>
          <Text className="text-gray-600 font-medium mb-2">{t.products.unit}</Text>
          <View className="flex-row flex-wrap gap-2">
            {UNIT_KEYS.map((u) => (
              <TouchableOpacity
                key={u}
                onPress={() => setUnit(u)}
                className={`px-4 py-2 rounded-lg border ${
                  unit === u ? "bg-green-600 border-green-600" : "bg-white border-gray-300"
                }`}
              >
                <Text className={unit === u ? "text-white font-medium" : "text-gray-700"}>
                  {t.products.units[u]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {profit !== null && (
          <View className="bg-green-50 rounded-xl p-4 border border-green-100">
            <Text className="text-gray-600 text-sm">{t.products.profit}</Text>
            <Text className={`font-bold text-xl ${profit >= 0 ? "text-green-600" : "text-red-500"}`}>
              {profit.toLocaleString()} so'm
            </Text>
          </View>
        )}
      </View>

      <View className="px-4 mt-6 mb-10">
        <TouchableOpacity
          className={`rounded-xl h-14 items-center justify-center ${saving ? "bg-gray-400" : "bg-green-600"}`}
          onPress={handleSave}
          disabled={saving}
        >
          <Text className="text-white font-semibold text-lg">
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
      <Text className="text-gray-600 font-medium mb-1">{label}</Text>
      <TextInput className="bg-white border border-gray-300 rounded-xl px-4 h-12 text-base" {...props} />
    </View>
  );
}
