import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { useT } from "@/hooks/useT";

// Demo rejim: "000000" kodi bilan kirish (backend yo'q paytida)
const DEMO_CODE = "000000";

export default function VerifyScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const setToken = useAuthStore((s) => s.setToken);
  const t = useT();

  async function handleVerify() {
    if (code.length !== 6) return;

    // Demo rejim
    if (code === DEMO_CODE) {
      setToken("demo-token", "demo-refresh");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", {
        phone: `+998${phone}`,
        code,
      });
      setToken(res.data.accessToken, res.data.refreshToken);
    } catch {
      Alert.alert("Xato", "Kod noto'g'ri yoki muddati o'tgan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-white justify-center px-6">
      <TouchableOpacity onPress={() => router.back()} className="mb-6">
        <Text className="text-green-600 text-base">← {t.products.cancel}</Text>
      </TouchableOpacity>

      <Text className="text-2xl font-bold mb-2 text-gray-800">SMS kod</Text>
      <Text className="text-gray-500 mb-8">+998{phone} {t.auth.codeSent}</Text>

      <TextInput
        className="border border-gray-300 rounded-xl px-4 h-16 text-3xl text-center tracking-widest mb-4 font-bold"
        placeholder="------"
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={setCode}
        autoFocus
      />

      <TouchableOpacity
        className={`rounded-xl h-14 items-center justify-center ${
          code.length === 6 ? "bg-green-600" : "bg-gray-300"
        }`}
        onPress={handleVerify}
        disabled={loading || code.length !== 6}
      >
        <Text className="text-white font-semibold text-lg">
          {loading ? t.auth.checking : t.auth.enter}
        </Text>
      </TouchableOpacity>

      <Text className="text-center text-gray-400 text-xs mt-5">{t.auth.demoNote2}</Text>
    </View>
  );
}
