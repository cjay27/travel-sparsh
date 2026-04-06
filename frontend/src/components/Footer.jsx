import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { newsletterAPI } from '../utils/api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollTo = useCallback((sectionId) => {
    if (location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    }
  }, [location, navigate]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await newsletterAPI.subscribe(email);
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      alert(err.response?.data?.message || 'Subscription failed');
    }
  };


  const POPULAR_ROUTES = [
    'Delhi → Mumbai', 'Mumbai → Bangalore', 'Delhi → Goa',
    'Chennai → Delhi', 'Kolkata → Mumbai', 'Bangalore → Srinagar',
    'Delhi → Jaipur', 'Mumbai → Kochi',
  ];

  return (
    <footer className="bg-[#060d2e] text-slate-400">

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <button onClick={() => scrollTo('home')} className="flex items-center gap-3 mb-6 group text-left">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center p-2 shadow-inner border border-white/5 transition-transform duration-300 group-hover:scale-105">
                <img src={logo} alt="Travel Sparsh" className="w-full h-full object-contain filter brightness-110" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">
                Travel <span className="">Sparsh</span>
              </span>
            </button>

            <p className="text-sm leading-relaxed mb-5">
              Your personal travel expert — finding the best flight deals on domestic and international routes so you can travel more for less.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[
                {
                  label: 'Facebook',
                  href: '#',
                  hoverBg: 'hover:bg-[#1877F2]',
                  hoverShadow: 'hover:shadow-[0_0_16px_rgba(24,119,242,0.5)]',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.03 4.388 11.028 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796v8.437C19.612 23.101 24 18.103 24 12.073z" />
                    </svg>
                  ),
                },
                {
                  label: 'Instagram',
                  href: '#',
                  hoverBg: 'hover:bg-gradient-to-br',
                  hoverShadow: 'hover:shadow-[0_0_16px_rgba(225,48,108,0.5)]',
                  gradientStyle: true,
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  ),
                },
                {
                  label: 'YouTube',
                  href: '#',
                  hoverBg: 'hover:bg-[#FF0000]',
                  hoverShadow: 'hover:shadow-[0_0_16px_rgba(255,0,0,0.45)]',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  ),
                },
                {
                  label: 'WhatsApp',
                  href: '#',
                  hoverBg: 'hover:bg-[#25D366]',
                  hoverShadow: 'hover:shadow-[0_0_16px_rgba(37,211,102,0.45)]',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  ),
                },
                {
                  label: 'X (Twitter)',
                  href: '#',
                  hoverBg: 'hover:bg-[#000000]',
                  hoverShadow: 'hover:shadow-[0_0_16px_rgba(255,255,255,0.15)]',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                    </svg>
                  ),
                },
              ].map((s, i) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className={`group relative w-9 h-9 bg-white/5 border border-white/10 ${s.hoverBg} rounded-xl flex items-center justify-center text-white/50 hover:text-white ${s.hoverShadow} transition-all duration-300 hover:-translate-y-1 hover:border-transparent`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Ping animation on hover */}
                  <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 group-hover:animate-ping bg-white/10 pointer-events-none" />
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className='text-left'>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Quick Links</h3>
            <ul className="space-y-3 flex flex-col items-start justify-center">
              {[
                { label: 'Home', section: 'home' },
                { label: 'Our Services', section: 'features' },
                { label: 'How It Works', section: 'process' },
                { label: 'Destinations', section: 'destinations' },
                { label: 'Contact Us', section: 'contact' },
              ].map(l => (
                <li key={l.label}>
                  <button onClick={() => scrollTo(l.section)}
                    className="text-sm hover:text-primary-400 transition-colors duration-200 flex items-center gap-1.5 text-left">
                    <span className="text-primary-600 text-xs">›</span>{l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            {/* Contact info */}
            <div className="space-y-3">
              <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Contact</h3>
              {[
                { icon: '📞', label: '+91 98765 43210' },
                { icon: '✉️', label: 'travelsparsh@gmail.com' },
                { icon: '⏰', label: '24 × 7 Support' },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-2 text-sm hover:text-primary-400 transition-colors cursor-default">
                  <span className="text-base">{c.icon}</span>
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter + Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Stay Updated</h3>
            <p className="text-sm mb-4">Get exclusive deals and travel tips straight to your inbox.</p>

            {subscribed ? (
              <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-xl p-4 text-center mb-5">
                <p className="text-emerald-400 font-bold text-sm">🎉 You're subscribed!</p>
                <p className="text-emerald-500/70 text-xs mt-1">Great deals are on their way.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2 mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <button type="submit"
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-2.5 rounded-xl text-sm transition-all active:scale-95">
                  Subscribe →
                </button>
              </form>
            )}


          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} Travel Sparsh. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500">
            {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Cookie Policy'].map(t => (
              <a key={t} href="#" className="hover:text-slate-300 transition-colors">{t}</a>
            ))}
            <Link to="/admin/login" className="hover:text-slate-400 transition-colors opacity-40 hover:opacity-70">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
