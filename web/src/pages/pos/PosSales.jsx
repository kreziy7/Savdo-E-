import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as salesApi from '../../api/sales.api';

function fmt(n) { return Number(n || 0).toFixed(2); }

export default function PosSales() {
  const [tab, setTab] = useState('today');
  const today = new Date().toISOString().slice(0, 10);
  const firstOfMonth = new Date().toISOString().slice(0, 7) + '-01';

  const from = tab === 'today' ? today : firstOfMonth;
  const to = new Date().toISOString().slice(0, 10);

  const { data, isLoading } = useQuery({
    queryKey: ['pos-sales', tab],
    queryFn: () => salesApi.getSales({ from: `${from}T00:00:00`, to: `${to}T23:59:59`, limit: 100 }),
  });

  const sales = data?.data?.data?.sales || [];
  const totalRevenue = sales.reduce((s, x) => s + (x.totalRevenue || 0), 0);
  const totalProfit = sales.reduce((s, x) => s + (x.profit || 0), 0);

  return (
    <div className="min-h-screen bg-pos-bg text-pos-text p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sales</h1>
        <Link to="/pos/sales/new" className="flex items-center gap-2 bg-pos-accent hover:bg-pos-accentHover text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <ShoppingCart className="h-4 w-4" /> New Sale
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex bg-pos-card border border-pos-border rounded-xl p-1 w-fit mb-6">
        {['today', 'month'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-pos-accent text-white' : 'text-pos-muted hover:text-white'}`}>
            {t === 'today' ? 'Today' : 'This Month'}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-pos-card border border-pos-border rounded-xl p-4">
          <p className="text-pos-muted text-xs mb-1">Revenue</p>
          <p className="text-yellow-400 text-2xl font-bold">${fmt(totalRevenue)}</p>
        </div>
        <div className="bg-pos-card border border-pos-border rounded-xl p-4">
          <p className="text-pos-muted text-xs mb-1">Profit</p>
          <p className="text-pos-accent text-2xl font-bold">${fmt(totalProfit)}</p>
        </div>
      </div>

      {/* Sales list */}
      {isLoading ? (
        <div className="space-y-2">{[...Array(6)].map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-pos-card" />)}</div>
      ) : sales.length === 0 ? (
        <div className="text-center py-20 text-pos-muted">
          <ShoppingCart className="h-14 w-14 mx-auto mb-3 opacity-30" />
          <p>No sales recorded {tab === 'today' ? 'today' : 'this month'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sales.map((s) => (
            <div key={s._id} className="flex items-center justify-between p-4 bg-pos-card border border-pos-border rounded-xl">
              <div>
                <p className="font-medium">{s.productName}</p>
                <p className="text-pos-muted text-xs mt-0.5">
                  {s.quantity} {s.unit} × ${fmt(s.sellPrice)} · {new Date(s.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-yellow-400 font-medium">${fmt(s.totalRevenue)}</p>
                <div className="flex items-center gap-1 justify-end">
                  <TrendingUp className="h-3 w-3 text-pos-accent" />
                  <p className="text-pos-accent text-sm font-bold">${fmt(s.profit)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
