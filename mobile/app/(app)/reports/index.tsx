import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useSales } from "@/hooks/useSales";
import { useT } from "@/hooks/useT";
import { useTheme } from "@/hooks/useTheme";

type Period = "today" | "week" | "month";

export default function ReportsScreen() {
  const [period, setPeriod] = useState<Period>("today");
  const sales = useSales(period);
  const t = useT();
  const { c } = useTheme();

  const revenue = sales.reduce((s, x) => s + x.totalAmount, 0);
  const profit = sales.reduce((s, x) => s + x.profit, 0);
  const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;

  const productMap: Record<string, { name: string; revenue: number; qty: number; profit: number }> = {};
  sales.forEach((s) => {
    if (!productMap[s.productName]) productMap[s.productName] = { name: s.productName, revenue: 0, qty: 0, profit: 0 };
    productMap[s.productName].revenue += s.totalAmount;
    productMap[s.productName].qty += s.qty;
    productMap[s.productName].profit += s.profit;
  });
  const topProducts = Object.values(productMap).sort((a, b) => b.profit - a.profit).slice(0, 5);

  const FILTERS: { key: Period; label: string }[] = [
    { key: "today", label: t.sales.filters.today },
    { key: "week", label: t.sales.filters.week },
    { key: "month", label: t.sales.filters.month },
  ];

  const maxProfit = topProducts[0]?.profit || 1;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: c.bg, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12 }}>
        <Text style={{ color: c.text, fontSize: 28, fontWeight: "800", marginBottom: 14 }}>{t.reports.title}</Text>
        <View style={{ flexDirection: "row", backgroundColor: c.bgMuted, borderRadius: 14, padding: 4 }}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              onPress={() => setPeriod(f.key)}
              style={{ flex: 1, paddingVertical: 8, borderRadius: 11, backgroundColor: period === f.key ? c.primary : "transparent", alignItems: "center" }}
            >
              <Text style={{ color: period === f.key ? "#fff" : c.textSub, fontSize: 13, fontWeight: "700" }}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ paddingHorizontal: 20, paddingBottom: 40, gap: 12 }}>
        {/* Big stats */}
        <View style={{ backgroundColor: c.primary, borderRadius: 22, padding: 22 }}>
          <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, fontWeight: "700", letterSpacing: 1.5 }}>TUSHUM</Text>
          <Text style={{ color: "#fff", fontSize: 36, fontWeight: "800", marginTop: 2, letterSpacing: -1 }}>
            {revenue.toLocaleString()}
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>so'm</Text>
          <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.2)", marginVertical: 16 }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, fontWeight: "600" }}>SOF FOYDA</Text>
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 20 }}>+{profit.toLocaleString()} so'm</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, fontWeight: "600" }}>SOTUVLAR</Text>
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 20 }}>{sales.length} ta</Text>
            </View>
          </View>
        </View>

        {/* Margin */}
        <View style={{ backgroundColor: c.bgCard, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: c.border }}>
          <Text style={{ color: c.textMuted, fontSize: 12, fontWeight: "600" }}>RENTABELLIK (MARGIN)</Text>
          <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8, marginTop: 8 }}>
            <Text style={{ color: margin >= 20 ? c.primary : c.warn, fontSize: 40, fontWeight: "800" }}>{margin}%</Text>
            <Text style={{ color: c.textMuted, fontSize: 14, marginBottom: 6 }}>{margin >= 20 ? "🟢 Yaxshi" : "🟡 Past"}</Text>
          </View>
          {/* Bar */}
          <View style={{ height: 8, backgroundColor: c.bgMuted, borderRadius: 4, marginTop: 8 }}>
            <View style={{ height: 8, backgroundColor: margin >= 20 ? c.primary : c.warn, borderRadius: 4, width: `${Math.min(margin, 100)}%` }} />
          </View>
        </View>

        {/* Top products */}
        {topProducts.length > 0 && (
          <View style={{ backgroundColor: c.bgCard, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: c.border }}>
            <Text style={{ color: c.text, fontSize: 16, fontWeight: "800", marginBottom: 16 }}>🏆 {t.reports.top5}</Text>
            {topProducts.map((p, i) => (
              <View key={p.name} style={{ marginBottom: i < topProducts.length - 1 ? 16 : 0 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
                    <Text style={{ fontSize: 18 }}>{"🥇🥈🥉🏅🏅"[i]}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: c.text, fontWeight: "700", fontSize: 14 }}>{p.name}</Text>
                      <Text style={{ color: c.textMuted, fontSize: 12 }}>{p.qty} ta · {p.revenue.toLocaleString()} so'm</Text>
                    </View>
                  </View>
                  <Text style={{ color: c.primary, fontWeight: "800", fontSize: 14 }}>+{p.profit.toLocaleString()}</Text>
                </View>
                {/* Progress bar */}
                <View style={{ height: 5, backgroundColor: c.bgMuted, borderRadius: 3 }}>
                  <View style={{ height: 5, backgroundColor: c.primary, borderRadius: 3, width: `${(p.profit / maxProfit) * 100}%`, opacity: 0.4 + (0.6 * (1 - i / 5)) }} />
                </View>
              </View>
            ))}
          </View>
        )}

        {topProducts.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>📊</Text>
            <Text style={{ color: c.textMuted, fontSize: 16, fontWeight: "600" }}>{t.reports.noData}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
