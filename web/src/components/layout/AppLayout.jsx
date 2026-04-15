import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Package, ShoppingCart, BarChart2, Settings, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../store/authStore';

function NavItem({ item, mobile = false }) {
  const Icon = item.icon;

  if (mobile) {
    return (
      <NavLink
        to={item.to}
        end={item.to === '/'}
        className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all min-w-[52px] ${
            isActive ? 'text-green-600' : 'text-slate-400 hover:text-green-600'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-green-50' : ''}`}>
              <Icon size={21} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-semibold leading-tight">{item.label}</span>
          </>
        )}
      </NavLink>
    );
  }

  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
          isActive
            ? 'bg-green-500 text-white shadow-sm'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
        }`
      }
    >
      <Icon size={18} strokeWidth={2} />
      <span>{item.label}</span>
    </NavLink>
  );
}

export default function AppLayout() {
  const { t } = useTranslation();

  const navItems = [
    { to: '/',         label: t('dashboard'), icon: Home },
    { to: '/products', label: t('products'),  icon: Package },
    { to: '/sales',    label: t('sales'),     icon: ShoppingCart },
    { to: '/reports',  label: t('reports'),   icon: BarChart2 },
    { to: '/settings', label: t('settings'),  icon: Settings },
    { to: '/profile',  label: t('profile'),   icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">

      {/* ── Desktop Sidebar ──────────────────────── */}
      <aside className="hidden md:flex flex-col w-[220px] min-h-screen bg-white border-r border-[#E2E8F0] fixed left-0 top-0 bottom-0 z-30">
        {/* Logo */}
        <div className="px-5 py-6 border-b border-[#E2E8F0]">
          <span className="text-2xl font-extrabold text-green-500 tracking-tight">SAVDO</span>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">Business Manager</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}
        </nav>
      </aside>

      {/* ── Main content ─────────────────────────── */}
      <main className="flex-1 md:ml-[220px] pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* ── Mobile Bottom Tab Bar ────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] z-30 flex items-center justify-around px-1 py-1 safe-area-pb">
        {navItems.map((item) => (
          <NavItem key={item.to} item={item} mobile />
        ))}
      </nav>

    </div>
  );
}
