import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    LogOut,
    ChevronRight
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: ShoppingCart, label: 'Orders', path: '/orders' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
    return (
        <aside className="w-80 h-screen bg-white border-r border-slate-200 flex flex-col pt-8 pb-10 transition-all shadow-2xl shadow-slate-100">
            <div className="flex items-center gap-4 px-10 mb-12">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-2xl shadow-slate-900/20 ring-4 ring-slate-100">
                    S
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-black text-slate-900 tracking-tighter">SAVDO-(E)</span>
                    <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase leading-none">Admin Workspace</span>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
                <div className="px-6 mb-4 text-[11px] font-bold text-slate-400 tracking-[0.2em] uppercase">MAIN MENU</div>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            twMerge(
                                "group flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm",
                                isActive
                                    ? "bg-slate-900 text-white shadow-2xl shadow-slate-900/10 scale-[1.02]"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className="flex items-center gap-4">
                                    <item.icon className={twMerge("w-5 h-5", isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-900")} strokeWidth={2.5} />
                                    <span>{item.label}</span>
                                </div>
                                {isActive && <ChevronRight className="w-4 h-4 text-indigo-400 opacity-60" strokeWidth={3} />}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto px-4">
                <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all font-bold text-sm">
                    <LogOut className="w-5 h-5" strokeWidth={2.5} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
