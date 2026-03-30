import { View, Text } from "react-native";
import { Sale } from "@/db/models/Sale";

export function SaleCard({ sale }: { sale: Sale }) {
  return (
    <View className="bg-white rounded-xl p-4 mb-2 shadow-sm flex-row justify-between items-center">
      <View className="flex-1">
        <Text className="font-medium text-gray-800">{sale.productName}</Text>
        <Text className="text-gray-400 text-sm">
          {sale.qty} × {sale.sellPrice.toLocaleString()} so'm
        </Text>
      </View>
      <View className="items-end">
        <Text className="text-green-600 font-semibold">+{sale.profit.toLocaleString()} so'm</Text>
        <Text className="text-gray-400 text-xs">
          {new Date(sale.soldAt).toLocaleTimeString("uz", { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
    </View>
  );
}
