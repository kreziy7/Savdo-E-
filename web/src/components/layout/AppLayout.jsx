import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Package, ShoppingCart, BarChart2, LogOut, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../store/authStore';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const langs = [
    { code: 'uz', label: 'UZ' },
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' }
  ];

  return (
    <div className="flex gap-1 p-1 bg-slate-100 rounded-xl overflow-hidden">
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => i18n.changeLanguage(l.code)}
          className={`flex-1 text-[10px] font-bold py-1.5 rounded-lg transition ${i18n.language.startsWith(l.code)
            ? 'bg-white text-green-600 shadow-sm'
            : 'text-slate-500 hover:bg-white/50'
            }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}


function NavItem({ item, mobile = false }) {
  const Icon = item.icon;
  if (mobile) {
    return (
      <NavLink
        to={item.to}
        end={item.to === '/'}
        className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all min-w-[60px] ${isActive
            ? 'text-green-600'
            : 'text-slate-500 hover:text-green-600'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-green-50' : ''}`}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="text-[11px] font-medium">{item.label}</span>
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
        `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${isActive
          ? 'bg-green-500 text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`
      }
    >
      <Icon size={20} strokeWidth={2} />
      <span>{item.label}</span>
    </NavLink>
  );
}

export default function AppLayout() {
  const { t, i18n } = useTranslation();
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const translatedNavItems = [
    { to: '/', label: t('dashboard'), icon: Home },
    { to: '/products', label: t('products'), icon: Package },
    { to: '/sales', label: t('sales'), icon: ShoppingCart },
    { to: '/reports', label: t('reports'), icon: BarChart2 },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* ── Desktop Sidebar ─────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-[220px] min-h-screen bg-white border-r border-[#E2E8F0] fixed left-0 top-0 bottom-0 z-30">
        {/* Logo */}
        <div className="px-5 py-6 border-b border-[#E2E8F0] flex items-center justify-between">
          <span className="text-2xl font-extrabold text-green-500 tracking-tight">SAVDO</span>
          <Globe size={18} className="text-slate-300" />
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {translatedNavItems.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}
        </nav>

        {/* Language & Logout */}
        <div className="px-3 py-4 border-t border-[#E2E8F0] flex flex-col gap-3">
          <LanguageSwitcher />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────── */}
      <main className="flex-1 md:ml-[220px] pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* ── Mobile Bottom Tab Bar ───────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] z-30 flex items-center justify-around px-2 py-1 safe-area-pb">
        {translatedNavItems.map((item) => (
          <NavItem key={item.to} item={item} mobile />
        ))}
        {/* Simple mobile lang toggle */}
        <button
          onClick={() => {
            const current = i18n.language.startsWith('uz') ? 'ru' : i18n.language.startsWith('ru') ? 'en' : 'uz';
            i18n.changeLanguage(current);
          }}
          className="p-3 text-slate-500 font-bold text-xs"
        >
          {i18n.language.substring(0, 2).toUpperCase()}
        </button>
      </nav>

    </div>
  );
}
