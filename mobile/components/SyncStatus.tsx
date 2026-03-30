/**
 * Sinxronizatsiya holati ko'rsatkichi.
 * Faqat pending yozuvlar bo'lsa yoki sync ishlayotganda ko'rinadi.
 */
import { View, Text } from "react-native";
import { useSyncStore } from "@/store/syncStore";

export function SyncStatus() {
  const { isSyncing, pendingCount } = useSyncStore();

  if (!isSyncing && pendingCount === 0) return null;

  return (
    <View className="flex-row items-center gap-1 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
      <Text className="text-amber-600 text-xs font-medium">
        {isSyncing ? "⟳ Sync..." : `⏳ ${pendingCount} kutmoqda`}
      </Text>
    </View>
  );
}
