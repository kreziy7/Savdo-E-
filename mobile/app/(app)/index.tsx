import { View, Text, ScrollView } from "react-native";
import { useT } from "@/hooks/useT";
import { useTodayStats } from "@/hooks/useSales";
import { SaleCard } from "@/components/SaleCard";
import { SyncStatus } from "@/components/SyncStatus";

export default function HomeScreen() {
  const t = useT();
  const { revenue, profit, count, sales } = useTodayStats();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-green-600 px-6 pt-14 pb-8">
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="text-white text-2xl font-bold">{t.home.greeting}</Text>
            <Text className="text-green-100 text-sm mt-1">Savdo</Text>
          </View>
          <View className="mt-1">
            <SyncStatus />
          </View>
        </View>
      </View>

      <View className="flex-row gap-3 px-4 mt-4">
        <StatCard label={t.home.todaySales} value={`${revenue.toLocaleString()} so'm`} />
        <StatCard label={t.home.todayProfit} value={`${profit.toLocaleString()} so'm`} accent />
      </View>

      <View className="px-4 mt-2">
        <StatCard label={t.home.salesCount} value={`${count} ta`} />
      </View>

      <View className="px-4 mt-6 mb-8">
        <Text className="text-lg font-semibold mb-3 text-gray-800">{t.home.recentSales}</Text>
        {sales.length === 0 ? (
          <View className="bg-white rounded-xl p-8 items-center">
            <Text className="text-gray-400">{t.home.noSales}</Text>
          </View>
        ) : (
          sales.slice(0, 10).map((s) => <SaleCard key={s.id} sale={s} />)
        )}
      </View>
    </ScrollView>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
      <Text className="text-gray-500 text-xs mb-1">{label}</Text>
      <Text className={`text-lg font-bold ${accent ? "text-green-600" : "text-gray-800"}`}>
        {value}
      </Text>
    </View>
  );
}
