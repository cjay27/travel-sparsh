import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { useLoading } from '../../context/LoadingContext';
import logo from '../../../assets/images/logo.png';

const NAV_ITEMS = [
  {
    label: 'Dashboard', path: '/admin',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" /><rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" />
        <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" /><rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" />
      </svg>
    ),
  },
  {
    label: 'Airlines', path: '/admin/airlines',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
  },
  {
    label: 'Customers', path: '/admin/customers',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zm12 4a4 4 0 10-8 0 4 4 0 008 0zm-4 6v2m-2-2h4" />
      </svg>
    ),
  },
  {
    label: 'Admin Users', path: '/admin/users',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    label: 'Packages', path: '/admin/packages',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    label: 'Airports (IATA)', path: '/admin/airports',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: 'Testimonials', path: '/admin/testimonials',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    label: 'Newsletter', path: '/admin/newsletter',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },

];

const Sidebar = ({ admin, logout, navigate, location, setSidebarOpen }) => {
  const { showLoader, hideLoader } = useLoading();
  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const handleNav = (path) => {
    if (location.pathname === path) {
      setSidebarOpen(false);
      return;
    }
    setSidebarOpen(false);
    navigate(path);
  };

  return (
    <aside className="flex flex-col h-full bg-[#003d54] text-white">
      {/* Logo Section */}
      <div className="px-6 py-5 border-b border-white/10 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-white/15 rounded-full flex items-center justify-center shadow-inner">
            <img src={logo} alt="Travel Sparsh Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="font-black text-base leading-tight tracking-tight">TravelSparsh</p>
            {/* <p className="text-[10px] text-blue-300 font-bold uppercase tracking-[0.2em] mt-0.5 opacity-80">Admin Panel</p> */}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.map(item => {
          const active = item.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.path);
          return (
            <button key={item.path} onClick={() => handleNav(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 text-left group ${active
                ? 'bg-white text-[#003d54] shadow-lg shadow-black/10'
                : 'text-blue-100/70 hover:bg-white/10 hover:text-white'
                }`}>
              <span className={`transition-colors ${active ? 'text-[#003d54]' : 'text-blue-300 group-hover:text-white'}`}>{item.icon}</span>
              {item.label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />}
            </button>
          );
        })}
      </nav>

    </aside>
  );
};


const AdminLayout = ({ children, title, subtitle, actions }) => {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);


  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!admin) navigate('/admin/login', { replace: true });
  }, [admin, navigate]);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-64 flex-shrink-0">
        <Sidebar admin={admin} logout={logout} navigate={navigate} location={location} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm shadow-2xl" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 flex flex-col bg-[#003d54] z-10 shadow-2xl">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Sidebar admin={admin} logout={logout} navigate={navigate} location={location} setSidebarOpen={setSidebarOpen} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 bg-white border-b border-slate-200 px-5 py-3.5 flex items-center justify-between gap-4 shadow-sm z-50">
          <div className="flex items-center gap-4 min-w-0">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="min-w-0">
              <h1 className="text-xl font-black text-slate-900 truncate tracking-tight">{title}</h1>
              {subtitle && <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {actions}
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
              Active
            </div>

            <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />

            <div className="flex items-center gap-3 pl-1">
              <div className="hidden md:block text-right">
                <p className="text-xs font-black text-slate-900 leading-none">{admin?.name ?? 'Admin'}</p>
                <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-tighter">Administrator</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white font-black text-xs shadow-md border border-white/20">
                {admin?.name?.charAt(0) ?? 'A'}
              </div>
              <button
                onClick={() => setLogoutModalOpen(true)}
                className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100 group"
                title="Sign Out"
              >

                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>

        </header>

        {/* Scrollable Main */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-8 bg-slate-50/50">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal open={logoutModalOpen} title="Sign Out Confirmation" onClose={() => setLogoutModalOpen(false)} size="md">
        <div className="text-center ">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-white shadow-sm">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <h4 className="text-slate-900 font-black text-lg mb-2">Are you sure?</h4>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed px-4">
            You are about to sign out of the <span className="font-bold text-slate-900">Travel Sparsh</span> admin panel.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setLogoutModalOpen(false)} className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-all">
              Cancel
            </button>
            <button
              onClick={() => { logout(); navigate('/admin/login'); }}
              className="flex-1 px-4 py-3 rounded-2xl bg-[#003d54] text-white font-bold text-sm hover:shadow-lg hover:shadow-blue-900/20 active:scale-95 transition-all"
            >
              Confirm Log Out
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};


// ─── Shared UI components ──────────────────────────────────────────────────────

export const SearchBar = ({ value, onChange, placeholder = 'Search…' }) => (
  <div className="relative">
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" />
  </div>
);

export const Badge = ({ label, color = 'blue' }) => {
  const map = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${map[color] ?? map.blue}`}>
      {label}
    </span>
  );
};

export const Pagination = ({ current, total, onChange }) => {
  if (total <= 1) return null;
  const pages = [];
  const delta = 2;
  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) pages.push(i);
  return (
    <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Page {current} of {total}</p>
      <div className="flex gap-1.5">
        <button disabled={current === 1} onClick={() => onChange(current - 1)}
          className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-600 text-lg flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          ‹
        </button>
        {pages.map(p => (
          <button key={p} onClick={() => onChange(p)}
            className={`w-9 h-9 rounded-xl border text-xs font-black flex items-center justify-center transition-all ${p === current ? 'bg-[#003d54] text-white border-[#003d54] shadow-lg shadow-blue-900/20' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
            {p}
          </button>
        ))}
        <button disabled={current === total} onClick={() => onChange(current + 1)}
          className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-600 text-lg flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          ›
        </button>
      </div>
    </div>
  );
};

export const Modal = ({ open, title, onClose, children, size = 'md' }) => {
  if (!open) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-3xl' };
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />
      <div className={`relative bg-white rounded-3xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] flex flex-col overflow-hidden animate-slide-up border border-white/20`}>
        <div className="flex items-center justify-between px-8 py-3 border-b border-slate-100 flex-shrink-0 bg-slate-50/50">
          <h3 className="font-black text-slate-900 text-lg tracking-tight">{title}</h3>
          <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all border border-transparent hover:border-slate-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-8 py-6">{children}</div>
      </div>
    </div>
  );
};

export const FormField = ({ label, required, error, children }) => (
  <div>
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">
      {label}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-[10px] font-bold mt-1.5 flex items-center gap-1">
      <span className="w-1 h-1 rounded-full bg-red-500" /> {error}
    </p>}
  </div>
);

export const Input = ({ className = '', ...props }) => (
  <input {...props}
    className={`w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 placeholder-slate-400 bg-slate-50/30 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all shadow-inner-sm ${className}`} />
);

export const Select = ({ className = '', children, ...props }) => (
  <select {...props}
    className={`w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-slate-50/30 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer ${className}`}>
    {children}
  </select>
);

export const StatCard = ({ icon, label, value, sub, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    red: 'bg-red-50 text-red-600 border-red-100',
  };
  return (
    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
          <p className="text-4xl font-black text-slate-900 tracking-tight">{value}</p>
          {sub && <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {sub}</p>}
        </div>
        <div className={`w-14 h-14 rounded-2xl ${colors[color]} border flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
