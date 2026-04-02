import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle, X, Minus, Plus } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as productsApi from '../../api/products.api';
import * as salesApi from '../../api/sales.api';
import toast from 'react-hot-toast';

function fmt(n) {
  return Number(n || 0).toFixed(2);
}

export default function PosNewSale() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => { searchRef.current?.focus(); }, []);

  const { data } = useQuery({
    queryKey: ['pos-products', search],
    queryFn: () => productsApi.getProducts({ search, limit: 20, inStock: 'false' }),
    enabled: search.length > 0 || !selected,
  });

  const products = data?.data?.data?.products || [];

  const selectProduct = (p) => {
    setSelected(p);
    setQty(1);
    setSearch('');
  };

  const handleConfirm = async () => {
    if (!selected) return;
    if (qty <= 0) { toast.error('Quantity must be positive'); return; }
    if (qty > selected.stock) { toast.error(`Only ${selected.stock} in stock`); return; }

    setIsSubmitting(true);
    try {
      await salesApi.createSale({
        product: selected._id,
        productName: selected.name,
        quantity: qty,
        sellPrice: selected.finalPrice || selected.price,
        buyPrice: selected.price - (selected.price * (1 - (selected.finalPrice || selected.price) / selected.price)),
        unit: 'pcs',
        note,
      });

      qc.invalidateQueries(['pos-summary']);
      toast.success(`Sale recorded — Profit: $${fmt(revenue - cost)}`, {
        icon: '✅',
        style: { background: '#1E293B', color: '#fff', border: '1px solid #22C55E' },
      });
      navigate('/pos');
    } catch (_) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const price = selected ? (selected.finalPrice || selected.price) : 0;
  // buyPrice derived from original price (before discount)
  const buyPrice = selected ? (selected.price - price) > 0 ? (selected.price - price) : selected.price * 0.7 : 0;
  const revenue = price * qty;
  const cost = buyPrice * qty;
  const profit = revenue - cost;

  return (
    <div className="min-h-screen bg-pos-bg text-pos-text p-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/pos')} className="p-2 rounded-lg hover:bg-pos-card text-pos-muted">
            <X className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold">New Sale</h1>
        </div>

        {!selected ? (
          /* Product search */
          <div>
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-pos-muted" />
              <input
                ref={searchRef}
                className="w-full bg-pos-card border border-pos-border rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-pos-muted focus:outline-none focus:border-pos-accent text-base"
                placeholder="Search product by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {products.length > 0 ? (
              <div className="space-y-2">
                {products.map((p) => (
                  <button
                    key={p._id}
                    onClick={() => selectProduct(p)}
                    className="w-full flex items-center justify-between p-4 bg-pos-card border border-pos-border rounded-xl hover:border-pos-accent transition-colors text-left"
                  >
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-pos-muted text-xs mt-0.5">{p.category} · Stock: {p.stock}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-pos-accent font-bold">${fmt(p.finalPrice || p.price)}</p>
                      {p.stock === 0 && <span className="text-red-400 text-xs">Out of stock</span>}
                    </div>
                  </button>
                ))}
              </div>
            ) : search.length > 0 ? (
              <p className="text-center text-pos-muted py-10">No products found</p>
            ) : (
              <p className="text-center text-pos-muted py-10">Start typing to search products</p>
            )}
          </div>
        ) : (
          /* Quantity + confirm */
          <div className="space-y-4">
            {/* Selected product */}
            <div className="bg-pos-card border border-pos-accent rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">{selected.name}</p>
                <p className="text-pos-muted text-sm">{selected.category} · {selected.stock} available</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-pos-border text-pos-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quantity control */}
            <div className="bg-pos-card border border-pos-border rounded-xl p-4">
              <label className="text-pos-muted text-sm mb-3 block">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQty(Math.max(0.5, qty - (qty <= 1 ? 0.5 : 1)))}
                  className="h-12 w-12 rounded-xl bg-pos-border flex items-center justify-center hover:bg-pos-accent/20 transition-colors"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(Math.max(0.001, Number(e.target.value)))}
                  className="flex-1 text-center text-3xl font-bold bg-transparent border-none outline-none text-white"
                />
                <button
                  onClick={() => setQty(Math.min(selected.stock, qty + 1))}
                  disabled={qty >= selected.stock}
                  className="h-12 w-12 rounded-xl bg-pos-border flex items-center justify-center hover:bg-pos-accent/20 transition-colors disabled:opacity-40"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Profit breakdown */}
            <div className="bg-pos-card border border-pos-border rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-pos-muted">Price per unit</span>
                <span>${fmt(price)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-pos-muted">Revenue</span>
                <span className="text-yellow-400 font-medium">${fmt(revenue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-pos-muted">Cost</span>
                <span className="text-red-400">${fmt(cost)}</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-pos-border pt-3">
                <span>Profit</span>
                <span className={profit >= 0 ? 'text-pos-accent' : 'text-red-400'}>${fmt(profit)}</span>
              </div>
            </div>

            {/* Note */}
            <input
              className="w-full bg-pos-card border border-pos-border rounded-xl px-4 py-3 text-sm text-white placeholder-pos-muted focus:outline-none focus:border-pos-accent"
              placeholder="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            {/* Confirm button */}
            <button
              onClick={handleConfirm}
              disabled={isSubmitting || qty <= 0 || qty > selected.stock}
              className="w-full flex items-center justify-center gap-2 bg-pos-accent hover:bg-pos-accentHover disabled:opacity-50 text-white font-bold text-lg py-4 rounded-xl transition-colors"
            >
              <CheckCircle className="h-5 w-5" />
              {isSubmitting ? 'Processing...' : 'Confirm Sale'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
