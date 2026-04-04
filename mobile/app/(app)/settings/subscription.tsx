import { View, Text, ScrollView, TouchableOpacity, Alert, Linking } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useT } from "@/hooks/useT";
import { useTheme } from "@/hooks/useTheme";
import { useSubscriptionStore, Plan } from "@/store/subscriptionStore";

type PlanKey = Plan;

interface PlanConfig {
  key: PlanKey;
  price: string;
  color: string;
  bgColor: string;
  borderColor: string;
  paymeUrl?: string;
  clickUrl?: string;
}

const PLANS: PlanConfig[] = [
  { key: "free",   price: "Bepul",  color: "#6b7280", bgColor: "#f9fafb", borderColor: "#e5e7eb" },
  { key: "pro",    price: "24,900", color: "#16a34a", bgColor: "#f0fdf4", borderColor: "#16a34a",
    paymeUrl: "https://payme.uz/checkout/pro-plan",
    clickUrl: "https://my.click.uz/services/pay?service_id=pro_plan",
  },
  { key: "biznes", price: "49,900", color: "#7c3aed", bgColor: "#faf5ff", borderColor: "#7c3aed",
    paymeUrl: "https://payme.uz/checkout/biznes-plan",
    clickUrl: "https://my.click.uz/services/pay?service_id=biznes_plan",
  },
];

export default function SubscriptionScreen() {
  const t = useT();
  const { c } = useTheme();
  const { plan: currentPlan, upgrade, expiresAt } = useSubscriptionStore();

  function handleUpgrade(planConfig: PlanConfig) {
    if (planConfig.key === "free") return;
    Alert.alert(
      t.subscription.upgrade,
      t.subscription.demoNote,
      [
        { text: t.common.cancel, style: "cancel" },
        {
          text: "Payme",
          onPress: () => {
            // Demo rejimda: local subscription 30 kun
            upgrade(planConfig.key, 30);
            Alert.alert(t.subscription.active, `${planConfig.key.toUpperCase()} 30 kun faollashtirildi (demo)`);
          },
        },
        {
          text: "Click",
          onPress: () => {
            upgrade(planConfig.key, 30);
            Alert.alert(t.subscription.active, `${planConfig.key.toUpperCase()} 30 kun faollashtirildi (demo)`);
          },
        },
      ]
    );
  }

  const featuresMap: Record<PlanKey, string[]> = {
    free:   t.subscription.freeFeatures,
    pro:    t.subscription.proFeatures,
    biznes: t.subscription.biznesFeatures,
  };

  const nameMap: Record<PlanKey, string> = {
    free:   t.subscription.free,
    pro:    t.subscription.pro,
    biznes: t.subscription.biznes,
  };

  const expiryText = expiresAt
    ? new Date(expiresAt).toLocaleDateString()
    : null;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }}>
      {/* Header */}
      <View style={{ backgroundColor: c.bgCard, paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: c.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <Ionicons name="chevron-back" size={24} color={c.primary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "800", color: c.text }}>{t.subscription.title}</Text>
      </View>

      {/* Current plan badge */}
      <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
        <View style={{ backgroundColor: c.bgMuted, borderWidth: 1, borderColor: c.border, borderRadius: 12, padding: 12, flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="checkmark-circle" size={16} color={c.primary} />
          <View style={{ marginLeft: 8 }}>
            <Text style={{ color: c.textSub, fontSize: 14, fontWeight: "600" }}>
              {t.subscription.current}: {nameMap[currentPlan]}
            </Text>
            {expiryText && (
              <Text style={{ color: c.textMuted, fontSize: 12, marginTop: 2 }}>
                {expiryText} gacha
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Plan cards */}
      <View style={{ paddingHorizontal: 16, marginTop: 16, gap: 16, marginBottom: 32 }}>
        {PLANS.map((plan) => {
          const isActive = plan.key === currentPlan;
          const features = featuresMap[plan.key];

          return (
            <View
              key={plan.key}
              style={{
                backgroundColor: plan.bgColor,
                borderColor: isActive ? plan.color : plan.borderColor,
                borderWidth: isActive ? 2 : 1,
                borderRadius: 20,
                padding: 20,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <View>
                  <Text style={{ color: plan.color, fontSize: 20, fontWeight: "800" }}>
                    {nameMap[plan.key]}
                  </Text>
                  <Text style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>
                    {plan.key === "free" ? plan.price : `${plan.price} ${t.subscription.perMonth}`}
                  </Text>
                </View>
                {isActive && (
                  <View style={{ backgroundColor: plan.color, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 }}>
                    <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>{t.subscription.active}</Text>
                  </View>
                )}
              </View>

              <View style={{ height: 1, backgroundColor: "#e5e7eb", marginBottom: 12 }} />

              <View style={{ gap: 8, marginBottom: 12 }}>
                {features.map((feature) => (
                  <View key={feature} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Ionicons name="checkmark" size={14} color={plan.color} />
                    <Text style={{ color: "#374151", fontSize: 13, flex: 1 }}>{feature}</Text>
                  </View>
                ))}
              </View>

              {/* Payment buttons */}
              {!isActive && (
                <View style={{ gap: 8 }}>
                  <TouchableOpacity
                    style={{ backgroundColor: plan.color, borderRadius: 12, height: 48, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 }}
                    onPress={() => handleUpgrade(plan)}
                  >
                    <Ionicons name="card" size={18} color="#fff" />
                    <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>{t.subscription.upgrade} (Payme / Click)</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        <View style={{ backgroundColor: c.bgMuted, borderWidth: 1, borderColor: c.border, borderRadius: 12, padding: 16, flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="information-circle" size={16} color={c.textSub} />
          <Text style={{ color: c.textSub, fontSize: 13, flex: 1 }}>
            {t.subscription.demoNote}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
