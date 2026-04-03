import { useEffect, useState } from "react";
import { AppState, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "@/store/authStore";
import { useLangStore } from "@/store/langStore";
import { useThemeStore } from "@/store/themeStore";
import { runSync } from "@/services/syncEngine";
import "../global.css";

export default function RootLayout() {
  const { token, loadToken } = useAuthStore();
  const loadLang = useLangStore((s) => s.loadLang);
  const loadTheme = useThemeStore((s) => s.loadTheme);
  const isDark = useThemeStore((s) => s.isDark);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([loadToken(), loadLang(), loadTheme()]).then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!token) return;
    runSync();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") runSync();
    });
    return () => sub.remove();
  }, [token]);

  if (!ready) return <View style={{ flex: 1, backgroundColor: "#1B211A" }} />;

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
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
