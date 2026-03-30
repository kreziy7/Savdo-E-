import { View, Text, FlatList, TouchableOpacity, TextInput } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useProducts } from "@/hooks/useProducts";
import { useT } from "@/hooks/useT";
import { Plus, Search, AlertTriangle } from "lucide-react-native";

export default function ProductsScreen() {
  const [search, setSearch] = useState("");
  const products = useProducts(search);
  const t = useT();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-4 pt-14 pb-4">
        <Text className="text-2xl font-bold mb-3 text-gray-800">{t.products.title}</Text>
        <View className="flex-row items-center bg-gray-100 rounded-xl px-3">
          <Search size={18} color="#9ca3af" />
          <TextInput
            className="flex-1 h-11 ml-2 text-base"
            placeholder={t.products.search}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={products}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="items-center py-12">
            <Text className="text-gray-400">{t.products.noProducts}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-white rounded-xl p-4 mb-3 shadow-sm"
            onPress={() => router.push(`/(app)/products/${item.id}`)}
          >
            <View className="flex-row justify-between items-start">
              <Text className="font-semibold text-base text-gray-800 flex-1">{item.name}</Text>
              <View className="flex-row items-center gap-1">
                {item.isLowStock && <AlertTriangle size={14} color="#f59e0b" />}
                <Text className={`text-sm ${item.isLowStock ? "text-amber-500 font-semibold" : "text-gray-500"}`}>
                  {item.stockQty} {item.unit}
                </Text>
              </View>
            </View>
            <View className="flex-row justify-between mt-1">
              <Text className="text-gray-400 text-sm">
                {t.products.buyPrice.split(" (")[0]}: {item.buyPrice.toLocaleString()} so'm
              </Text>
              <Text className="text-green-600 font-medium text-sm">
                {t.products.sellPrice.split(" (")[0]}: {item.sellPrice.toLocaleString()} so'm
              </Text>
            </View>
            <View className="mt-1">
              <Text className="text-xs text-green-700">
                {t.products.profit} {item.profit.toLocaleString()} so'm
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        className="absolute bottom-8 right-6 bg-green-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push("/(app)/products/add")}
      >
        <Plus size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
