import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useT } from "@/hooks/useT";

type PlanKey = "free" | "pro" | "biznes";

interface Plan {
  key: PlanKey;
  price: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const PLANS: Plan[] = [
  {
    key: "free",
    price: "Bepul",
    color: "#6b7280",
    bgColor: "#f9fafb",
    borderColor: "#e5e7eb",
  },
  {
    key: "pro",
    price: "24,900",
    color: "#16a34a",
    bgColor: "#f0fdf4",
    borderColor: "#16a34a",
  },
  {
    key: "biznes",
    price: "49,900",
    color: "#7c3aed",
    bgColor: "#faf5ff",
    borderColor: "#7c3aed",
  },
];

export default function SubscriptionScreen() {
  const t = useT();
  const currentPlan: PlanKey = "free";

  function handleUpgrade(plan: PlanKey) {
    if (plan === "free") return;
    Alert.alert(
      t.subscription.upgrade,
      t.subscription.demoNote,
      [{ text: "OK" }]
    );
  }

  const featuresMap: Record<PlanKey, string[]> = {
    free: t.subscription.freeFeatures,
    pro: t.subscription.proFeatures,
    biznes: t.subscription.biznesFeatures,
  };

  const nameMap: Record<PlanKey, string> = {
    free: t.subscription.free,
    pro: t.subscription.pro,
    biznes: t.subscription.biznes,
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 pt-14 pb-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="chevron-back" size={24} color="#16a34a" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">{t.subscription.title}</Text>
      </View>

      {/* Current plan badge */}
      <View className="px-4 mt-4">
        <View className="bg-green-50 border border-green-200 rounded-xl p-3 flex-row items-center">
          <Ionicons name="checkmark" size={16} color="#16a34a" />
          <Text className="ml-2 text-green-700 text-sm font-medium">
            {t.subscription.current}: {nameMap[currentPlan]}
          </Text>
        </View>
      </View>

      {/* Plan cards */}
      <View className="px-4 mt-4 gap-4 mb-8">
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
              }}
              className="rounded-2xl p-5 shadow-sm"
            >
              {/* Plan name and price */}
              <View className="flex-row items-center justify-between mb-3">
                <View>
                  <Text style={{ color: plan.color }} className="text-xl font-bold">
                    {nameMap[plan.key]}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {plan.key === "free"
                      ? plan.price
                      : `${plan.price} ${t.subscription.perMonth}`}
                  </Text>
                </View>
                {isActive && (
                  <View
                    style={{ backgroundColor: plan.color }}
                    className="px-3 py-1 rounded-full"
                  >
                    <Text className="text-white text-xs font-semibold">
                      {t.subscription.active}
                    </Text>
                  </View>
                )}
              </View>

              {/* Divider */}
              <View className="h-px bg-gray-200 mb-3" />

              {/* Features list */}
              <View className="gap-2">
                {features.map((feature) => (
                  <View key={feature} className="flex-row items-center gap-2">
                    <Ionicons name="checkmark" size={14} color={plan.color} />
                    <Text className="text-gray-700 text-sm flex-1">{feature}</Text>
                  </View>
                ))}
              </View>

              {/* Upgrade button */}
              {!isActive && (
                <TouchableOpacity
                  style={{ backgroundColor: plan.color }}
                  className="mt-4 rounded-xl h-12 items-center justify-center"
                  onPress={() => handleUpgrade(plan.key)}
                >
                  <Text className="text-white font-semibold">{t.subscription.upgrade}</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {/* Demo note */}
        <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <Text className="text-yellow-700 text-sm text-center">
            {t.subscription.demoNote}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
