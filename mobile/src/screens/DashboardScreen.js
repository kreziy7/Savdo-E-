import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { COLORS, SIZES } from '../constants/theme';
import { getDailyStats, getRecentSales } from '../database/saleQueries';
import { isOnline, syncPending, pullServerData } from '../services/syncService';

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState({ totalRevenue: 0, totalCost: 0, totalProfit: 0, salesCount: 0 });
  const [recentSales, setRecentSales] = useState([]);
  const [online, setOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayDisplay = format(new Date(), 'MMMM dd, yyyy');

  const loadData = useCallback(async () => {
    try {
      const [dailyStats, recent, networkStatus] = await Promise.all([
        getDailyStats(today),
        getRecentSales(5),
        isOnline(),
      ]);
      setStats(dailyStats || { totalRevenue: 0, totalCost: 0, totalProfit: 0, salesCount: 0 });
      setRecentSales(recent || []);
      setOnline(networkStatus);
    } catch (error) {
      console.error('Dashboard loadData error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [today]);

  const handleSync = async () => {
    if (!online) return;
    try {
      await syncPending();
      await pullServerData();
      await loadData();
    } catch (error) {
      console.error('Sync error:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData();
    }, [loadData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={COLORS.accent} size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.accent}
          colors={[COLORS.accent]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Savdo</Text>
          <Text style={styles.headerDate}>{todayDisplay}</Text>
        </View>
        <TouchableOpacity style={styles.syncButton} onPress={handleSync}>
          <Ionicons
            name={online ? 'cloud-done-outline' : 'cloud-offline-outline'}
            size={22}
            color={online ? COLORS.accent : COLORS.warning}
          />
          <Text style={[styles.syncText, { color: online ? COLORS.accent : COLORS.warning }]}>
            {online ? 'Online' : 'Offline'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="receipt-outline" size={20} color={COLORS.info} />
          <Text style={styles.statValue}>{stats.salesCount}</Text>
          <Text style={styles.statLabel}>Sales Today</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="cash-outline" size={20} color={COLORS.accent} />
          <Text style={styles.statValue}>${Number(stats.totalRevenue).toFixed(2)}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
        <View style={[styles.statCard, styles.statCardAccent]}>
          <Ionicons name="trending-up-outline" size={20} color={COLORS.accent} />
          <Text style={[styles.statValue, { color: COLORS.accent }]}>
            ${Number(stats.totalProfit).toFixed(2)}
          </Text>
          <Text style={styles.statLabel}>Profit</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.newSaleButton}
          onPress={() => navigation.navigate('NewSale')}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={22} color="#fff" />
          <Text style={styles.newSaleText}>New Sale</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addProductButton}
          onPress={() => navigation.navigate('Products')}
          activeOpacity={0.8}
        >
          <Ionicons name="cube-outline" size={22} color={COLORS.accent} />
          <Text style={styles.addProductText}>Products</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Sales */}
      <Text style={styles.sectionTitle}>Recent Sales</Text>
      {recentSales.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="receipt-outline" size={40} color={COLORS.border} />
          <Text style={styles.emptyText}>No sales yet today</Text>
          <Text style={styles.emptySubText}>Tap "New Sale" to record your first sale</Text>
        </View>
      ) : (
        recentSales.map((sale) => (
          <View key={sale.id} style={styles.saleCard}>
            <View style={styles.saleLeft}>
              <View style={styles.saleIconWrapper}>
                <Ionicons name="cart-outline" size={18} color={COLORS.accent} />
              </View>
              <View>
                <Text style={styles.saleName} numberOfLines={1}>{sale.productName}</Text>
                <Text style={styles.saleMeta}>
                  {Number(sale.quantity).toFixed(0)} x ${Number(sale.sellPrice).toFixed(2)}
                  {'  '}
                  <Text style={styles.saleTime}>
                    {format(new Date(sale.createdAt), 'HH:mm')}
                  </Text>
                </Text>
              </View>
            </View>
            <View style={styles.saleRight}>
              <Text style={styles.saleRevenue}>${Number(sale.totalRevenue).toFixed(2)}</Text>
              <Text style={styles.saleProfit}>+${Number(sale.profit).toFixed(2)}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerDate: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  syncText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  statCardAccent: {
    borderColor: COLORS.accent,
  },
  statValue: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  newSaleButton: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  newSaleText: {
    color: '#fff',
    fontSize: SIZES.base,
    fontWeight: '700',
  },
  addProductButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.accent,
    gap: 8,
  },
  addProductText: {
    color: COLORS.accent,
    fontSize: SIZES.base,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 32,
    alignItems: 'center',
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
    textAlign: 'center',
  },
  saleCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
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
  saleIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saleName: {
    color: COLORS.text,
    fontSize: SIZES.md,
    fontWeight: '600',
    maxWidth: 160,
  },
  saleMeta: {
    color: COLORS.textMuted,
    fontSize: SIZES.xs,
    marginTop: 2,
  },
  saleTime: {
    color: COLORS.textMuted,
    fontSize: SIZES.xs,
  },
  saleRight: {
    alignItems: 'flex-end',
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
