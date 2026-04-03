import { Platform } from "react-native";

// expo-notifications Expo Go SDK 53+ da ishlamaydi — dinamik import ishlatamiz
export async function registerForPushNotifications(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Notifications = require("expo-notifications");
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") return;
    const token = await Notifications.getExpoPushTokenAsync();
    const { api } = require("./api");
    await api.post("/user/push-token", { token: token.data });
  } catch {
    // Expo Go da silent fail
  }
}
