import React, { useState, useEffect, useRef, useCallback } from 'react';
import FlightSearch from '../components/FlightSearch';

// ─── Utility Hooks ─────────────────────────────────────────────────────────────
const useInView = (threshold = 0.12) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.unobserve(el); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
};

const useParallax = () => {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return y;
};

// ─── Animated Counter ──────────────────────────────────────────────────────────
const Counter = ({ target, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView(0.4);
  const started = useRef(false);
  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const duration = 2200;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(Math.floor(current));
      if (current >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>;
};

// ─── Reveal wrapper ────────────────────────────────────────────────────────────
const Reveal = ({ children, className = '', delay = 0, direction = 'up' }) => {
  const [ref, inView] = useInView();
  const transforms = {
    up: 'translateY(32px)',
    down: 'translateY(-32px)',
    left: 'translateX(-32px)',
    right: 'translateX(32px)',
    none: 'none',
  };
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? 'translate(0,0)' : transforms[direction],
      }}
    >
      {children}
    </div>
  );
};

// ─── SVG Icon Library ──────────────────────────────────────────────────────────
const Icons = {
  PriceTag: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Zap: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92v2z" />
    </svg>
  ),
  Plane: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <path d="M12 22V12M12 12L2 6.5M12 12l10-5.5" />
    </svg>
  ),
  ClipboardList: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  ),
  UserCheck: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <polyline points="17 11 19 13 23 9" />
    </svg>
  ),
  Ticket: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 010-6h20a3 3 0 010 6" />
      <path d="M2 15a3 3 0 000 6h20a3 3 0 000-6" />
      <path d="M2 9h20M2 15h20" />
    </svg>
  ),
  Mail: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Trophy: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 21 12 17 16 21" />
      <line x1="12" y1="17" x2="12" y2="11" />
      <path d="M7 4H4v6a8 8 0 0016 0V4h-3" />
      <line x1="7" y1="4" x2="17" y2="4" />
    </svg>
  ),
  Target: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
};



// ─── Data ──────────────────────────────────────────────────────────────────────
const AIRLINE_LOGOS = [
  { name: 'IndiGo', url: 'https://www.logo.wine/a/logo/IndiGo/IndiGo-Logo.wine.svg' },
  { name: 'Air India', url: 'https://www.logo.wine/a/logo/Air_India/Air_India-Logo.wine.svg' },
  { name: 'Vistara', url: 'https://www.logo.wine/a/logo/Vistara/Vistara-Logo.wine.svg' },
  { name: 'British Airways', url: 'https://www.logo.wine/a/logo/British_Airways/British_Airways-Logo.wine.svg' },
  { name: 'Air Asia', url: 'https://www.logo.wine/a/logo/AirAsia/AirAsia-Logo.wine.svg' },
  { name: 'Emirates', url: 'https://www.logo.wine/a/logo/Emirates_(airline)/Emirates_(airline)-Logo.wine.svg' },
  { name: 'Qatar Airways', url: 'https://www.logo.wine/a/logo/Qatar_Airways/Qatar_Airways-Logo.wine.svg' },
  { name: 'Singapore Airlines', url: 'https://www.logo.wine/a/logo/Singapore_Airlines/Singapore_Airlines-Logo.wine.svg' },
  { name: 'Lufthansa', url: 'https://www.logo.wine/a/logo/Lufthansa/Lufthansa-Logo.wine.svg' }
];

