import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingCart, Plus, X, ChevronDown, AlertCircle, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import * as salesApi from '../api/sales.api';
import * as productsApi from '../api/products.api';

export default function Sales() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('uz') ? 'uz-UZ' : i18n.language.startsWith('ru') ? 'ru-RU' : 'en-US';

  function fmt(n) {
    return Number(n || 0).toLocaleString(locale) + " " + t('currency');
  }

  function NewSaleModal({ onClose }) {
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [errors, setErrors] = useState({});
    const qc = useQueryClient();

    const { data: productsData, isLoading: productsLoading } = useQuery({
      queryKey: ['products'],
      queryFn: () => productsApi.getProducts(),
      staleTime: 0,
      refetchOnMount: true,
    });
    const allProducts = productsData?.data?.data?.products || [];
    const inStock = Array.isArray(allProducts) ? allProducts.filter((p) => p.stock > 0) : [];
    const hasNoProducts = !productsLoading && allProducts.length === 0;
    const hasNoStock   = !productsLoading && allProducts.length > 0 && inStock.length === 0;

    const selected = inStock.find((p) => p._id === productId);
    const profit = selected
      ? (selected.sellPrice - selected.buyPrice) * Number(quantity || 0)
      : 0;
    const total = selected ? selected.sellPrice * Number(quantity || 0) : 0;

    const mutation = useMutation({
      mutationFn: salesApi.createSale,
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['sales-today'] });
        qc.invalidateQueries({ queryKey: ['reports-summary'] });
        qc.invalidateQueries({ queryKey: ['products'] });
        toast.success(t('sale_added'));
        onClose();
      },
      onError: (err) => {
        if (err.response?.status === 422) {
          const errors = err.response?.data?.errors;
          const msg = (Array.isArray(errors) && errors[0]) || 'Error';
          toast.error(msg);
        }
      },
    });

    const validate = () => {
      const e = {};
      if (!productId) e.product = t('enter_product');
      const qty = Number(quantity);
      if (!quantity || isNaN(qty) || qty <= 0) e.quantity = t('enter_quantity');
      else if (selected && qty > selected.stock)
        e.quantity = `${t('only_in_stock')} ${selected.stock} ${t(`unit_${selected.unit || 'pcs'}`)} ${t('available')}`;
      return e;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const errs = validate();
      if (Object.keys(errs).length) { setErrors(errs); return; }
      mutation.mutate({
        product: selected._id,
        productName: selected.name,
        quantity: Number(quantity),
        sellPrice: Number(selected.sellPrice) || 0,
        buyPrice: Number(selected.buyPrice) || 0,
        unit: selected.unit || 'pcs',
      });
    };

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
        <div className="bg-white dark:bg-[#112920] w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#e0f2ec]">{t('new_sale')}</h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.08] transition">
              <X size={20} />
            </button>
          </div>

          {/* No products at all */}
          {(hasNoProducts || hasNoStock) && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                <Package size={26} className="text-amber-500" />
              </div>
              <div>
                <p className="font-bold text-[#0F172A] dark:text-[#e0f2ec] text-base">
                  {hasNoProducts ? "Mahsulotlar yo'q" : "Zaxirada mahsulot qolmadi"}
                </p>
                <p className="text-sm text-[#64748B] dark:text-[rgba(224,242,236,0.6)] mt-1">
                  {hasNoProducts
                    ? "Avval mahsulot qo'shing, so'ng savdo kiriting"
                    : "Barcha mahsulotlar zaxirasi tugagan. Zaxirani to'ldiring"}
                </p>
              </div>
              <Link
                to="/products"
                onClick={onClose}
                className="mt-1 inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl transition text-sm"
              >
                <Plus size={15} />
                {hasNoProducts ? "Mahsulot qo'shish" : "Mahsulotlarga o'tish"}
              </Link>
            </div>
          )}

          {!hasNoProducts && !hasNoStock && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] dark:text-[#e0f2ec] mb-2">{t('products')}</label>
              {productsLoading ? (
                <div className="h-12 rounded-xl bg-slate-100 dark:bg-white/[0.08] animate-pulse" />
              ) : (
              <div className="relative">
                <select
                  value={productId}
                  onChange={(e) => {
                    setProductId(e.target.value);
                    if (errors.product) setErrors((p) => ({ ...p, product: '' }));
                  }}
                  className={`w-full h-12 rounded-xl border px-4 pr-10 text-base text-[#0F172A] dark:text-[#e0f2ec] bg-white dark:bg-[#112920] appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition ${errors.product ? 'border-red-400 bg-red-50' : 'border-[#E2E8F0] dark:border-white/[0.07]'
                    }`}
                >
                  <option value="">{t('select_product_placeholder')}</option>
                  {inStock.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} — {p.stock} {t(`unit_${p.unit || 'pcs'}`)} {t('remains')}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] dark:text-[rgba(224,242,236,0.35)] pointer-events-none" />
              </div>
              )}
              {errors.product && <p className="text-red-500 text-sm mt-1">{errors.product}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0F172A] dark:text-[#e0f2ec] mb-2">
                {t('quantity')} {selected ? `(${t(`unit_${selected.unit || 'pcs'}`)})` : ''}
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  if (errors.quantity) setErrors((p) => ({ ...p, quantity: '' }));
                }}
                placeholder="1"
                min="1"
                className={`w-full h-12 rounded-xl border px-4 text-base text-[#0F172A] dark:text-[#e0f2ec] placeholder-[#94A3B8] dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition ${errors.quantity ? 'border-red-400 bg-red-50' : 'border-[#E2E8F0] dark:border-white/[0.07] bg-white dark:bg-[#112920]'}`}
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>

            {selected && Number(quantity) > 0 && (
              <div className="bg-slate-50 dark:bg-white/[0.04] border border-[#E2E8F0] dark:border-white/[0.07] rounded-xl px-4 py-3 flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#64748B] dark:text-[rgba(224,242,236,0.6)]">{t('sale_preview_revenue')}</span>
                  <span className="font-semibold text-[#0F172A] dark:text-[#e0f2ec]">{fmt(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B] dark:text-[rgba(224,242,236,0.6)]">{t('sale_preview_profit')}</span>
                  <span className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-500'}`}>{fmt(profit)}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-1">
              <button type="button" onClick={onClose} className="flex-1 h-12 rounded-xl border border-[#E2E8F0] dark:border-white/[0.07] text-[#64748B] dark:text-[rgba(224,242,236,0.6)] font-semibold hover:bg-slate-50 dark:hover:bg-white/[0.04] transition">
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 h-12 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {mutation.isPending ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : t('save')}
              </button>
            </div>
          </form>
          )}
        </div>
      </div>
    );
  }

  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['sales-today', date],
    queryFn: () => salesApi.getSales({ date }),
    refetchInterval: 30000,
  });

  const allSales = data?.data?.data?.sales || [];
  const sales = Array.isArray(allSales) ? allSales : [];

  const totalRevenue = sales.reduce((s, x) => s + Number(x.totalRevenue || 0), 0);
  const totalProfit = sales.reduce((s, x) => s + Number(x.profit || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0a1f12]">
      <div className="bg-white dark:bg-[#112920] border-b border-[#E2E8F0] dark:border-white/[0.07] px-5 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-lg font-bold text-[#0F172A] dark:text-[#e0f2ec]">{t('sales')}</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2.5 rounded-xl transition"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">{t('new_sale')}</span>
          <span className="sm:hidden">{t('add')}</span>
        </button>
      </div>

      <div className="px-4 sm:px-6 py-5 max-w-3xl mx-auto flex flex-col gap-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="h-12 rounded-xl border border-[#E2E8F0] dark:border-white/[0.07] bg-white dark:bg-[#112920] px-4 text-base text-[#0F172A] dark:text-[#e0f2ec] focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition w-full sm:w-auto"
        />

        {!isLoading && sales.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-[#112920] rounded-2xl border border-[#E2E8F0] dark:border-white/[0.07] p-4 flex flex-col gap-1">
              <span className="text-xs font-medium text-[#64748B] dark:text-[rgba(224,242,236,0.6)]">{t('total_sales')}</span>
              <p className="text-lg font-extrabold text-[#0F172A] dark:text-[#e0f2ec]">{fmt(totalRevenue)}</p>
            </div>
            <div className="bg-white dark:bg-[#112920] rounded-2xl border border-[#E2E8F0] dark:border-white/[0.07] p-4 flex flex-col gap-1">
              <span className="text-xs font-medium text-[#64748B] dark:text-[rgba(224,242,236,0.6)]">{t('total_profit')}</span>
              <p className="text-lg font-extrabold text-green-600">{fmt(totalProfit)}</p>
            </div>
          </div>
        )}

        {isError ? (
          <div className="text-center py-16">
            <AlertCircle size={40} className="mx-auto mb-3 text-red-400" />
            <p className="font-semibold text-red-500">{t('error_loading')}</p>
            <button onClick={() => refetch()} className="mt-3 text-sm text-green-600 font-semibold hover:underline">{t('retry')}</button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-[#112920] rounded-2xl border border-[#E2E8F0] dark:border-white/[0.07] p-4 animate-pulse flex justify-between">
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-36 bg-slate-200 dark:bg-white/[0.12] rounded" />
                  <div className="h-3 w-24 bg-slate-100 dark:bg-white/10 rounded" />
                </div>
                <div className="h-5 w-20 bg-slate-200 dark:bg-white/[0.12] rounded" />
              </div>
            ))}
          </div>
        ) : sales.length === 0 ? (
          <div className="text-center py-16 text-[#64748B] dark:text-[rgba(224,242,236,0.6)]">
            <ShoppingCart size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-semibold">{t('no_sales_day')}</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-3 rounded-xl transition"
            >
              <Plus size={18} />
              {t('add_sale')}
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#112920] rounded-2xl border border-[#E2E8F0] dark:border-white/[0.07] overflow-hidden">
            <div className="divide-y divide-[#E2E8F0] dark:divide-white/[0.07]">
              {sales.map((sale) => {
                const timeStr = new Date(sale.createdAt).toLocaleTimeString(locale, {
                  hour: '2-digit',
                  minute: '2-digit',
                });
                return (
                  <div key={sale._id} className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A] dark:text-[#e0f2ec]">
                        {sale.productName || 'Mahsulot'}
                      </p>
                      <p className="text-xs text-[#64748B] dark:text-[rgba(224,242,236,0.6)] mt-0.5">
                        {sale.quantity} {t(`unit_${sale.unit || 'pcs'}`)} · {timeStr}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">
                        +{Number(sale.profit || 0).toLocaleString(locale)} {t('currency')}
                      </p>
                      <p className="text-xs text-[#64748B] dark:text-[rgba(224,242,236,0.6)]">
                        {Number(sale.totalRevenue || 0).toLocaleString(locale)} {t('currency')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {showModal && <NewSaleModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
