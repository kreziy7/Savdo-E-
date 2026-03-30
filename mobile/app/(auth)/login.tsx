import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useAuthStore } from "@/store/authStore";
import { useLangStore } from "@/store/langStore";
import { useT } from "@/hooks/useT";
import { Lang } from "@/i18n";

const LANGS: { code: Lang; label: string }[] = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const setToken = useAuthStore((s) => s.setToken);
  const { lang, setLang } = useLangStore();
  const t = useT();

  async function handleLogin() {
    if (phone.length < 9) return;
    await setToken("demo-token", "demo-refresh");
  }

  return (
    <View className="flex-1 bg-white justify-center px-6">
      {/* Language selector */}
      <View className="absolute top-14 right-6 flex-row gap-2">
        {LANGS.map((l) => (
          <TouchableOpacity
            key={l.code}
            onPress={() => setLang(l.code)}
            className={`px-3 py-1 rounded-lg border ${
              lang === l.code
                ? "bg-green-600 border-green-600"
                : "bg-white border-gray-300"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                lang === l.code ? "text-white" : "text-gray-600"
              }`}
            >
              {l.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logo */}
      <View className="items-center mb-10">
        <View className="w-20 h-20 bg-green-600 rounded-2xl items-center justify-center mb-4">
          <Text className="text-white text-4xl font-bold">S</Text>
        </View>
        <Text className="text-3xl font-bold text-gray-800">Savdo</Text>
        <Text className="text-gray-500 mt-1">{t.auth.appDesc}</Text>
      </View>

      {/* Phone input */}
      <Text className="text-gray-600 font-medium mb-2">{t.auth.phone}</Text>
      <View className="flex-row items-center border border-gray-300 rounded-xl px-4 mb-4 bg-white">
        <Text className="text-gray-500 mr-2 text-base">+998</Text>
        <TextInput
          className="flex-1 h-14 text-lg"
          placeholder="90 123 45 67"
          keyboardType="number-pad"
          maxLength={9}
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      <TouchableOpacity
        className={`rounded-xl h-14 items-center justify-center ${
          phone.length >= 9 ? "bg-green-600" : "bg-gray-300"
        }`}
        onPress={handleLogin}
        disabled={phone.length < 9}
      >
        <Text className="text-white font-semibold text-lg">{t.auth.enter}</Text>
      </TouchableOpacity>

      <Text className="text-center text-gray-400 text-sm mt-6">{t.auth.demoNote}</Text>
    </View>
  );
}
