import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { useT } from "@/hooks/useT";
import { Ionicons } from "@expo/vector-icons";

const DEMO_CODE = "000000";

export default function VerifyScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const setToken = useAuthStore((s) => s.setToken);
  const t = useT();

  async function handleVerify() {
    if (code.length !== 6) return;
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

  function enterDemo() {
    setToken("demo-token", "demo-refresh");
  }

  return (
    <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "#9AB17A" }}>
      {/* Top */}
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 56, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: "absolute", top: 56, left: 24, flexDirection: "row", alignItems: "center" }}
        >
          <Ionicons name="chevron-back" size={20} color="#FBE8CE" />
          <Text style={{ color: "#FBE8CE", fontWeight: "600" }}>Orqaga</Text>
        </TouchableOpacity>

        <View style={{ width: 72, height: 72, backgroundColor: "#FBE8CE", borderRadius: 36, alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <Text style={{ fontSize: 36 }}>📱</Text>
        </View>
        <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800", textAlign: "center" }}>SMS kod</Text>
        <Text style={{ color: "#E4DFB5", fontSize: 14, marginTop: 6, textAlign: "center" }}>
          +998{phone} {t.auth.codeSent}
        </Text>
      </View>

      {/* Bottom card */}
      <View style={{ backgroundColor: "#FBE8CE", borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 24, paddingTop: 28, paddingBottom: 40 }}>
        <TextInput
          style={{
            backgroundColor: "#fff",
            borderWidth: 2,
            borderColor: "#C3CC9B",
            borderRadius: 16,
            height: 68,
            fontSize: 36,
            textAlign: "center",
            letterSpacing: 12,
            fontWeight: "800",
            color: "#2D3A1E",
            marginBottom: 16,
          }}
          placeholder="------"
          placeholderTextColor="#C3CC9B"
          keyboardType="number-pad"
          maxLength={6}
          value={code}
          onChangeText={setCode}
          autoFocus
        />

        <TouchableOpacity
          style={{
            backgroundColor: code.length === 6 ? "#9AB17A" : "#C3CC9B",
            borderRadius: 16,
            height: 56,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
          onPress={handleVerify}
          disabled={loading || code.length !== 6}
        >
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 17 }}>
            {loading ? t.auth.checking : t.auth.enter}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: "#C3CC9B" }} />
          <Text style={{ color: "#9AB17A", marginHorizontal: 12, fontSize: 13 }}>yoki</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: "#C3CC9B" }} />
        </View>

        {/* Demo kirish */}
        <TouchableOpacity
          style={{
            backgroundColor: "#E4DFB5",
            borderRadius: 16,
            height: 52,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1.5,
            borderColor: "#C3CC9B",
          }}
          onPress={enterDemo}
        >
          <Text style={{ color: "#5C7045", fontWeight: "700", fontSize: 15 }}>
            🚀 Demo rejimda kirish
          </Text>
        </TouchableOpacity>

        <Text style={{ color: "#9AB17A", textAlign: "center", fontSize: 12, marginTop: 12 }}>
          Demo uchun kod: <Text style={{ fontWeight: "800" }}>000000</Text>
        </Text>
      </View>
    </View>
  );
}
