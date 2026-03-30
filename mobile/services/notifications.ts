import * as Notifications from "expo-notifications";
import { api } from "./api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications(): Promise<void> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return;

  const token = await Notifications.getExpoPushTokenAsync();
  await api.post("/user/push-token", { token: token.data });
}
