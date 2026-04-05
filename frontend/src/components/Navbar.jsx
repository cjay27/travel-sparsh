import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logo from '../../assets/images/logo.png';

// ── Inline SVG icons ────────────────────────────────────────────────────────
const PlaneIcon = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" opacity=".2" />
    <path d="M12 2L2 7l10 5 10-5-10-5zm0 13l-10-5v6l10 5 10-5v-6l-10 5z" />
  </svg>
);

const SunIcon = () => (
  <svg className="w-4.5 h-4.5 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
);

const ChevronDown = ({ open }) => (
  <svg
    className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    fill="none" stroke="currentColor" viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
  </svg>
);

const ArrowRight = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────

const NAV = [
  { label: 'Home', section: 'home' },
  { label: 'Services', section: 'features' },
  { label: 'Destinations', section: 'destinations' },
  { label: 'How It Works', section: 'process' },
  { label: 'Contact', section: 'contact' },
];

const Navbar = () => {
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef();

  // Scroll detection & Active section tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (location.pathname === '/') {
        let current = 'home';
        NAV.forEach((navItem) => {
          const section = document.getElementById(navItem.section);
          if (section) {
            // Check if user scrolled past the top of the section (with some offset)
            if (window.scrollY >= section.offsetTop - 150) {
              current = navItem.section;
            }
          }
        });
        setActiveSection(current);
      } else {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Close user-menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close menus on route change
  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false); }, [location]);

  const handleLogout = async () => { await logout(); navigate('/'); };

  const scrollTo = useCallback((sectionId) => {
    setMenuOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  }, [location.pathname, navigate]);

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        bg-white dark:bg-slate-900
        transition-all duration-300
        nav-entrance
        ${scrolled
          ? 'shadow-[0_2px_20px_rgba(0,0,0,0.10)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.35)]'
          : 'border-b border-slate-100 dark:border-slate-800'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px] gap-4">

          {/* ── Logo ─────────────────────────────────────────────────── */}
          <button onClick={() => scrollTo('home')}
            className="flex items-center group flex-shrink-0 focus:outline-none"
          >
            {/* Logo Placeholder (Replace with your actual blue logo later) */}
            <img src={logo} alt="Travel Sparsh"
              className="h-16 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                // Fallback for styling/testing if logo isn't there yet
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            {/* Sea blue: #1b3b6b */}
            {/* Text color: #1d3d46 */}
            <p className='text-[#1d3d46] dark:text-white font-semibold text-lg ml-2'>Travel Sparsh</p>
          </button>

          {/* ── Desktop Nav ────────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-0.5 ml-auto mr-2">
            {NAV.map(n => (
              <button
                key={n.section}
                onClick={() => scrollTo(n.section)}
                className={`relative px-3.5 py-2 text-sm font-semibold transition-colors duration-200 group rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 ${activeSection === n.section ? 'text-[#f97316]' : 'text-slate-600 dark:text-slate-300 hover:text-[#f97316] dark:hover:text-[#f97316]'}`}
              >
                {n.label}
                {/* Animated underline */}
                <span
                  className={`absolute bottom-1 left-3.5 right-3.5 h-0.5 rounded-full origin-left transition-transform duration-250 ${activeSection === n.section ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                  style={{ background: '#f97316' }}
                />
              </button>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="relative px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors hover:bg-amber-50 dark:hover:bg-amber-900/20"
                style={{ color: '#f97316' }}
              >
                ⚙ Admin
              </Link>
            )}
          </div>

          {/* ── Right cluster ─────────────────────────────────────────── */}
          <div className="flex items-center gap-1.5 flex-shrink-0">

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Auth — desktop */}
            {isAuthenticated ? (
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                >
                  {/* Avatar */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-dark))' }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 max-w-[80px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown open={userMenuOpen} />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-slide-down">
                    {/* Header */}
                    <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-700"
                      style={{ background: 'linear-gradient(135deg, var(--brand-light), #fff)' }}>
                      <p className="font-bold text-sm text-slate-900 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
                    </div>
                    {/* Links */}
                    <div className="py-1.5">
                      {[
                        { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
                        { to: '/bookings', label: 'My Bookings', icon: '📋' },
                      ].map(l => (
                        <Link key={l.to} to={l.to}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <span>{l.icon}</span>{l.label}
                        </Link>
                      ))}
                      {isAdmin && (
                        <Link to="/admin"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                          style={{ color: '#f97316' }}>
                          <span>⚙</span> Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
                        >
                          <span>→</span> Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6h16M4 12h16M4 18h10" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ───────────────────────────────────────────────────── */}
      <div
        className={`
          lg:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${menuOpen ? 'max-h-[560px] opacity-100' : 'max-h-0 opacity-0'}
          bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800
        `}
      >
        <div className="px-4 pt-3 pb-5 space-y-1">
          {/* Nav links */}
          {NAV.map(n => (
            <button
              key={n.section}
              onClick={() => scrollTo(n.section)}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeSection === n.section ? 'text-brand bg-slate-50 dark:bg-slate-800' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand'}`}
            >
              {n.label}
            </button>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
              style={{ color: '#f97316' }}
            >
              ⚙ Admin Panel
            </Link>
          )}

          {/* Divider */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-3">
            {isAuthenticated ? (
              <div className="space-y-1">
                {/* User info */}
                <div className="flex items-center gap-3 px-4 py-2 mb-2">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-dark))' }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{user?.name}</p>
                    <p className="text-xs text-slate-400 leading-tight">{user?.email}</p>
                  </div>
                </div>
                <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  🏠 Dashboard
                </Link>
                <Link to="/bookings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  📋 My Bookings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  → Sign Out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
