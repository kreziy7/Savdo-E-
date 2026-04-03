import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useLangStore } from "@/store/langStore";
import { useT } from "@/hooks/useT";
import { Lang } from "@/i18n";

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "uz", label: "UZ", flag: "🇺🇿" },
  { code: "ru", label: "RU", flag: "🇷🇺" },
  { code: "en", label: "EN", flag: "🇬🇧" },
];

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const { lang, setLang } = useLangStore();
  const t = useT();
  const isValid = phone.length >= 9;

  function handleLogin() {
    if (!isValid) return;
    router.push({ pathname: "/(auth)/verify", params: { phone } });
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#1B211A" }}>
      {/* Top background */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
        {/* Lang */}
        <View style={{ position: "absolute", top: 56, right: 20, flexDirection: "row", gap: 8 }}>
          {LANGS.map((l) => (
            <TouchableOpacity
              key={l.code}
              onPress={() => setLang(l.code)}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 10,
                backgroundColor: lang === l.code ? "#8BAE66" : "rgba(255,255,255,0.1)",
              }}
            >
              <Text style={{ color: lang === l.code ? "#fff" : "#8BAE66", fontWeight: "700", fontSize: 12 }}>
                {l.flag} {l.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logo */}
        <View style={{ alignItems: "center" }}>
          <View style={{ width: 100, height: 100, backgroundColor: "#8BAE66", borderRadius: 32, alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
            <Text style={{ fontSize: 48 }}>📊</Text>
          </View>
          <Text style={{ color: "#EBD5AB", fontSize: 36, fontWeight: "800", letterSpacing: -1 }}>Savdo</Text>
          <Text style={{ color: "#628141", fontSize: 14, marginTop: 6 }}>{t.auth.appDesc}</Text>
        </View>
      </View>

      {/* Bottom sheet */}
      <View style={{ backgroundColor: "#253020", borderTopLeftRadius: 36, borderTopRightRadius: 36, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 48 }}>
        <Text style={{ color: "#EBD5AB", fontSize: 22, fontWeight: "800", marginBottom: 20 }}>Kirish</Text>

        <Text style={{ color: "#8BAE66", fontSize: 13, fontWeight: "600", marginBottom: 8 }}>{t.auth.phone}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#1B211A", borderRadius: 16, paddingHorizontal: 16, marginBottom: 20, borderWidth: 1.5, borderColor: "#3A5030" }}>
          <View style={{ marginRight: 10, paddingRight: 10, borderRightWidth: 1, borderRightColor: "#3A5030" }}>
            <Text style={{ color: "#8BAE66", fontSize: 16, fontWeight: "700" }}>+998</Text>
          </View>
          <TextInput
            style={{ flex: 1, height: 58, fontSize: 20, color: "#EBD5AB", fontWeight: "600", letterSpacing: 1 }}
            placeholder="90 123 45 67"
            placeholderTextColor="#3A5030"
            keyboardType="number-pad"
            maxLength={9}
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TouchableOpacity
          style={{ backgroundColor: isValid ? "#8BAE66" : "#2E3D28", borderRadius: 16, height: 58, alignItems: "center", justifyContent: "center", shadowColor: "#8BAE66", shadowOffset: { width: 0, height: 4 }, shadowOpacity: isValid ? 0.4 : 0, shadowRadius: 8, elevation: isValid ? 6 : 0 }}
          onPress={handleLogin}
          disabled={!isValid}
        >
          <Text style={{ color: isValid ? "#fff" : "#3A5030", fontWeight: "800", fontSize: 17 }}>{t.auth.enter}</Text>
        </TouchableOpacity>

        <Text style={{ color: "#628141", textAlign: "center", fontSize: 12, marginTop: 16 }}>{t.auth.demoNote}</Text>
      </View>
    </View>
  );
}
