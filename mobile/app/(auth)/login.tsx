import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLangStore } from "@/store/langStore";
import { useT } from "@/hooks/useT";
import { dark } from "@/theme/colors";
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
  const c = dark;
  const isValid = phone.length >= 9;

  function handleLogin() {
    if (!isValid) return;
    router.push({ pathname: "/(auth)/verify", params: { phone } });
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
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
                backgroundColor: lang === l.code ? c.primary : "rgba(255,255,255,0.1)",
              }}
            >
              <Text style={{ color: lang === l.code ? "#fff" : c.primary, fontWeight: "700", fontSize: 12 }}>
                {l.flag} {l.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logo */}
        <View style={{ alignItems: "center" }}>
          <View style={{ width: 100, height: 100, backgroundColor: c.primary, borderRadius: 32, alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
            <Ionicons name="stats-chart" size={48} color="#fff" />
          </View>
          <Text style={{ color: c.text, fontSize: 36, fontWeight: "800", letterSpacing: -1 }}>Savdo</Text>
          <Text style={{ color: c.textSub, fontSize: 14, marginTop: 6 }}>{t.auth.appDesc}</Text>
        </View>
      </View>

      {/* Bottom sheet */}
      <View style={{ backgroundColor: c.bgCard, borderTopLeftRadius: 36, borderTopRightRadius: 36, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 48 }}>
        <Text style={{ color: c.text, fontSize: 22, fontWeight: "800", marginBottom: 20 }}>{t.auth.login}</Text>

        <Text style={{ color: c.primary, fontSize: 13, fontWeight: "600", marginBottom: 8 }}>{t.auth.phone}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: c.bg, borderRadius: 16, paddingHorizontal: 16, marginBottom: 20, borderWidth: 1.5, borderColor: c.border }}>
          <View style={{ marginRight: 10, paddingRight: 10, borderRightWidth: 1, borderRightColor: c.border }}>
            <Text style={{ color: c.primary, fontSize: 16, fontWeight: "700" }}>+998</Text>
          </View>
          <TextInput
            style={{ flex: 1, height: 58, fontSize: 20, color: c.text, fontWeight: "600", letterSpacing: 1 }}
            placeholder="90 123 45 67"
            placeholderTextColor={c.border}
            keyboardType="number-pad"
            maxLength={9}
            value={phone}
            onChangeText={setPhone}
          />
          {phone.length > 0 && (
            <TouchableOpacity onPress={() => setPhone("")}>
              <Ionicons name="close-circle" size={20} color={c.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: isValid ? c.primary : c.bgMuted,
            borderRadius: 16,
            height: 58,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 8,
            shadowColor: c.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isValid ? 0.4 : 0,
            shadowRadius: 8,
            elevation: isValid ? 6 : 0,
          }}
          onPress={handleLogin}
          disabled={!isValid}
        >
          <Ionicons name="arrow-forward" size={18} color={isValid ? "#fff" : c.border} />
          <Text style={{ color: isValid ? "#fff" : c.border, fontWeight: "800", fontSize: 17 }}>{t.auth.enter}</Text>
        </TouchableOpacity>

        <Text style={{ color: c.textSub, textAlign: "center", fontSize: 12, marginTop: 16 }}>{t.auth.demoNote}</Text>
      </View>
    </View>
  );
}
