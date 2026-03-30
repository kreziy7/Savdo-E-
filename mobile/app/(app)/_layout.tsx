import { useEffect } from "react";
import { Tabs } from "expo-router";
import { Home, Package, ShoppingCart, BarChart2, Settings } from "lucide-react-native";
import { useT } from "@/hooks/useT";
import { useLowStockCount } from "@/hooks/useProducts";
import { registerForPushNotifications } from "@/services/notifications";

export default function AppLayout() {
  const t = useT();
  const lowStockCount = useLowStockCount();

  useEffect(() => {
    registerForPushNotifications().catch(() => {
      // Push ruxsat berilmasa — muammo emas, davom etaveradi
    });
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#16a34a",
        tabBarInactiveTintColor: "#9ca3af",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.nav.home,
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: t.nav.products,
          tabBarIcon: ({ color, size }) => <Package size={size} color={color} />,
          tabBarBadge: lowStockCount > 0 ? lowStockCount : undefined,
        }}
      />
      <Tabs.Screen
        name="sales"
        options={{
          title: t.nav.sales,
          tabBarIcon: ({ color, size }) => <ShoppingCart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: t.nav.reports,
          tabBarIcon: ({ color, size }) => <BarChart2 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t.nav.settings,
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
