import { Plus, Search, Filter, MoreVertical, Edit, Trash2 } from 'lucide-react';

const products = [
    { id: 1, name: 'iPhone 15 Pro Max', category: 'Electronics', price: '$1,199.00', stock: 24, status: 'Active', image: '📱' },
    { id: 2, name: 'MacBook Air M2', category: 'Electronics', price: '$999.00', stock: 12, status: 'Active', image: '💻' },
    { id: 3, name: 'Sony WH-1000XM5', category: 'Audio', price: '$349.00', stock: 0, status: 'Out of Stock', image: '🎧' },
    { id: 4, name: 'Leather Messenger Bag', category: 'Fashion', price: '$129.00', stock: 85, status: 'Active', image: '💼' },
];

export default function Products() {
    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Product Catalog</h2>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Manage {products.length} items in your store</p>
                </div>
                <button className="flex items-center gap-3 px-8 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[32px] font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-indigo-200 active:scale-95 group shrink-0">
                    <Plus className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" strokeWidth={3} />
                    Add New Product
                </button>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-200/50 flex flex-col overflow-hidden shadow-2xl shadow-slate-100">
                <div className="p-8 border-b border-slate-100 flex flex-wrap items-center justify-between gap-6 bg-slate-50/20">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" strokeWidth={2.5} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full bg-white border border-slate-200 rounded-[28px] py-4 pl-16 pr-8 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all shadow-inner"
                        />
                    </div>
                    <button className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                        <Filter className="w-4 h-4" strokeWidth={3} />
                        Filter Catalog
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] w-16 text-center">Icon</th>
                                <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Product Details</th>
                                <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                                <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Price</th>
                                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Stock Status</th>
                                <th className="px-6 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="group hover:bg-slate-50/80 transition-all border-b border-slate-50">
                                    <td className="px-10 py-8 text-3xl text-center grayscale group-hover:grayscale-0 transition-all duration-500 opacity-60 group-hover:opacity-100">{product.image}</td>
                                    <td className="px-6 py-8">
                                        <div className="flex flex-col">
                                            <span className="text-base font-black text-slate-800 tracking-tight leading-none mb-1 group-hover:text-indigo-600 transition-colors">{product.name}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">SKU-{product.id.toString().padStart(6, '0')}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-8">
                                        <span className="px-4 py-2 bg-indigo-50 text-indigo-500 text-[10px] font-black uppercase tracking-widest rounded-xl border border-indigo-100/50">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-8 text-base font-black text-slate-800 tracking-tighter">{product.price}</td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col gap-2">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${product.stock === 0 ? 'text-rose-500' : 'text-slate-500'}`}>
                                                {product.stock === 0 ? 'Out of Stock' : `${product.stock} Units Available`}
                                            </span>
                                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${product.stock === 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-8">
                                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-dashed ${product.status === 'Active' ? 'bg-emerald-50/50 text-emerald-600 border-emerald-200/50' : 'bg-rose-50/50 text-rose-600 border-rose-200/50'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${product.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                            <button className="w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 flex items-center justify-center rounded-xl transition-all active:scale-90 shadow-sm leading-none">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 flex items-center justify-center rounded-xl transition-all active:scale-90 shadow-sm leading-none">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
