import { TrendingUp, ShoppingBag, Box, Users, ArrowRight } from 'lucide-react';

const stats = [
    { label: 'Total Sales', value: '$84,240', trend: '+12.5%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'New Orders', value: '1,245', trend: '+5.2%', icon: ShoppingBag, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Total Products', value: '458', trend: '-2.1%', icon: Box, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'New Customers', value: '892', trend: '+14.8%', icon: Users, color: 'text-amber-500', bg: 'bg-amber-50' },
];

const recentActivities = [
    { id: 1, title: 'New order #ORD-7402', description: 'Malika R. just placed an order for 3 items.', time: '2 mins ago' },
    { id: 2, title: 'Inventory Alert: iPhone 15 Pro', description: 'Low stock detected (2 units remaining).', time: '15 mins ago' },
    { id: 3, title: 'Customer Review', description: 'Jamshid K. left 5 stars for Leather Jacket.', time: '1 hour ago' },
];

export default function Dashboard() {
    return (
        <div className="flex flex-col gap-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="group relative bg-white p-8 rounded-[32px] border border-slate-200/60 shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 cursor-pointer overflow-hidden active:scale-95">
                        <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} -mr-16 -mt-16 rounded-full opacity-20 group-hover:scale-125 transition-transform duration-700`}></div>
                        <div className="relative flex flex-col gap-4">
                            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-500`}>
                                <stat.icon className="w-7 h-7" strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-400 tracking-tight">{stat.label}</span>
                                <span className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${stat.trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {stat.trend}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">since last month</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-200/50 p-10 flex flex-col gap-8 shadow-2xl shadow-slate-100">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Recent Activities</h3>
                        <button className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] border-b-2 border-indigo-200 pb-1 flex items-center gap-2 hover:border-indigo-600 transition-all font-black">
                            View Analytics <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="flex flex-col gap-6">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="group flex flex-wrap md:flex-nowrap items-center justify-between p-6 rounded-3xl bg-slate-50/30 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200 border-dashed">
                                <div className="flex gap-6 items-center">
                                    <div className="w-[60px] h-[60px] bg-white rounded-3xl flex items-center justify-center shadow-lg shadow-slate-200/40 text-slate-300 group-hover:text-indigo-500 transition-all">
                                        <Box className="w-7 h-7" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-base font-black text-slate-800 tracking-tight">{activity.title}</span>
                                        <span className="text-sm font-bold text-slate-400 leading-tight">{activity.description}</span>
                                    </div>
                                </div>
                                <span className="text-xs font-black text-slate-400 opacity-60 uppercase mt-4 md:mt-0">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[40px] p-10 flex flex-col justify-between text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group min-h-[400px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 -mr-20 -mt-20 rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="relative flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-xl border border-white/10">
                                ⚡
                            </div>
                            <span className="text-xs font-black tracking-[0.2em] uppercase text-white/40">Premium Feature</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h3 className="text-3xl font-black tracking-tighter leading-[1.1]">Unlock AI Product Insights</h3>
                            <p className="text-slate-400 text-sm font-bold leading-relaxed">Let our artificial intelligence predict your stock needs and identify trending products automatically.</p>
                        </div>
                    </div>
                    <button className="relative w-full py-5 bg-white text-slate-900 rounded-3xl font-black text-sm uppercase tracking-[0.1em] shadow-2xl hover:bg-slate-50 active:scale-[0.98] transition-all">
                        Upgrade Plan
                    </button>
                </div>
            </div>
        </div>
    );
}
