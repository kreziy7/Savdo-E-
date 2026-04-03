import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useT } from "@/hooks/useT";
import { useTodayStats } from "@/hooks/useSales";
import { useTheme } from "@/hooks/useTheme";
import { SaleCard } from "@/components/SaleCard";
import { SyncStatus } from "@/components/SyncStatus";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const t = useT();
  const { revenue, profit, count, sales } = useTodayStats();
  const { c } = useTheme();
  const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={{ backgroundColor: c.primary, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 32, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: "600" }}>
              {new Date().toLocaleDateString("uz", { weekday: "long", day: "numeric", month: "long" })}
            </Text>
            <Text style={{ color: "#fff", fontSize: 24, fontWeight: "800", marginTop: 2 }}>{t.home.greeting}</Text>
          </View>
          <SyncStatus />
        </View>

        <View style={{ marginTop: 24, alignItems: "center" }}>
          <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, letterSpacing: 2, fontWeight: "700" }}>BUGUNGI TUSHUM</Text>
          <Text style={{ color: "#fff", fontSize: 44, fontWeight: "800", marginTop: 4, letterSpacing: -1 }}>
            {revenue.toLocaleString()}
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>so'm</Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 20, gap: 10 }}>
          <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 14, padding: 12, alignItems: "center" }}>
            <Ionicons name="trending-up" size={20} color="#fff" />
            <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 10, marginTop: 4, fontWeight: "600" }}>FOYDA</Text>
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "800" }}>{profit.toLocaleString()}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 14, padding: 12, alignItems: "center" }}>
            <Ionicons name="cart" size={20} color="#fff" />
            <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 10, marginTop: 4, fontWeight: "600" }}>SOTUVLAR</Text>
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "800" }}>{count} ta</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 14, padding: 12, alignItems: "center" }}>
            <Ionicons name="analytics" size={20} color="#fff" />
            <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 10, marginTop: 4, fontWeight: "600" }}>MARGIN</Text>
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "800" }}>{margin}%</Text>
          </View>
        </View>
      </View>

      {/* QUICK ACTIONS */}
      <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
        <Text style={{ color: c.text, fontSize: 16, fontWeight: "800", marginBottom: 12 }}>Tezkor amallar</Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            onPress={() => router.push("/(app)/sales/add")}
            style={{ flex: 1, backgroundColor: c.primary, borderRadius: 18, padding: 18, alignItems: "center" }}
          >
            <Ionicons name="cart" size={30} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "700", marginTop: 8, fontSize: 13 }}>Sotuv yozish</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(app)/products/add")}
            style={{ flex: 1, backgroundColor: c.bgCard, borderRadius: 18, padding: 18, alignItems: "center", borderWidth: 1.5, borderColor: c.border }}
          >
            <Ionicons name="cube" size={30} color={c.primary} />
            <Text style={{ color: c.text, fontWeight: "700", marginTop: 8, fontSize: 13 }}>Tovar qo'shish</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* RECENT SALES */}
      <View style={{ paddingHorizontal: 20, marginTop: 28, marginBottom: 32 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <Text style={{ color: c.text, fontSize: 16, fontWeight: "800" }}>{t.home.recentSales}</Text>
          <TouchableOpacity onPress={() => router.push("/(app)/sales")} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Text style={{ color: c.primary, fontSize: 13, fontWeight: "600" }}>Hammasi</Text>
            <Ionicons name="chevron-forward" size={14} color={c.primary} />
          </TouchableOpacity>
        </View>

        {sales.length === 0 ? (
          <View style={{ backgroundColor: c.bgCard, borderRadius: 18, padding: 36, alignItems: "center", borderWidth: 1, borderColor: c.border }}>
            <Text style={{ fontSize: 36, marginBottom: 10 }}>🛒</Text>
            <Text style={{ color: c.textMuted, fontSize: 15, fontWeight: "600" }}>{t.home.noSales}</Text>
            <Text style={{ color: c.textMuted, fontSize: 13, marginTop: 4, opacity: 0.7 }}>Birinchi sotuvni yozing</Text>
          </View>
        ) : (
          sales.slice(0, 8).map((s) => <SaleCard key={s.id} sale={s} />)
        )}
      </View>
    </ScrollView>
  );
}
