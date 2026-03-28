import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { generateId } from '../utils/uuid';
import { COLORS, SIZES } from '../constants/theme';
import { getAllProducts, upsertProduct, deleteProduct, searchProducts } from '../database/productQueries';
import { addToSyncQueue } from '../database/syncQueries';

const UNITS = ['pcs', 'kg', 'L', 'box'];

const emptyForm = {
  name: '',
  buyPrice: '',
  sellPrice: '',
  quantity: '',
  unit: 'pcs',
};

export default function ProductsScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [detailModal, setDetailModal] = useState(null);

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
      loadProducts(searchQuery);
    }, [loadProducts])
  );

  const handleSearch = (text) => {
    setSearchQuery(text);
    loadProducts(text);
  };

  const openAddModal = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setModalVisible(true);
  };

  const openEditModal = (product) => {
    setDetailModal(null);
    setEditProduct(product);
    setForm({
      name: product.name,
      buyPrice: String(product.buyPrice),
      sellPrice: String(product.sellPrice),
      quantity: String(product.quantity),
      unit: product.unit || 'pcs',
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.buyPrice || !form.sellPrice || !form.quantity) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const product = {
        id: editProduct ? editProduct.id : generateId(),
        serverId: editProduct?.serverId || null,
        name: form.name.trim(),
        buyPrice: parseFloat(form.buyPrice),
        sellPrice: parseFloat(form.sellPrice),
        quantity: parseFloat(form.quantity),
        unit: form.unit,
        updatedAt: now,
        synced: 0,
      };

      await upsertProduct(product);
      await addToSyncQueue(
        editProduct ? 'update' : 'create',
        'product',
        product.id,
        product
      );

      setModalVisible(false);
      await loadProducts(searchQuery);
    } catch (error) {
      Alert.alert('Error', 'Failed to save product.');
      console.error('handleSave error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProduct(product.id);
              await addToSyncQueue('delete', 'product', product.id, { id: product.id });
              setDetailModal(null);
              await loadProducts(searchQuery);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete product.');
            }
          },
        },
      ]
    );
  };

  const getStockColor = (qty) => {
    if (qty <= 0) return COLORS.danger;
    if (qty <= 5) return COLORS.warning;
    return COLORS.accent;
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => setDetailModal(item)}
      activeOpacity={0.7}
    >
      <View style={styles.productLeft}>
        <View style={[styles.productIconBg, { borderColor: getStockColor(item.quantity) }]}>
          <Ionicons name="cube-outline" size={18} color={getStockColor(item.quantity)} />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.productMeta}>
            Buy: ${Number(item.buyPrice).toFixed(2)} · Sell: ${Number(item.sellPrice).toFixed(2)}
          </Text>
        </View>
      </View>
      <View style={styles.productRight}>
        <Text style={[styles.productQty, { color: getStockColor(item.quantity) }]}>
          {Number(item.quantity).toFixed(0)}
        </Text>
        <Text style={styles.productUnit}>{item.unit}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={COLORS.accent} size="large" />
        </View>
      ) : products.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="cube-outline" size={56} color={COLORS.border} />
          <Text style={styles.emptyText}>
            {searchQuery ? 'No products found' : 'No products yet'}
          </Text>
          <Text style={styles.emptySubText}>
            {searchQuery ? 'Try a different search term' : 'Tap + to add your first product'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={openAddModal} activeOpacity={0.8}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Detail Modal */}
      <Modal
        visible={!!detailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setDetailModal(null)}
      >
        <View style={styles.overlay}>
          <View style={styles.detailSheet}>
            <View style={styles.sheetHandle} />
            {detailModal && (
              <>
                <Text style={styles.detailName}>{detailModal.name}</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Buy Price</Text>
                  <Text style={styles.detailValue}>${Number(detailModal.buyPrice).toFixed(2)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Sell Price</Text>
                  <Text style={styles.detailValue}>${Number(detailModal.sellPrice).toFixed(2)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Stock</Text>
                  <Text style={[styles.detailValue, { color: getStockColor(detailModal.quantity) }]}>
                    {Number(detailModal.quantity).toFixed(0)} {detailModal.unit}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Margin</Text>
                  <Text style={[styles.detailValue, { color: COLORS.accent }]}>
                    ${(Number(detailModal.sellPrice) - Number(detailModal.buyPrice)).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.detailActions}>
                  <TouchableOpacity
                    style={[styles.detailBtn, { backgroundColor: COLORS.info }]}
                    onPress={() => openEditModal(detailModal)}
                  >
                    <Ionicons name="create-outline" size={18} color="#fff" />
                    <Text style={styles.detailBtnText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.detailBtn, { backgroundColor: COLORS.danger }]}
                    onPress={() => handleDelete(detailModal)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#fff" />
                    <Text style={styles.detailBtnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setDetailModal(null)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Add / Edit Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.formSheet}>
            <View style={styles.sheetHandle} />
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.formTitle}>{editProduct ? 'Edit Product' : 'Add Product'}</Text>

              <Text style={styles.fieldLabel}>Product Name *</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g. Rice 5kg"
                placeholderTextColor={COLORS.textMuted}
                value={form.name}
                onChangeText={(v) => setForm(f => ({ ...f, name: v }))}
              />

              <View style={styles.fieldRow}>
                <View style={styles.fieldHalf}>
                  <Text style={styles.fieldLabel}>Buy Price *</Text>
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="0.00"
                    placeholderTextColor={COLORS.textMuted}
                    value={form.buyPrice}
                    onChangeText={(v) => setForm(f => ({ ...f, buyPrice: v }))}
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={styles.fieldHalf}>
                  <Text style={styles.fieldLabel}>Sell Price *</Text>
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="0.00"
                    placeholderTextColor={COLORS.textMuted}
                    value={form.sellPrice}
                    onChangeText={(v) => setForm(f => ({ ...f, sellPrice: v }))}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <View style={styles.fieldHalf}>
                  <Text style={styles.fieldLabel}>Quantity *</Text>
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="0"
                    placeholderTextColor={COLORS.textMuted}
                    value={form.quantity}
                    onChangeText={(v) => setForm(f => ({ ...f, quantity: v }))}
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={styles.fieldHalf}>
                  <Text style={styles.fieldLabel}>Unit</Text>
                  <View style={styles.unitRow}>
                    {UNITS.map(u => (
                      <TouchableOpacity
                        key={u}
                        style={[styles.unitChip, form.unit === u && styles.unitChipActive]}
                        onPress={() => setForm(f => ({ ...f, unit: u }))}
                      >
                        <Text style={[styles.unitChipText, form.unit === u && styles.unitChipTextActive]}>
                          {u}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {form.buyPrice && form.sellPrice && (
                <View style={styles.marginPreview}>
                  <Text style={styles.marginLabel}>Profit margin per unit:</Text>
                  <Text style={styles.marginValue}>
                    ${(parseFloat(form.sellPrice || 0) - parseFloat(form.buyPrice || 0)).toFixed(2)}
                  </Text>
                </View>
              )}

              <View style={styles.formActions}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.saveButtonText}>{editProduct ? 'Save Changes' : 'Add Product'}</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                  disabled={saving}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    margin: 16,
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
    height: 46,
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
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  productCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  productIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    color: COLORS.text,
    fontSize: SIZES.base,
    fontWeight: '600',
  },
  productMeta: {
    color: COLORS.textMuted,
    fontSize: SIZES.xs,
    marginTop: 2,
  },
  productRight: {
    alignItems: 'flex-end',
  },
  productQty: {
    fontSize: SIZES.xl,
    fontWeight: '700',
  },
  productUnit: {
    color: COLORS.textMuted,
    fontSize: SIZES.xs,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  detailSheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
  },
  formSheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
    maxHeight: '90%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  detailName: {
    fontSize: SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    color: COLORS.textMuted,
    fontSize: SIZES.base,
  },
  detailValue: {
    color: COLORS.text,
    fontSize: SIZES.base,
    fontWeight: '600',
  },
  detailActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  detailBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 10,
    gap: 6,
  },
  detailBtnText: {
    color: '#fff',
    fontSize: SIZES.base,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 12,
    alignItems: 'center',
    padding: 12,
  },
  cancelText: {
    color: COLORS.textMuted,
    fontSize: SIZES.base,
  },
  formTitle: {
    fontSize: SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 20,
  },
  fieldLabel: {
    color: COLORS.textMuted,
    fontSize: SIZES.sm,
    marginBottom: 6,
    fontWeight: '500',
  },
  fieldInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 46,
    color: COLORS.text,
    fontSize: SIZES.base,
    marginBottom: 14,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldHalf: {
    flex: 1,
  },
  unitRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  unitChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  unitChipActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  unitChipText: {
    color: COLORS.textMuted,
    fontSize: SIZES.sm,
    fontWeight: '500',
  },
  unitChipTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  marginPreview: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  marginLabel: {
    color: COLORS.textMuted,
    fontSize: SIZES.sm,
  },
  marginValue: {
    color: COLORS.accent,
    fontSize: SIZES.sm,
    fontWeight: '700',
  },
  formActions: {
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: SIZES.base,
    fontWeight: '700',
  },
});