const DESTINATIONS = [
  { city: 'Goa', tag: 'Beach Paradise', price: 'from ₹3,499', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80' },
  { city: 'Jaipur', tag: 'Pink City', price: 'from ₹2,799', img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80' },
  { city: 'Srinagar', tag: 'Heaven on Earth', price: 'from ₹4,999', img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80' },
  { city: 'Kochi', tag: "God's Own Country", price: 'from ₹3,299', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80' },
  { city: 'Bangalore', tag: 'Garden City', price: 'from ₹2,499', img: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=600&q=80' },
  { city: 'Hyderabad', tag: 'City of Pearls', price: 'from ₹2,999', img: 'https://images.unsplash.com/photo-1626014303766-10af839f3a36?w=600&q=80' },
];

const FEATURES = [
  { Icon: Icons.PriceTag, title: 'Best Price Guarantee', desc: 'Our experts compare hundreds of options to secure the lowest fares — every single time.', color: 'from-emerald-500 to-teal-600', light: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { Icon: Icons.Target, title: 'Zero Hidden Fees', desc: 'What we quote is what you pay. Full transparency from search to seat.', color: 'from-blue-500 to-indigo-600', light: 'bg-blue-50 dark:bg-blue-900/20' },
  { Icon: Icons.Zap, title: 'Expert in 30 Mins', desc: 'A dedicated travel expert reaches out within 30 minutes of your enquiry.', color: 'from-amber-500 to-orange-600', light: 'bg-amber-50 dark:bg-amber-900/20' },
  { Icon: Icons.Shield, title: 'Secure & Trusted', desc: 'Your personal data and payments are protected with enterprise-grade security.', color: 'from-violet-500 to-purple-600', light: 'bg-violet-50 dark:bg-violet-900/20' },
  { Icon: Icons.Phone, title: '24 / 7 Support', desc: 'Round-the-clock assistance from real humans — not bots — before and during your trip.', color: 'from-rose-500 to-pink-600', light: 'bg-rose-50 dark:bg-rose-900/20' },
  { Icon: Icons.Plane, title: '500+ Airlines', desc: 'Access to every major domestic and international carrier from a single enquiry.', color: 'from-sky-500 to-cyan-600', light: 'bg-sky-50 dark:bg-sky-900/20' },
];

const STEPS = [
  { step: '01', Icon: Icons.ClipboardList, title: 'Fill Your Details', desc: 'Tell us your route, dates, and travel preferences. Takes under 2 minutes.', color: 'from-primary-500 to-primary-700' },
  { step: '02', Icon: Icons.UserCheck, title: 'Expert Contacts You', desc: 'A personal travel expert calls or WhatsApps you with curated options.', color: 'from-accent-500 to-orange-600' },
  { step: '03', Icon: Icons.Ticket, title: 'Fly at Best Price', desc: 'Pick your favourite deal. We handle everything — bookings to e-tickets.', color: 'from-emerald-500 to-teal-600' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', city: 'Delhi', rating: 5, text: 'Saved ₹4,200 on my Mumbai round-trip. The expert was incredibly helpful and responsive. Best travel experience ever!', avatar: 'PS', bg: 'from-pink-500 to-rose-500' },
  { name: 'Rahul Mehta', city: 'Bangalore', rating: 5, text: "Booked 6 flights through Travel Sparsh this year. Every time, the price was unbeatable and the process was seamless.", avatar: 'RM', bg: 'from-blue-500 to-indigo-500' },
  { name: 'Anjali Nair', city: 'Kochi', rating: 5, text: 'Got a last-minute Goa deal that was ₹3,000 cheaper than anything I found online. Their team is absolutely brilliant.', avatar: 'AN', bg: 'from-purple-500 to-violet-500' },
];

// ─── Main Component ────────────────────────────────────────────────────────────
const Home = () => {
  const scrollY = useParallax();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(id);
  }, []);

  const scrollToForm = useCallback(() => {
    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════════════
          HERO  —  #home  ·  Flight Image Background
      ══════════════════════════════════════════════════════════════════ */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">

        {/* Flight Image Background */}
        <div
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=1920')", /* High quality airplane wing / flight view */
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Dark Overlays for better text visibility */}
        <div className="absolute inset-0 bg-slate-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/10" />

        {/* ── Content ─────────────────────────────────────────────── */}
        <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">

          {/* Live badge */}
          <div className="flex justify-center mb-7 animate-fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              India's Trusted Flight Deal Finder
            </span>
          </div>

          {/* Headline */}
          <div className="text-center mb-9 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.5rem] font-black text-white leading-[1.05] tracking-tight mb-5">
              Fly Anywhere.
              <br />
              <span className="bg-gradient-to-r from-accent-400 via-orange-300 to-accent-500 bg-clip-text text-transparent">
                Save Big.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/65 max-w-2xl mx-auto font-light leading-relaxed">
              Tell us your destination — our travel experts find you deals
              no website can match.
            </p>
          </div>

          {/* Flight search form */}
          <div className="animate-slide-up max-w-6xl mx-auto">
            <FlightSearch />
          </div>

          {/* Modernized Stats Strip */}
          <div className="mt-12 flex justify-center animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 px-12 py-6 rounded-[2.5rem] bg-white/10 dark:bg-black/20 backdrop-blur-1xl border border-white/20 shadow-[0_16px_40px_-15px_rgba(0,0,0,0.5)]">
              {[
                { value: '250+', label: 'Happy Travellers' },
                { value: '400+', label: 'Airlines & Routes' },
                { value: '₹10 Cr+', label: 'Savings Delivered' },
                { value: '4.9★', label: 'Customer Rating' },
              ].map((s, i) => (
                <React.Fragment key={s.label}>
                  <div className="text-center flex flex-col items-center group">
                    <p className="text-2xl sm:text-3xl font-black text-white tracking-tight group-hover:scale-105 transition-transform duration-300">{s.value}</p>
                    <p className="text-xs text-slate-200 mt-1.5 font-medium uppercase tracking-wider">{s.label}</p>
                  </div>
                  {i < 3 && <div className="hidden md:block w-px h-14 bg-gradient-to-b from-transparent via-white/30 to-transparent" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade-out (blends into next section) */}
        <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none" style={{ background: 'linear-gradient(to top, #010d1a, transparent)', zIndex: 4 }} />
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FEATURES  —  #features
      ══════════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3">Why Travel Sparsh</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight">
              Everything You Need,<br />
              <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">Nothing You Don't</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mt-4 max-w-xl mx-auto">
              We cut through the noise so you spend less time searching and more time travelling.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="group relative p-8 rounded-[2rem] border border-white/60 dark:border-white/10 bg-slate-50/70 bg-white/95 dark:bg-[#020617]/95
backdrop-blur-xl
border border-white/40 dark:border-white/10/40 backdrop-blur-2xl hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-default">
                  <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-[0.04] dark:group-hover:opacity-[0.08] transition-opacity duration-500`} />
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500 text-white p-3`}>
                    <f.Icon />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{f.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${f.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          AIRLINES TICKER
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-12 bg-white 
      border-y border-slate-100 overflow-hidden relative">
        {/* dark:bg-slate-900 dark:border-slate-800 */}
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest">
            Bookings for top Airlines Worldwide
          </p>
        </div>

        {/* Ticker Container */}
        <div className="relative w-full flex items-center group">
          {/* Gradient masking for smooth edge fade */}
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-white-50 dark:from-white-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-white-50 dark:from-white-900 to-transparent z-10 pointer-events-none" />

          {/* Scanning Marquee */}
          <div className="animate-marquee gap-16 md:gap-28 pl-16 flex-shrink-0">
            {/* Render 3 repetitions to ensure continuous loop filling any screen width */}
            {[...AIRLINE_LOGOS, ...AIRLINE_LOGOS, ...AIRLINE_LOGOS].map((airline, i) => (
              <div key={i} className="flex-shrink-0 flex items-center justify-center opacity-100 hover:opacity-100  transition-all duration-300">
                <img
                  src={airline.url}
                  alt={airline.name}
                  className="h-32 md:h-32 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          HOW IT WORKS  —  #process
      ══════════════════════════════════════════════════════════════════ */}
      <section id="process" className="py-24 bg-slate-50 bg-white/95 dark:bg-[#020617]/95
backdrop-blur-xl
border border-white/40 dark:border-white/10/40 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent-600 dark:text-accent-400 mb-3">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white">
              Book in{' '}
              <span className="bg-gradient-to-r from-accent-500 to-orange-400 bg-clip-text text-transparent">
                3 Easy Steps
              </span>
            </h2>
          </Reveal>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {/* Animated connector line */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-0.5 bg-gradient-to-r from-primary-400 via-accent-400 to-emerald-400 rounded-full z-0" />

            {STEPS.map((s, i) => (
              <Reveal key={i} delay={i * 150} direction="up">
                <div className="relative z-10 flex flex-col items-center text-center group">
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-xl text-white p-4 group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300`}>
                      <s.Icon />
                    </div>
                    <span className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-xs font-black flex items-center justify-center shadow-md">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{s.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-[200px]">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={400} className="text-center mt-14">
            <button onClick={scrollToForm}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-95">
              Start My Enquiry
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          DESTINATIONS  —  #destinations
      ══════════════════════════════════════════════════════════════════ */}
      < section id="destinations" className="py-24 bg-white dark:bg-slate-900" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3">Popular Routes</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white">
              Dream Destinations,{' '}
              <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">Real Prices</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg max-w-lg mx-auto">
              Tap any destination — we'll find you the best deal.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {DESTINATIONS.map((d, i) => (
              <Reveal key={d.city} delay={i * 70} direction={i % 2 === 0 ? 'up' : 'down'}>
                <button onClick={scrollToForm}
                  className="group relative rounded-2xl overflow-hidden aspect-[3/4] w-full cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <img
                    src={d.img}
                    alt={d.city}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300'; }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs text-white font-semibold border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {d.tag}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-black text-base leading-tight">{d.city}</p>
                    <p className="text-accent-300 text-xs font-bold mt-0.5">{d.price}</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-white/95 text-slate-900 font-bold text-xs px-4 py-2 rounded-full shadow-lg">
                      Get Deal →
                    </span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          STATS  — theme-aware parallax section
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden
        bg-gradient-to-br from-primary-50 via-sky-50 to-white
        dark:bg-none dark:bg-gradient-to-br dark:from-primary-900 dark:via-primary-800 dark:to-[#021a2b]">

        {/* Dark-mode deep gradient layer */}
        <div className="absolute inset-0 hidden dark:block bg-gradient-to-br from-primary-900 via-primary-800 to-[#021a2b]" />

        {/* Light-mode tinted blobs */}
        <div className="absolute top-[-10%] right-[-8%] w-[42vw] h-[42vw] max-w-xl rounded-full bg-primary-200/50 blur-[90px] dark:hidden pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] max-w-lg rounded-full bg-accent-100/60 blur-[70px] dark:hidden pointer-events-none" />

        {/* Dark-mode blobs */}
        <div className="absolute top-0 right-[-10%] w-[50vw] h-[50vw] max-w-2xl rounded-full bg-accent-500/15 blur-[100px] hidden dark:block pointer-events-none" />
        <div className="absolute bottom-0 left-[-5%] w-[30vw] h-[30vw] max-w-xl rounded-full bg-primary-400/20 blur-[80px] hidden dark:block pointer-events-none" />

        {/* Parallax dot grid — light: dark dots / dark: white dots */}
        <div
          className="absolute inset-0 will-change-transform pointer-events-none"
          style={{
            transform: `translateY(${(scrollY - 1800) * 0.12}px)`,
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        >
          <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]
            text-primary-900 dark:text-white
            [background-image:radial-gradient(circle,currentColor_1px,transparent_1px)]
            [background-size:32px_32px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-300 mb-3">
              Our Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Trusted by Millions of Travellers
            </h2>
            <p className="text-slate-500 dark:text-primary-300 mt-3 text-lg">
              Numbers that speak louder than words
            </p>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
            {[
              { target: 2000000, suffix: '+', label: 'Happy Travellers', Icon: Icons.UserCheck, accent: 'from-emerald-500 to-teal-500' },
              { target: 500, suffix: '+', label: 'Airlines & Routes', Icon: Icons.Plane, accent: 'from-primary-500 to-sky-500' },
              { target: 150, suffix: '+', label: 'Destinations', Icon: Icons.Target, accent: 'from-violet-500 to-purple-500' },
              { target: 50000, suffix: '+', label: 'Bookings Monthly', Icon: Icons.ClipboardList, accent: 'from-accent-500 to-orange-500' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 100}>
                <div className="group relative rounded-[2rem] p-8 transition-all duration-500 hover:-translate-y-2 overflow-hidden
                  bg-white/60 bg-white/95 dark:bg-[#020617]/95
backdrop-blur-xl
border border-white/40 dark:border-white/10/30 border border-white/60 dark:border-white/10
                  shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)]
                  dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]
                  backdrop-blur-3xl">

                  {/* Hover gradient wash */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.accent} opacity-0 group-hover:opacity-[0.04] dark:group-hover:opacity-[0.1] transition-opacity duration-500`} />

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.accent} flex items-center justify-center text-white mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-500 p-3`}>
                    <s.Icon />
                  </div>

                  {/* Counter */}
                  <div className="text-3xl sm:text-4xl font-black mb-1 text-slate-900 dark:text-white">
                    <Counter target={s.target} suffix={s.suffix} />
                  </div>

                  {/* Label */}
                  <p className="text-sm font-medium text-slate-500 dark:text-primary-200">{s.label}</p>

                  {/* Bottom accent bar */}
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${s.accent} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50 bg-white/95 dark:bg-[#020617]/95
backdrop-blur-xl
border border-white/40 dark:border-white/10/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3">Reviews</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white">
              What Our Travellers Say
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 120} direction={i === 1 ? 'up' : i === 0 ? 'left' : 'right'}>
                <div className={`relative p-7 rounded-2xl bg-white bg-white/95 dark:bg-[#020617]/95
backdrop-blur-xl
border border-white/40 dark:border-white/10 shadow-md border-2 transition-all duration-500 ${i === activeTestimonial ? 'border-primary-500 shadow-xl scale-[1.02]' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}>
                  <svg className="w-8 h-8 text-primary-200 dark:text-primary-800 mb-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <div className="flex gap-0.5 mb-3">
                    {Array(t.rating).fill(0).map((_, j) => (
                      <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.bg} flex items-center justify-center text-white font-black text-sm flex-shrink-0`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</p>
                      <p className="text-slate-400 text-xs">{t.city}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)}
                className={`rounded-full transition-all duration-300 ${i === activeTestimonial ? 'w-6 h-2.5 bg-primary-600' : 'w-2.5 h-2.5 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          CONTACT CTA  —  #contact
      ══════════════════════════════════════════════════════════════════ */}
      <section id="contact" className="relative py-24 overflow-hidden bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-[#021a2b] p-10 md:p-16">
            <div className="absolute top-0 right-0 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <Reveal direction="left">
                <div>
                  <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent-300 mb-4">Get In Touch</span>
                  <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-5">
                    Ready to Find Your<br />
                    <span className="text-accent-400">Perfect Flight?</span>
                  </h2>
                  <p className="text-primary-200 mb-8 leading-relaxed">
                    Fill the form above or reach us directly. A travel expert is standing by to find you the best deal.
                  </p>

                  <div className="space-y-4">
                    {[
                      { Icon: Icons.Phone, label: 'Call / WhatsApp', value: '+91 98765 43210' },
                      { Icon: Icons.Mail, label: 'Email Us', value: 'hello@travelsparsh.in' },
                      { Icon: Icons.Clock, label: 'Working Hours', value: '24 × 7 Support' },
                    ].map(c => (
                      <div key={c.label} className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors text-white p-2.5">
                          <c.Icon />
                        </div>
                        <div>
                          <p className="text-primary-300 text-xs font-semibold uppercase tracking-wide">{c.label}</p>
                          <p className="text-white font-bold text-sm">{c.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button onClick={scrollToForm}
                    className="mt-8 inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-95">
                    Fill Enquiry Form
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </Reveal>

              <Reveal delay={150} direction="right">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { Icon: Icons.Trophy, title: 'Best Price', desc: 'Guaranteed lowest fares' },
                    { Icon: Icons.Zap, title: 'Fast Response', desc: 'Expert in under 30 min' },
                    { Icon: Icons.Lock, title: '100% Secure', desc: 'Safe & private' },
                    { Icon: Icons.Target, title: 'No Spam', desc: 'We only call with deals' },
                  ].map(b => (
                    <div key={b.title} className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/15 hover:border-white/30 transition-all duration-300 hover:-translate-y-0.5">
                      <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white mb-3 group-hover:bg-white/25 transition-colors p-2">
                        <b.Icon />
                      </div>
                      <p className="font-bold text-white text-sm">{b.title}</p>
                      <p className="text-primary-300 text-xs mt-0.5">{b.desc}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
