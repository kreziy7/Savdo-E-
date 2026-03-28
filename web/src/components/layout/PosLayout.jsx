import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, BarChart2, Plus } from 'lucide-react';

const nav = [
  { to: '/pos', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/pos/products', icon: Package, label: 'Products' },
  { to: '/pos/sales', icon: ShoppingCart, label: 'Sales' },
  { to: '/pos/reports', icon: BarChart2, label: 'Reports' },
];

export default function PosLayout() {
  return (
    <div className="flex h-screen bg-pos-bg overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-col border-r border-pos-border bg-pos-card">
        <div className="px-5 py-5 border-b border-pos-border">
          <span className="text-xl font-black text-pos-accent tracking-tight">SAVDO</span>
          <p className="text-pos-muted text-xs mt-0.5">Smart Trading</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {nav.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-pos-accent/20 text-pos-accent'
                    : 'text-pos-muted hover:bg-pos-border hover:text-white'
                }`
              }
            >
              <Icon className="h-4.5 w-4.5 h-5 w-5 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-pos-border">
          <NavLink to="/pos/sales/new" className="flex items-center gap-2 w-full bg-pos-accent hover:bg-pos-accentHover text-white font-semibold px-3 py-2.5 rounded-xl text-sm transition-colors">
            <Plus className="h-4 w-4" /> New Sale
          </NavLink>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-pos-card border-t border-pos-border flex">
        {nav.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 py-3 text-xs font-medium transition-colors ${
                isActive ? 'text-pos-accent' : 'text-pos-muted'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
        <NavLink to="/pos/sales/new" className="flex-1 flex flex-col items-center gap-0.5 py-3 text-xs font-medium text-pos-accent">
          <Plus className="h-5 w-5" /> Sale
        </NavLink>
      </div>
    </div>
  );
}
