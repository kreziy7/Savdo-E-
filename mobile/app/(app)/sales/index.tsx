import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useSales } from "@/hooks/useSales";
import { useT } from "@/hooks/useT";
import { Plus } from "lucide-react-native";

type Filter = "today" | "week" | "month";

export default function SalesScreen() {
  const [filter, setFilter] = useState<Filter>("today");
  const sales = useSales(filter);
  const t = useT();

  const totalRevenue = sales.reduce((s, x) => s + x.totalAmount, 0);
  const totalProfit = sales.reduce((s, x) => s + x.profit, 0);

  const FILTER_LABELS: Record<Filter, string> = {
    today: t.sales.filters.today,
    week: t.sales.filters.week,
    month: t.sales.filters.month,
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-4 pt-14 pb-4">
        <Text className="text-2xl font-bold mb-3 text-gray-800">{t.sales.title}</Text>
        <View className="flex-row gap-2">
          {(["today", "week", "month"] as Filter[]).map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              className={`flex-1 py-2 rounded-lg ${filter === f ? "bg-green-600" : "bg-gray-100"}`}
            >
              <Text className={`text-center text-sm font-medium ${filter === f ? "text-white" : "text-gray-600"}`}>
                {FILTER_LABELS[f]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {sales.length > 0 && (
          <View className="flex-row gap-3 mt-3">
            <View className="flex-1 bg-gray-50 rounded-lg p-2">
              <Text className="text-gray-400 text-xs">{t.home.todaySales}</Text>
              <Text className="font-bold text-sm">{totalRevenue.toLocaleString()} so'm</Text>
            </View>
            <View className="flex-1 bg-green-50 rounded-lg p-2">
              <Text className="text-gray-400 text-xs">{t.home.todayProfit}</Text>
              <Text className="font-bold text-sm text-green-600">{totalProfit.toLocaleString()} so'm</Text>
            </View>
          </View>
        )}
      </View>

      <FlatList
        data={sales}
        keyExtractor={(s) => s.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="items-center py-12">
            <Text className="text-gray-400">{t.sales.noSales}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
            <View className="flex-row justify-between">
              <Text className="font-semibold text-gray-800 flex-1">{item.productName}</Text>
              <Text className="text-green-600 font-medium">+{item.profit.toLocaleString()} so'm</Text>
            </View>
            <View className="flex-row justify-between mt-1">
              <Text className="text-gray-400 text-sm">
                {item.qty} × {item.sellPrice.toLocaleString()} so'm
              </Text>
              <Text className="text-gray-400 text-sm">
                {new Date(item.soldAt).toLocaleTimeString("uz", { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </View>
            {!item.isSynced && (
              <Text className="text-amber-500 text-xs mt-1">⏳ Sinxronlanmagan</Text>
            )}
          </View>
        )}
      />

      <TouchableOpacity
        className="absolute bottom-8 right-6 bg-green-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push("/(app)/sales/add")}
      >
        <Plus size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
