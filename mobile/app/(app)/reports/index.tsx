import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useSales } from "@/hooks/useSales";
import { useT } from "@/hooks/useT";
import { TrendingUp, ShoppingCart, Package } from "lucide-react-native";

type Period = "today" | "week" | "month";

export default function ReportsScreen() {
  const [period, setPeriod] = useState<Period>("today");
  const sales = useSales(period);
  const t = useT();

  const revenue = sales.reduce((s, x) => s + x.totalAmount, 0);
  const profit = sales.reduce((s, x) => s + x.profit, 0);
  const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;

  const productMap: Record<string, { name: string; revenue: number; qty: number; profit: number }> = {};
  sales.forEach((s) => {
    if (!productMap[s.productName]) {
      productMap[s.productName] = { name: s.productName, revenue: 0, qty: 0, profit: 0 };
    }
    productMap[s.productName].revenue += s.totalAmount;
    productMap[s.productName].qty += s.qty;
    productMap[s.productName].profit += s.profit;
  });
  const topProducts = Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const PERIOD_LABELS: Record<Period, string> = {
    today: t.sales.filters.today,
    week: t.sales.filters.week,
    month: t.sales.filters.month,
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-white px-4 pt-14 pb-4">
        <Text className="text-2xl font-bold mb-3 text-gray-800">{t.reports.title}</Text>
        <View className="flex-row gap-2">
          {(["today", "week", "month"] as Period[]).map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => setPeriod(p)}
              className={`flex-1 py-2 rounded-lg ${period === p ? "bg-green-600" : "bg-gray-100"}`}
            >
              <Text className={`text-center text-sm font-medium ${period === p ? "text-white" : "text-gray-600"}`}>
                {PERIOD_LABELS[p]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="px-4 mt-4 gap-3 mb-8">
        {/* Asosiy 3 karta */}
        <View className="flex-row gap-3">
          <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center gap-1 mb-1">
              <ShoppingCart size={14} color="#9ca3af" />
              <Text className="text-gray-500 text-xs">{t.reports.totalRevenue}</Text>
            </View>
            <Text className="text-base font-bold text-gray-800">{revenue.toLocaleString()} so'm</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center gap-1 mb-1">
              <TrendingUp size={14} color="#16a34a" />
              <Text className="text-gray-500 text-xs">{t.reports.totalProfit}</Text>
            </View>
            <Text className="text-base font-bold text-green-600">{profit.toLocaleString()} so'm</Text>
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-gray-500 text-xs mb-1">{t.reports.salesCount}</Text>
            <Text className="text-2xl font-bold text-gray-800">{sales.length} ta</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-gray-500 text-xs mb-1">Margin</Text>
            <Text className={`text-2xl font-bold ${margin >= 20 ? "text-green-600" : "text-amber-500"}`}>
              {margin}%
            </Text>
          </View>
        </View>

        {/* Top 5 tovar */}
        <View className="bg-white rounded-xl p-4 shadow-sm">
          <View className="flex-row items-center gap-2 mb-3">
            <Package size={18} color="#16a34a" />
            <Text className="font-semibold text-gray-800">{t.reports.top5}</Text>
          </View>
          {topProducts.length === 0 ? (
            <Text className="text-gray-400 text-center py-4">{t.reports.noData}</Text>
          ) : (
            topProducts.map((p, i) => (
              <View key={p.name} className="flex-row items-center py-3 border-b border-gray-50">
                <View className={`w-6 h-6 rounded-full items-center justify-center mr-3 ${
                  i === 0 ? "bg-yellow-100" : i === 1 ? "bg-gray-100" : "bg-orange-50"
                }`}>
                  <Text className="text-xs font-bold">{i + 1}</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-gray-800">{p.name}</Text>
                  <Text className="text-gray-400 text-xs">{p.qty} ta sotildi</Text>
                </View>
                <View className="items-end">
                  <Text className="text-green-600 font-medium text-sm">
                    +{p.profit.toLocaleString()} so'm
                  </Text>
                  <Text className="text-gray-400 text-xs">{p.revenue.toLocaleString()} aylanma</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
