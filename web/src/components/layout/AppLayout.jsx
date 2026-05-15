import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Package, ShoppingCart, BarChart2, Settings, User, ShieldCheck, LogOut } from 'lucide-react';
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
            isActive ? 'text-[#2D8B35]' : 'text-[#7AAA7C] hover:text-[#2D8B35]'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-[#EAF3E5]' : ''}`}>
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
            ? 'bg-[#2D8B35] text-white shadow-sm'
            : 'text-[#3C6B42] hover:bg-[#EAF3E5] hover:text-[#182A1A]'
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
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(user?.role);

  const navItems = [
    { to: '/',         label: t('dashboard'), icon: Home },
    { to: '/products', label: t('products'),  icon: Package },
    { to: '/sales',    label: t('sales'),     icon: ShoppingCart },
    { to: '/reports',  label: t('reports'),   icon: BarChart2 },
    { to: '/settings', label: t('settings'),  icon: Settings },
    { to: '/profile',  label: t('profile'),   icon: User },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F5F8F3] flex">

      {/* ── Desktop Sidebar ──────────────────────── */}
      <aside className="hidden md:flex flex-col w-[220px] min-h-screen bg-white border-r border-[#C6DEC0] fixed left-0 top-0 bottom-0 z-30">
        {/* Logo */}
        <div className="px-5 py-6 border-b border-[#C6DEC0]">
          <span className="text-2xl font-extrabold text-[#2D8B35] tracking-tight">SAVDO</span>
          <p className="text-[11px] text-[#7AAA7C] font-medium mt-0.5">Business Manager</p>
        </div>

        {/* User info */}
        <div className="px-4 py-3 border-b border-[#C6DEC0] flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#EAF3E5] flex items-center justify-center text-[#2D8B35] font-bold text-sm flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#182A1A] truncate">{user?.name}</p>
            <p className="text-[10px] text-[#7AAA7C] truncate">{user?.role}</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}

          {/* Admin section */}
          {isAdmin && (
            <>
              <div className="mt-4 mb-1 px-3">
                <p className="text-[10px] font-semibold text-[#7AAA7C] uppercase tracking-wider">Admin</p>
              </div>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-500 text-white shadow-sm'
                      : 'text-indigo-500 hover:bg-indigo-50'
                  }`
                }
              >
                <ShieldCheck size={18} strokeWidth={2} />
                <span>Admin Panel</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Logout */}
        <div className="px-3 py-3 border-t border-[#C6DEC0]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-[#3C6B42] hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <LogOut size={18} strokeWidth={2} />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────── */}
      <main className="flex-1 md:ml-[220px] pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* ── Mobile Bottom Tab Bar ────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#C6DEC0] z-30 flex items-center justify-around px-1 py-1 safe-area-pb">
        {navItems.slice(0, 5).map((item) => (
          <NavItem key={item.to} item={item} mobile />
        ))}
        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all min-w-[52px] ${
                isActive ? 'text-indigo-600' : 'text-[#7AAA7C] hover:text-indigo-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-indigo-50' : ''}`}>
                  <ShieldCheck size={21} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-semibold leading-tight">Admin</span>
              </>
            )}
          </NavLink>
        )}
      </nav>

    </div>
  );
}
