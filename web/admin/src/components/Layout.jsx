import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-slate-200">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black text-slate-900 tracking-tight capitalize">
                            Welcome back, Admin
                        </h1>
                        <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase mt-1">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col text-right">
                            <span className="text-sm font-black text-slate-900 tracking-tight">John Doe</span>
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Administrator</span>
                        </div>
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl shadow-2xl shadow-indigo-100 flex items-center justify-center text-white font-black ring-4 ring-slate-50">
                            JD
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 bg-slate-50/50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
