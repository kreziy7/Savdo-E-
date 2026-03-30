import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { Globe, CreditCard, LogOut, ChevronRight, Check } from "lucide-react-native";
import { useAuthStore } from "@/store/authStore";
import { useLangStore } from "@/store/langStore";
import { useT } from "@/hooks/useT";
import { Lang } from "@/i18n";

const LANGS: { code: Lang; label: string; native: string }[] = [
  { code: "uz", label: "UZ", native: "O'zbek" },
  { code: "ru", label: "RU", native: "Русский" },
  { code: "en", label: "EN", native: "English" },
];

export default function SettingsScreen() {
  const clearToken = useAuthStore((s) => s.clearToken);
  const { lang, setLang } = useLangStore();
  const t = useT();

  function handleLogout() {
    Alert.alert(t.settings.logout, "Chiqmoqchimisiz?", [
      { text: t.products.cancel, style: "cancel" },
      {
        text: t.settings.logout,
        style: "destructive",
        onPress: () => clearToken(),
      },
    ]);
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 pt-14 pb-4">
        <Text className="text-2xl font-bold text-gray-800">{t.settings.title}</Text>
      </View>

      {/* Language section */}
      <View className="px-4 mt-6">
        <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">
          {t.settings.language}
        </Text>
        <View className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {LANGS.map((l, idx) => (
            <TouchableOpacity
              key={l.code}
              className={`flex-row items-center px-4 py-4 ${
                idx < LANGS.length - 1 ? "border-b border-gray-100" : ""
              }`}
              onPress={() => setLang(l.code)}
            >
              <View className="w-9 h-9 bg-green-50 rounded-full items-center justify-center mr-3">
                <Globe size={18} color="#16a34a" />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-800">{l.native}</Text>
                <Text className="text-xs text-gray-400">{l.label}</Text>
              </View>
              {lang === l.code && <Check size={20} color="#16a34a" />}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Subscription section */}
      <View className="px-4 mt-6">
        <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">
          {t.settings.subscription}
        </Text>
        <View className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <TouchableOpacity
            className="flex-row items-center px-4 py-4"
            onPress={() => router.push("/(app)/settings/subscription")}
          >
            <View className="w-9 h-9 bg-green-50 rounded-full items-center justify-center mr-3">
              <CreditCard size={18} color="#16a34a" />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-gray-800">{t.settings.subscription}</Text>
              <Text className="text-xs text-gray-400">{t.subscription.free} — {t.subscription.active}</Text>
            </View>
            <ChevronRight size={18} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Account section */}
      <View className="px-4 mt-6">
        <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">
          Akkaunt
        </Text>
        <View className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <TouchableOpacity
            className="flex-row items-center px-4 py-4"
            onPress={handleLogout}
          >
            <View className="w-9 h-9 bg-red-50 rounded-full items-center justify-center mr-3">
              <LogOut size={18} color="#ef4444" />
            </View>
            <Text className="flex-1 font-medium text-red-500">{t.settings.logout}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* App version */}
      <View className="items-center mt-10 mb-8">
        <Text className="text-gray-400 text-sm">{t.settings.version} 1.0.0</Text>
        <Text className="text-gray-300 text-xs mt-1">Savdo App \u00a9 2024</Text>
      </View>
    </ScrollView>
  );
}
