import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { COLORS, SIZES } from '../constants/theme';
import {
  getSalesByDate,
  getSalesByMonth,
  getDailyStats,
  getMonthlyStats,
} from '../database/saleQueries';

const TAB_TODAY = 'today';
const TAB_MONTH = 'month';

export default function SalesScreen() {
  const [activeTab, setActiveTab] = useState(TAB_TODAY);
  const [sales, setSales] = useState([]);
  const [stats, setStats] = useState({ totalRevenue: 0, totalCost: 0, totalProfit: 0, salesCount: 0 });
  const [loading, setLoading] = useState(true);

  const today = format(new Date(), 'yyyy-MM-dd');
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const loadData = useCallback(async (tab) => {
    setLoading(true);
    try {
      if (tab === TAB_TODAY) {
        const [data, dailyStats] = await Promise.all([
          getSalesByDate(today),
          getDailyStats(today),
        ]);
        setSales(data);
        setStats(dailyStats || { totalRevenue: 0, totalCost: 0, totalProfit: 0, salesCount: 0 });
      } else {
        const [data, monthStats] = await Promise.all([
          getSalesByMonth(currentYear, currentMonth),
          getMonthlyStats(currentYear, currentMonth),
        ]);
        setSales(data);
        setStats(monthStats || { totalRevenue: 0, totalCost: 0, totalProfit: 0, salesCount: 0 });
      }
    } catch (error) {
      console.error('SalesScreen loadData error:', error);
    } finally {
      setLoading(false);
    }
  }, [today, currentYear, currentMonth]);

  useFocusEffect(
    useCallback(() => {
      loadData(activeTab);
    }, [loadData, activeTab])
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    loadData(tab);
  };

  const groupSalesByDate = (salesList) => {
    const groups = {};
    for (const sale of salesList) {
      const dateKey = sale.createdAt.substring(0, 10);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(sale);
    }
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  };

  const grouped = groupSalesByDate(sales);

  const renderSale = (sale) => (
    <View key={sale.id} style={styles.saleCard}>
      <View style={styles.saleLeft}>
        <View style={styles.saleIcon}>
          <Ionicons name="cart-outline" size={16} color={COLORS.accent} />
        </View>
        <View style={styles.saleInfo}>
          <Text style={styles.saleName} numberOfLines={1}>{sale.productName}</Text>
          <Text style={styles.saleMeta}>
            {Number(sale.quantity).toFixed(0)} × ${Number(sale.sellPrice).toFixed(2)}
            {'  ·  '}
            {format(new Date(sale.createdAt), 'HH:mm')}
          </Text>
          {sale.note ? <Text style={styles.saleNote}>{sale.note}</Text> : null}
        </View>
      </View>
      <View style={styles.saleRight}>
        <Text style={styles.saleRevenue}>${Number(sale.totalRevenue).toFixed(2)}</Text>
        <Text style={styles.saleProfit}>+${Number(sale.profit).toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tab Toggle */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === TAB_TODAY && styles.tabActive]}
          onPress={() => handleTabChange(TAB_TODAY)}
        >
          <Text style={[styles.tabText, activeTab === TAB_TODAY && styles.tabTextActive]}>
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === TAB_MONTH && styles.tabActive]}
          onPress={() => handleTabChange(TAB_MONTH)}
        >
          <Text style={[styles.tabText, activeTab === TAB_MONTH && styles.tabTextActive]}>
            This Month
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={COLORS.accent} size="large" />
        </View>
      ) : (
        <FlatList
          data={[{ key: 'content' }]}
          renderItem={() => (
            <>
              {/* Stats Summary */}
              <View style={styles.statsCard}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.salesCount}</Text>
                  <Text style={styles.statLabel}>Sales</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>${Number(stats.totalRevenue).toFixed(2)}</Text>
                  <Text style={styles.statLabel}>Revenue</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: COLORS.accent }]}>
                    ${Number(stats.totalProfit).toFixed(2)}
                  </Text>
                  <Text style={styles.statLabel}>Profit</Text>
                </View>
              </View>

              {/* Grouped Sales */}
              {grouped.length === 0 ? (
                <View style={styles.centered}>
                  <Ionicons name="receipt-outline" size={56} color={COLORS.border} />
                  <Text style={styles.emptyText}>No sales recorded</Text>
                  <Text style={styles.emptySubText}>
                    {activeTab === TAB_TODAY
                      ? 'Make your first sale today!'
                      : 'No sales this month yet.'}
                  </Text>
                </View>
              ) : (
                grouped.map(([dateKey, dateSales]) => (
                  <View key={dateKey} style={styles.group}>
                    <View style={styles.groupHeader}>
                      <Text style={styles.groupDate}>
                        {dateKey === today
                          ? 'Today'
                          : format(new Date(dateKey), 'MMMM dd, yyyy')}
                      </Text>
                      <Text style={styles.groupCount}>{dateSales.length} sales</Text>
                    </View>
                    {dateSales.map(renderSale)}
                  </View>
                ))
              )}
            </>
          )}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabRow: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: COLORS.accent,
  },
  tabText: {
    color: COLORS.textMuted,
    fontSize: SIZES.base,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: SIZES.base,
    fontWeight: '600',
  },
  emptySubText: {
    color: COLORS.textMuted,
    fontSize: SIZES.sm,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: COLORS.border,
  },
  statValue: {
    color: COLORS.text,
    fontSize: SIZES.lg,
    fontWeight: '700',
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: SIZES.xs,
    marginTop: 2,
  },
  group: {
    marginBottom: 20,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  groupDate: {
    color: COLORS.text,
    fontSize: SIZES.base,
    fontWeight: '700',
  },
  groupCount: {
    color: COLORS.textMuted,
    fontSize: SIZES.sm,
  },
  saleCard: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  saleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  saleIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saleInfo: {
    flex: 1,
  },
  saleName: {
    color: COLORS.text,
    fontSize: SIZES.md,
    fontWeight: '600',
  },
  saleMeta: {
    color: COLORS.textMuted,
    fontSize: SIZES.xs,
    marginTop: 2,
  },
  saleNote: {
    color: COLORS.textMuted,
    fontSize: SIZES.xs,
    fontStyle: 'italic',
    marginTop: 2,
  },
  saleRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  saleRevenue: {
    color: COLORS.text,
    fontSize: SIZES.md,
    fontWeight: '600',
  },
  saleProfit: {
    color: COLORS.accent,
    fontSize: SIZES.sm,
    fontWeight: '600',
  },
});
