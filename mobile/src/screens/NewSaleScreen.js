import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { generateId } from '../utils/uuid';
import { format } from 'date-fns';
import { COLORS, SIZES } from '../constants/theme';
import { getAllProducts, searchProducts, updateProductQuantity } from '../database/productQueries';
import { createSale } from '../database/saleQueries';
import { addToSyncQueue } from '../database/syncQueries';

export default function NewSaleScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('1');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const loadProducts = useCallback(async (query = '') => {
    try {
      const data = query.trim()
        ? await searchProducts(query.trim())
        : await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('loadProducts error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setSelectedProduct(null);
      setQuantity('1');
      setNote('');
      setSearchQuery('');
      loadProducts('');
      return () => {};
    }, [loadProducts])
  );

  const handleSearch = (text) => {
    setSearchQuery(text);
    loadProducts(text);
  };

  const selectProduct = (product) => {
    setSelectedProduct(product);
    setQuantity('1');
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const clearSelection = () => {
    setSelectedProduct(null);
    setQuantity('1');
    setNote('');
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const qty = parseFloat(quantity) || 0;
  const revenue = selectedProduct ? qty * Number(selectedProduct.sellPrice) : 0;
  const cost = selectedProduct ? qty * Number(selectedProduct.buyPrice) : 0;
  const profit = revenue - cost;

  const handleConfirmSale = async () => {
    if (!selectedProduct) return;
    if (qty <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity greater than 0.');
      return;
    }
    if (qty > Number(selectedProduct.quantity)) {
      Alert.alert(
        'Insufficient Stock',
        `Only ${Number(selectedProduct.quantity).toFixed(0)} ${selectedProduct.unit} available.`
      );
      return;
    }

    setSaving(true);
    try {
      const saleId = generateId();
      const now = new Date().toISOString();
      const newQty = Number(selectedProduct.quantity) - qty;

      const sale = {
        id: saleId,
        serverId: null,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity: qty,
        sellPrice: Number(selectedProduct.sellPrice),
        buyPrice: Number(selectedProduct.buyPrice),
        totalRevenue: revenue,
        totalCost: cost,
        profit,
        note: note.trim(),
        createdAt: now,
        synced: 0,
      };

      // Save sale locally
      await createSale(sale);

      // Deduct stock
      await updateProductQuantity(selectedProduct.id, newQty);

      // Add to sync queue
      await addToSyncQueue('create', 'sale', saleId, sale);

      // Update product sync queue
      await addToSyncQueue('update', 'product', selectedProduct.id, {
        ...selectedProduct,
        quantity: newQty,
        updatedAt: now,
      });

      // Show success and reset
      Alert.alert(
        'Sale Confirmed!',
        `${selectedProduct.name}\n${qty} x $${Number(selectedProduct.sellPrice).toFixed(2)}\nProfit: $${profit.toFixed(2)}`,
        [
          {
            text: 'New Sale',
            onPress: () => {
              clearSelection();
              setSearchQuery('');
              loadProducts('');
            },
          },
          {
            text: 'Dashboard',
            onPress: () => navigation.navigate('Dashboard'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to record sale. Please try again.');
      console.error('handleConfirmSale error:', error);
    } finally {
      setSaving(false);
    }
  };

  const getStockColor = (qty) => {
    if (qty <= 0) return COLORS.danger;
    if (qty <= 5) return COLORS.warning;
    return COLORS.accent;
  };

  const renderProduct = ({ item }) => {
    const isSelected = selectedProduct?.id === item.id;
    const outOfStock = Number(item.quantity) <= 0;
    return (
      <TouchableOpacity
        style={[
          styles.productItem,
          isSelected && styles.productItemSelected,
          outOfStock && styles.productItemDisabled,
        ]}
        onPress={() => !outOfStock && selectProduct(item)}
        disabled={outOfStock}
        activeOpacity={0.7}
      >
        <View style={styles.productItemLeft}>
          <View style={[styles.productDot, { backgroundColor: getStockColor(item.quantity) }]} />
          <View>
            <Text style={styles.productItemName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.productItemPrice}>${Number(item.sellPrice).toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.productItemRight}>
          <Text style={[styles.productItemStock, { color: getStockColor(item.quantity) }]}>
            {Number(item.quantity).toFixed(0)} {item.unit}
          </Text>
          {isSelected && (
            <Ionicons name="checkmark-circle" size={18} color={COLORS.accent} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Search Input */}
      <View style={styles.searchSection}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search product to sell..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Product List */}
      {!selectedProduct ? (
        loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={COLORS.accent} size="large" />
          </View>
        ) : products.length === 0 ? (
          <View style={styles.centered}>
            <Ionicons name="cube-outline" size={56} color={COLORS.border} />
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubText}>Add products first from the Products screen</Text>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={renderProduct}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        )
      ) : (
        /* Sale Detail Panel */
        <Animated.View style={[styles.salePanel, { opacity: fadeAnim }]}>
          {/* Selected Product Header */}
          <View style={styles.selectedHeader}>
            <View style={styles.selectedInfo}>
              <View style={styles.selectedIconBg}>
                <Ionicons name="cube" size={22} color={COLORS.accent} />
              </View>
              <View>
                <Text style={styles.selectedName}>{selectedProduct.name}</Text>
                <Text style={styles.selectedStock}>
                  In stock: {Number(selectedProduct.quantity).toFixed(0)} {selectedProduct.unit}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={clearSelection} style={styles.changeBtn}>
              <Text style={styles.changeBtnText}>Change</Text>
            </TouchableOpacity>
          </View>

          {/* Quantity */}
          <View style={styles.qtySection}>
            <Text style={styles.qtyLabel}>Quantity</Text>
            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity(v => String(Math.max(1, (parseFloat(v) || 1) - 1)))}
              >
                <Ionicons name="remove" size={22} color={COLORS.text} />
              </TouchableOpacity>
              <TextInput
                style={styles.qtyInput}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="decimal-pad"
                textAlign="center"
                selectTextOnFocus
              />
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => {
                  const max = Number(selectedProduct.quantity);
                  setQuantity(v => String(Math.min(max, (parseFloat(v) || 0) + 1)));
                }}
              >
                <Ionicons name="add" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Calculations */}
          <View style={styles.calcCard}>
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Price per unit</Text>
              <Text style={styles.calcValue}>${Number(selectedProduct.sellPrice).toFixed(2)}</Text>
            </View>
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Revenue</Text>
              <Text style={styles.calcValue}>${revenue.toFixed(2)}</Text>
            </View>
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Cost</Text>
              <Text style={styles.calcValue}>${cost.toFixed(2)}</Text>
            </View>
            <View style={[styles.calcRow, styles.calcRowAccent]}>
              <Text style={styles.calcLabelBig}>Profit</Text>
              <Text style={styles.calcProfit}>${profit.toFixed(2)}</Text>
            </View>
          </View>

          {/* Note */}
          <TextInput
            style={styles.noteInput}
            placeholder="Add note (optional)"
            placeholderTextColor={COLORS.textMuted}
            value={note}
            onChangeText={setNote}
            maxLength={120}
          />

          {/* Confirm Button */}
          <TouchableOpacity
            style={[styles.confirmButton, saving && styles.confirmButtonDisabled]}
            onPress={handleConfirmSale}
            disabled={saving}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
                <Text style={styles.confirmButtonText}>Confirm Sale</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchSection: {
    padding: 16,
    paddingBottom: 8,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 52,
    color: COLORS.text,
    fontSize: SIZES.base,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  productItem: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  productItemSelected: {
    borderColor: COLORS.accent,
    backgroundColor: '#1a3a2a',
  },
  productItemDisabled: {
    opacity: 0.4,
  },
  productItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  productDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  productItemName: {
    color: COLORS.text,
    fontSize: SIZES.base,
    fontWeight: '600',
    maxWidth: 180,
  },
  productItemPrice: {
    color: COLORS.accent,
    fontSize: SIZES.sm,
    fontWeight: '500',
    marginTop: 2,
  },
  productItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  productItemStock: {
    fontSize: SIZES.sm,
    fontWeight: '600',
  },
  salePanel: {
    flex: 1,
    padding: 16,
  },
  selectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.accent,
    padding: 14,
    marginBottom: 16,
  },
  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  selectedIconBg: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedName: {
    color: COLORS.text,
    fontSize: SIZES.base,
    fontWeight: '700',
    maxWidth: 200,
  },
  selectedStock: {
    color: COLORS.textMuted,
    fontSize: SIZES.sm,
    marginTop: 2,
  },
  changeBtn: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  changeBtnText: {
    color: COLORS.textMuted,
    fontSize: SIZES.sm,
    fontWeight: '600',
  },
  qtySection: {
    marginBottom: 16,
  },
  qtyLabel: {
    color: COLORS.textMuted,
    fontSize: SIZES.sm,
    fontWeight: '500',
    marginBottom: 8,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyBtn: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyInput: {
    flex: 1,
    height: 52,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    color: COLORS.text,
    fontSize: SIZES.xxl,
    fontWeight: '700',
    textAlign: 'center',
  },
  calcCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 12,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  calcRowAccent: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 6,
    paddingTop: 12,
  },
  calcLabel: {
    color: COLORS.textMuted,
    fontSize: SIZES.md,
  },
  calcValue: {
    color: COLORS.text,
    fontSize: SIZES.md,
    fontWeight: '600',
  },
  calcLabelBig: {
    color: COLORS.text,
    fontSize: SIZES.base,
    fontWeight: '700',
  },
  calcProfit: {
    color: COLORS.accent,
    fontSize: SIZES.xl,
    fontWeight: '700',
  },
  noteInput: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    height: 46,
    color: COLORS.text,
    fontSize: SIZES.md,
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: SIZES.lg,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
