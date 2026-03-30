import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/authStore";

export default function VerifyScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const setToken = useAuthStore((s) => s.setToken);

  async function handleVerify() {
    if (code.length !== 6) return;
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", {
        phone: `+998${phone}`,
        code,
      });
      setToken(res.data.accessToken, res.data.refreshToken);
      router.replace("/(app)");
    } catch {
      Alert.alert("Xato", "Kod noto'g'ri yoki muddati o'tgan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-white justify-center px-6">
      <TouchableOpacity onPress={() => router.back()} className="mb-6">
        <Text className="text-primary-600">← Orqaga</Text>
      </TouchableOpacity>

      <Text className="text-2xl font-bold mb-2">SMS kod</Text>
      <Text className="text-gray-500 mb-8">+998{phone} ga yuborildi</Text>

      <TextInput
        className="border border-gray-300 rounded-xl px-4 h-14 text-2xl text-center tracking-widest mb-4"
        placeholder="------"
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={setCode}
      />

      <TouchableOpacity
        className="bg-primary-600 rounded-xl h-14 items-center justify-center"
        onPress={handleVerify}
        disabled={loading}
      >
        <Text className="text-white font-semibold text-lg">
          {loading ? "Tekshirilmoqda..." : "Kirish"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
