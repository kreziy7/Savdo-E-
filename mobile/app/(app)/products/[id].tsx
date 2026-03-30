import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { database } from "@/db";
import { useProduct } from "@/hooks/useProducts";
import { useT } from "@/hooks/useT";
import { Trash2 } from "lucide-react-native";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = useProduct(id);
  const t = useT();

  const [name, setName] = useState(product?.name ?? "");
  const [buyPrice, setBuyPrice] = useState(String(product?.buyPrice ?? ""));
  const [sellPrice, setSellPrice] = useState(String(product?.sellPrice ?? ""));
  const [stock, setStock] = useState(String(product?.stockQty ?? ""));
  const [saving, setSaving] = useState(false);

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-400">Yuklanmoqda...</Text>
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
    <ScrollView className="flex-1 bg-gray-50" keyboardShouldPersistTaps="handled">
      <View className="bg-white px-4 pt-14 pb-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-green-600 text-base">← {t.products.cancel}</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">{t.products.update}</Text>
        <TouchableOpacity onPress={handleArchive} className="flex-row items-center gap-1">
          <Trash2 size={16} color="#ef4444" />
          <Text className="text-red-500 text-sm">{t.products.delete}</Text>
        </TouchableOpacity>
      </View>

      <View className="px-4 mt-4 gap-4">
        {[
          { label: t.products.name, value: name, setter: setName, numeric: false },
          { label: t.products.buyPrice, value: buyPrice, setter: setBuyPrice, numeric: true },
          { label: t.products.sellPrice, value: sellPrice, setter: setSellPrice, numeric: true },
          { label: t.products.stock, value: stock, setter: setStock, numeric: true },
        ].map(({ label, value, setter, numeric }) => (
          <View key={label}>
            <Text className="text-gray-600 font-medium mb-1">{label}</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-xl px-4 h-12 text-base"
              value={value}
              onChangeText={setter}
              keyboardType={numeric ? "numeric" : "default"}
            />
          </View>
        ))}

        {buyPrice && sellPrice && (
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
          onPress={handleUpdate}
          disabled={saving}
        >
          <Text className="text-white font-semibold text-lg">
            {saving ? "..." : t.products.update}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
