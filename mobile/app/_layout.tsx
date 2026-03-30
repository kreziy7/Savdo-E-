/**
 * Root layout — ilova kirish nuqtasi.
 *
 * Muammolar hal qilingan:
 *  1. Auth flicker: token MMKV dan yuklanguncha blank ekran ko'rsatiladi
 *     (auth ekraniga noto'g'ri flash bo'lmaydi).
 *  2. Sync: token bor bo'lsa, app foreground'ga kelganda sync ishga tushadi.
 */
import { useEffect, useState } from "react";
import { AppState, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "@/store/authStore";
import { useLangStore } from "@/store/langStore";
import { runSync } from "@/services/syncEngine";
import "../global.css";

export default function RootLayout() {
  const { token, loadToken } = useAuthStore();
  const loadLang = useLangStore((s) => s.loadLang);
  const [ready, setReady] = useState(false);

  // MMKV sinxron — bir render ichida token + til yuklanadi
  useEffect(() => {
    loadToken();
    loadLang();
    setReady(true);
  }, []);

  // Sync: app ochilganda va foreground'ga kelganda
  useEffect(() => {
    if (!token) return;
    runSync();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") runSync();
    });
    return () => sub.remove();
  }, [token]);

  // Hali yuklanmagan — blank (auth ekraniga noto'g'ri flash oldini olish)
  if (!ready) return <View className="flex-1 bg-white" />;

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        {token ? (
          <Stack.Screen name="(app)" />
        ) : (
          <Stack.Screen name="(auth)" />
        )}
      </Stack>
    </>
  );
}
