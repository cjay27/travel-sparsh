import React, { useState, useRef, useEffect, useCallback } from 'react';
import { contactAPI, airportsAPI, airlinesAPI } from '../utils/api';

const VISA_TYPES = ['Tourist', 'Business', 'Student', 'Work', 'Transit', 'Medical', 'Other'];
const TODAY = new Date().toISOString().split('T')[0];

// ─── Airport Input ────────────────────────────────────────────────────────────
const AirportInput = ({ label, value, onChange, onLabelChange, placeholder, id }) => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef();

  // Load existing value labels
  useEffect(() => {
    if (value && value !== query) {
      // If we have a value but the query doesn't match it (e.g. initial load or swap)
      airportsAPI.search(value).then(res => {
        const found = res.data.data.find(a => a.iata_code === value);
        if (found) {
          setQuery(found.iata_code);
          if (onLabelChange) onLabelChange(`${found.city} (${found.iata_code})`);
        }
      });
    } else if (!value && !showDropdown && query !== '') {
      // Only clear if no value AND we aren't actively searching/typing
      setQuery('');
    }
  }, [value]); // Only depend on value changes from parent


  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleInput = async (e) => {
    const q = e.target.value;
    setQuery(q);
    onChange('');
    if (onLabelChange) onLabelChange('');
    if (q.length >= 2) {
      setLoading(true);
      try {
        const res = await airportsAPI.search(q);
        setFiltered(res.data.data.map(a => ({ ...a, code: a.iata_code })));
        setShowDropdown(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelect = (airport) => {
    setQuery(airport.code);
    onChange(airport.code);
    if (onLabelChange) onLabelChange(`${airport.city} (${airport.code})`);
    setShowDropdown(false);
  };

  return (
    <div className="relative" ref={ref}>
      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <input
          id={id}
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={() => { if (query.length >= 2) setShowDropdown(true); }}
          placeholder={placeholder}
          className="w-full pl-9 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-500"
          autoComplete="off"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full" />
          </div>
        )}
      </div>
      {showDropdown && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-[100] mt-1 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 max-h-56 overflow-y-auto">
          {filtered.map((airport) => (
            <button
              key={airport.id}
              type="button"
              onClick={() => handleSelect(airport)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-left border-b border-slate-50 dark:border-slate-700/50 last:border-0"
            >
              <div className="bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-black text-xs w-11 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                {airport.code}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm leading-tight">{airport.city}</p>
                <p className="text-xs text-slate-400 leading-tight">{airport.name}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Yes/No Toggle ────────────────────────────────────────────────────────────
const YesNoToggle = ({ value, onChange }) => (
  <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 w-fit">
    <button type="button" onClick={() => onChange(true)}
      className={`px-5 py-2 text-xs font-bold transition-all ${value ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-500 hover:bg-slate-50'}`}>
      Yes
    </button>
    <button type="button" onClick={() => onChange(false)}
      className={`px-5 py-2 text-xs font-bold transition-all border-l border-slate-200 dark:border-slate-600 ${!value ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-500 hover:bg-slate-50'}`}>
      No
    </button>
  </div>
);

// ─── Section Accordion Header ─────────────────────────────────────────────────
const AccordionHeader = ({ title, subtitle, iconBg, iconColor, icon, expanded, onToggle, badge }) => (
  <button type="button" onClick={onToggle}
    className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors text-left">
    <div className="flex items-center gap-3">
      <div className={`w-4 h-4 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
        <span className={`${iconColor} text-sm`}>{icon}</span>
      </div>
      <div>
        <span className="font-bold text-sm text-slate-900 dark:text-white">{title}</span>
        {subtitle && <span className="ml-2 text-xs text-slate-400">{subtitle}</span>}
      </div>
    </div>
    <div className="flex items-center gap-2">
      {badge && <span className="text-xs font-semibold text-green-500">{badge}</span>}
      <svg className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
        fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </button>
);

// ─── Custom Branded Date Picker ───────────────────────────────────────────────
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_HEADERS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// mode: 'day' | 'month' | 'year'
const DatePicker = ({ label, value, onChange, min, error, placeholder = 'Select date' }) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('day');           // day / month / year
  const [viewYear, setViewYear] = useState(() => {
    const b = value ? new Date(value + 'T00:00:00') : min ? new Date(min + 'T00:00:00') : new Date();
    return b.getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    const b = value ? new Date(value + 'T00:00:00') : min ? new Date(min + 'T00:00:00') : new Date();
    return b.getMonth();
  });
  // year-grid: show a window of 12 years centred on viewYear
  const [yearPage, setYearPage] = useState(() => {
    const b = value ? new Date(value + 'T00:00:00') : new Date();
    return Math.floor(b.getFullYear() / 12) * 12;
  });
  const ref = useRef();

  useEffect(() => {
    const handle = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  useEffect(() => {
    if (value) {
      const d = new Date(value + 'T00:00:00');
      setViewYear(d.getFullYear()); setViewMonth(d.getMonth());
      setYearPage(Math.floor(d.getFullYear() / 12) * 12);
    }
  }, [value]);

  const pad = (n) => String(n).padStart(2, '0');
  const todayDate = new Date(); todayDate.setHours(0, 0, 0, 0);
  const minDate = min
    ? (() => { const d = new Date(min + 'T00:00:00'); d.setHours(0, 0, 0, 0); return d; })()
    : todayDate;

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const selectDay = (day) => {
    const d = new Date(viewYear, viewMonth, day); d.setHours(0, 0, 0, 0);
    if (d < minDate) return;
    onChange(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
    setOpen(false); setMode('day');
  };

  const selectMonth = (m) => { setViewMonth(m); setMode('day'); };

  const selectYear = (y) => { setViewYear(y); setYearPage(Math.floor(y / 12) * 12); setMode('month'); };

  const formatDisplay = (val) => {
    if (!val) return '';
    const d = new Date(val + 'T00:00:00');
    return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
  };

  const selectedDate = value
    ? (() => { const d = new Date(value + 'T00:00:00'); d.setHours(0, 0, 0, 0); return d; })()
    : null;

  const cells = Array(firstDayOfMonth).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // Year-grid rows: 3×4
  const yearGrid = Array.from({ length: 12 }, (_, i) => yearPage + i);

  return (
    <div className="relative" ref={ref}>
      {label && (
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}

      {/* ── Trigger ── */}
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setMode('day'); }}
        className={`relative w-full flex items-center gap-2 pl-9 pr-3 py-3 rounded-xl border text-sm font-medium text-left transition-all duration-200
          bg-white dark:bg-slate-700/60
          ${error ? 'border-red-400 dark:border-red-500'
            : open
              ? 'border-primary-500 ring-2 ring-primary-500/25 dark:border-primary-400'
              : 'border-slate-200 dark:border-slate-600 hover:border-primary-400 dark:hover:border-primary-500'}
          focus:outline-none`}
      >
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span className={`flex-1 truncate ${value ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'}`}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        {value ? (
          <span role="button" onClick={(e) => { e.stopPropagation(); onChange(''); }}
            className="ml-1 text-slate-300 hover:text-red-400 transition-colors cursor-pointer flex-shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        ) : (
          <svg className={`w-3.5 h-3.5 text-slate-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* ── Popover ── */}
      {open && (
        <div className="absolute top-full left-0 z-[300] mt-1.5 animate-slide-down
          bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700
          overflow-hidden w-[296px]">

          {/* Brand header strip */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {/* <svg className="w-3.5 h-3.5 text-white/80" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg> */}
              <span className="text-white/80 text-[10px] font-bold tracking-wider">Travel Sparsh</span>
            </div>
            {/* Mode breadcrumb */}
            <div className="flex items-center gap-1 text-[11px] font-bold text-white/70">
              {mode !== 'day' && (
                <button type="button" onClick={() => setMode('day')} className="hover:text-white transition-colors">
                  {MONTHS_SHORT[viewMonth]}
                </button>
              )}
              {/* {mode === 'day' && (
                <>
                  <button type="button" onClick={() => setMode('month')} className="hover:text-white transition-colors">
                    {MONTHS_SHORT[viewMonth]}
                  </button>
                  <span className="text-white/40">/</span>
                  <button type="button" onClick={() => setMode('year')} className="hover:text-white transition-colors">
                    {viewYear}
                  </button>
                </>
              )} */}
              {mode === 'month' && (
                <button type="button" onClick={() => setMode('year')} className="hover:text-white transition-colors">
                  {viewYear}
                </button>
              )}
              {mode === 'year' && (
                <span className="text-white">{yearPage}–{yearPage + 11}</span>
              )}
            </div>
          </div>

          <div className="p-3">

            {/* ════════ DAY VIEW ════════ */}
            {mode === 'day' && (
              <>
                {/* Month/year nav */}
                <div className="flex items-center justify-between mb-2">
                  <button type="button"
                    onClick={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>

                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => setMode('month')}
                      className="text-sm font-black text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-1 py-0.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20">
                      {MONTHS_FULL[viewMonth]}
                    </button>
                    <button type="button" onClick={() => setMode('year')}
                      className="text-sm font-black px-2 py-0.5 rounded-lg bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/60 transition-colors">
                      {viewYear}
                    </button>
                  </div>

                  <button type="button"
                    onClick={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 mb-1">
                  {DAY_HEADERS.map(d => (
                    <div key={d} className="text-center text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 py-1 tracking-wider">{d}</div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-0.5">
                  {cells.map((day, idx) => {
                    if (!day) return <div key={`e-${idx}`} />;
                    const thisDate = new Date(viewYear, viewMonth, day); thisDate.setHours(0, 0, 0, 0);
                    const isDisabled = thisDate < minDate;
                    const isToday = thisDate.getTime() === todayDate.getTime();
                    const isSelected = selectedDate && thisDate.getTime() === selectedDate.getTime();
                    return (
                      <button key={day} type="button" disabled={isDisabled} onClick={() => selectDay(day)}
                        className={`relative h-9 w-full rounded-xl text-xs font-bold transition-all duration-150
                          ${isSelected
                            ? 'bg-primary-600 text-white shadow-md shadow-primary-200 dark:shadow-primary-900/50 scale-105 z-10'
                            : isToday && !isDisabled
                              ? 'ring-2 ring-primary-400 dark:ring-primary-500 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30'
                              : isDisabled
                                ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 hover:scale-105'}`}>
                        {day}
                        {isToday && !isSelected && (
                          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500 dark:bg-primary-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* ════════ MONTH VIEW ════════ */}
            {mode === 'month' && (
              <>
                <div className="flex items-center justify-between mb-3">
                  <button type="button" onClick={() => setViewYear(y => y - 1)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button type="button" onClick={() => setMode('year')}
                    className="text-sm font-black px-3 py-1 rounded-lg bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/60 transition-colors">
                    {viewYear}
                  </button>
                  <button type="button" onClick={() => setViewYear(y => y + 1)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {MONTHS_SHORT.map((m, idx) => {
                    const isCurrent = idx === viewMonth;
                    const isTodayMonth = idx === todayDate.getMonth() && viewYear === todayDate.getFullYear();
                    return (
                      <button key={m} type="button" onClick={() => selectMonth(idx)}
                        className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-150
                          ${isCurrent
                            ? 'bg-primary-600 text-white shadow-md scale-105'
                            : isTodayMonth
                              ? 'ring-2 ring-primary-400 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 hover:scale-105'}`}>
                        {m}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* ════════ YEAR VIEW ════════ */}
            {mode === 'year' && (
              <>
                <div className="flex items-center justify-between mb-3">
                  <button type="button" onClick={() => setYearPage(p => p - 12)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                    {yearPage} — {yearPage + 11}
                  </span>
                  <button type="button" onClick={() => setYearPage(p => p + 12)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {yearGrid.map(y => {
                    const isCurrent = y === viewYear;
                    const isThisYear = y === todayDate.getFullYear();
                    return (
                      <button key={y} type="button" onClick={() => selectYear(y)}
                        className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-150
                          ${isCurrent
                            ? 'bg-primary-600 text-white shadow-md scale-105'
                            : isThisYear
                              ? 'ring-2 ring-primary-400 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 hover:scale-105'}`}>
                        {y}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

          </div>

          {/* Footer */}
          <div className="px-4 pb-3 flex items-center justify-between">
            <button type="button"
              onClick={() => {
                const str = `${todayDate.getFullYear()}-${pad(todayDate.getMonth() + 1)}-${pad(todayDate.getDate())}`;
                if (!min || str >= min) { onChange(str); setOpen(false); setMode('day'); }
              }}
              className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 transition-colors">
              Today
            </button>
            {value && (
              <button type="button" onClick={() => { onChange(''); setMode('day'); }}
                className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const FlightSearch = () => {
  // Master data state
  const [airlines, setAirlines] = useState(['Any Airline']);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ailRes = await airlinesAPI.getAll();
        setAirlines(['Any Airline', ...ailRes.data.data.map(a => a.name)]);
      } catch (err) {
        console.error('Error fetching master data', err);
      }
    };
    fetchData();
  }, []);

  // Trip
  const [tripType, setTripType] = useState('oneway');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromLabel, setFromLabel] = useState('');
  const [toLabel, setToLabel] = useState('');

  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [showPaxDropdown, setShowPaxDropdown] = useState(false);

  // Multi-city legs
  const [cityLegs, setCityLegs] = useState([
    { from: '', to: '', date: '', fromLabel: '', toLabel: '' },
    { from: '', to: '', date: '', fromLabel: '', toLabel: '' },
  ]);
  const addLeg = () => setCityLegs(prev => [...prev, { from: '', to: '', date: '', fromLabel: '', toLabel: '' }]);
  const removeLeg = (i) => setCityLegs(prev => prev.filter((_, idx) => idx !== i));
  const updateLeg = (i, field, val) => setCityLegs(prev => prev.map((leg, idx) => idx === i ? { ...leg, [field]: val } : leg));

  // Contact
  const [contactExpanded, setContactExpanded] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Travel Details
  const [travelExpanded, setTravelExpanded] = useState(false);
  const [hasVisa, setHasVisa] = useState(false);
  const [visaType, setVisaType] = useState('');
  const [travelPurpose, setTravelPurpose] = useState('leisure');
  const [needsHotel, setNeedsHotel] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  // Preferences
  const [prefExpanded, setPrefExpanded] = useState(false);
  const [travelClass, setTravelClass] = useState('Economy');
  const [packageType, setPackageType] = useState('');
  const [preferredAirline, setPreferredAirline] = useState('Any Airline');

  // State
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const paxRef = useRef();
  useEffect(() => {
    const handle = (e) => { if (paxRef.current && !paxRef.current.contains(e.target)) setShowPaxDropdown(false); };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const totalPax = adults + children + infants;
  const swapCities = () => {
    const tCode = from; setFrom(to); setTo(tCode);
    const tLabel = fromLabel; setFromLabel(toLabel); setToLabel(tLabel);
  };


  const validate = () => {
    const e = {};
    if (tripType === 'multicity') {
      cityLegs.forEach((leg, i) => {
        if (!leg.from) e[`leg${i}from`] = 'Required';
        if (!leg.to) e[`leg${i}to`] = 'Required';
        if (leg.from && leg.to && leg.from === leg.to) e[`leg${i}to`] = 'Cannot be same as origin';
        if (!leg.date) e[`leg${i}date`] = 'Required';
      });
    } else {
      if (!from) e.from = 'Required';
      if (!to) e.to = 'Required';
      if (from && to && from === to) e.to = 'Cannot be same as origin';
      if (!departDate) e.departDate = 'Required';
      if (tripType === 'roundtrip' && !returnDate) e.returnDate = 'Required';
      if (tripType === 'roundtrip' && returnDate && returnDate < departDate) e.returnDate = 'Must be after departure';
    }
    if (!name.trim()) e.name = 'Required';
    if (!phone.trim() || !/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))) e.phone = 'Valid 10-digit mobile number';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = 'Valid email required';
    setErrors(e);
    if (e.name || e.phone || e.email) setContactExpanded(true);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!contactExpanded) { setContactExpanded(true); return; }
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const msg = [
        `Trip: ${tripType}`,
        ...(tripType === 'multicity'
          ? cityLegs.map((leg, i) => `Flight ${i + 1}: ${leg.fromLabel || leg.from} → ${leg.toLabel || leg.to} on ${leg.date}`)
          : [
            `From: ${fromLabel}`,
            `To: ${toLabel}`,
            `Departure: ${departDate}`,
          ]
        ),
        tripType === 'roundtrip' ? `Return: ${returnDate}` : null,
        `Travellers: ${adults}  Adults, ${children} Children, ${infants} Infants`,
        `Class: ${travelClass}`,
        `Purpose: ${travelPurpose}`,
        `Visa: ${hasVisa ? `Yes (${visaType || 'unspecified'})` : 'No'}`,
        `Hotel: ${needsHotel ? 'Yes' : 'No'}`,
        `First Timer: ${isFirstTime ? 'Yes' : 'No'}`,
        packageType ? `Package: ${packageType}` : null,
        `Airline: ${preferredAirline}`,
      ].filter(Boolean).join('\n');

      await contactAPI.submitContact({
        name,
        email,
        phone,
        trip_type: tripType,
        from_city: tripType === 'multicity' ? (cityLegs[0]?.fromLabel || cityLegs[0]?.from) : (fromLabel || from),
        to_city: tripType === 'multicity' ? (cityLegs[cityLegs.length - 1]?.toLabel || cityLegs[cityLegs.length - 1]?.to) : (toLabel || to),
        departure_date: tripType === 'multicity' ? cityLegs[0]?.date : departDate,
        return_date: tripType === 'roundtrip' ? returnDate : null,
        adults,
        children,
        infants,
        cabin_class: travelClass,
        message: msg
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Success State ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-10 text-center border border-white/30">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5 animate-bounce-slow">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Enquiry Submitted!</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-1">Our travel expert will contact you shortly.</p>
        <p className="text-sm text-slate-400 mb-6">Confirmation sent to <span className="text-primary-600 font-medium">{email}</span></p>
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {['✓ No Hidden Charges', '⚡ Fast Response', '🏆 Best Price Guaranteed'].map(b => (
            <span key={b} className="text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">{b}</span>
          ))}
        </div>
        <button onClick={() => {
          setSubmitted(false);
          setFrom(''); setTo('');
          setFromLabel(''); setToLabel('');
          setDepartDate(''); setReturnDate('');
          setName(''); setPhone(''); setEmail('');
          setCityLegs([{ from: '', to: '', date: '', fromLabel: '', toLabel: '' }, { from: '', to: '', date: '', fromLabel: '', toLabel: '' }]);
        }}

          className="text-primary-600 hover:text-primary-700 font-semibold text-sm hover:underline">
          ← Search Another Flight
        </button>
      </div>
    );
  }

  const inputCls = (err) =>
    `w-full px-4 py-3 rounded-xl border text-sm font-medium bg-white dark:bg-slate-700/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${err ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'}`;

  const labelCls = 'block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5';

  return (
    <div className="bg-white dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700/50 overflow-visible">
      <form onSubmit={handleSubmit} noValidate>

        {/* ═══ HEADER STRIP ════════════════════════════════════════════════ */}
        {/* <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-2xl px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
           <span className="text-white font-bold text-sm">Flight Enquiry Form</span>
          </div>
          <div className="flex gap-2">
            {['Best Deals', 'Expert Support', 'Free Service'].map(b => (
              <span key={b} className="hidden sm:inline text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">{b}</span>
            ))}
          </div>
        </div> */}

        {/* ═══ SECTION 1 — TRIP TYPE + SEARCH ROW ═════════════════════════ */}
        <div className="p-5 pb-4">
          {/* Trip type pill toggle */}
          <div className="flex gap-1 mb-5 bg-slate-100 dark:bg-slate-700/60 rounded-xl p-1 w-fit">
            {[
              { key: 'oneway', label: 'One Way' },
              { key: 'roundtrip', label: 'Round Trip' },
              { key: 'multicity', label: 'Multi City' },
            ].map((tab) => (
              <button key={tab.key} type="button" onClick={() => setTripType(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${tripType === tab.key
                  ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {tripType === 'multicity' ? (
            <div className="space-y-3">
              {cityLegs.map((leg, i) => (
                <div key={i} className="relative bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Flight {i + 1}
                    </span>
                    {cityLegs.length > 2 && (
                      <button type="button" onClick={() => removeLeg(i)}
                        className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-200 dark:hover:bg-red-900/50 flex items-center justify-center text-xs font-black transition-colors">
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* From */}
                    <div className="relative">
                      <AirportInput id={`mc-from-${i}`} label="From" value={leg.from}
                        onChange={(v) => updateLeg(i, 'from', v)}
                        onLabelChange={(v) => updateLeg(i, 'fromLabel', v)}
                        placeholder="City or Airport" />
                      {errors[`leg${i}from`] && <p className="text-red-500 text-xs mt-1">{errors[`leg${i}from`]}</p>}
                      {/* Swap arrow between From and To (desktop) */}
                      <div className="hidden sm:flex absolute -right-4 bottom-3 z-20 w-7 h-7 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-full items-center justify-center text-primary-600 shadow-sm pointer-events-none">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    {/* To */}
                    <div>
                      <AirportInput id={`mc-to-${i}`} label="To" value={leg.to}
                        onChange={(v) => updateLeg(i, 'to', v)}
                        onLabelChange={(v) => updateLeg(i, 'toLabel', v)}
                        placeholder="City or Airport" />
                      {errors[`leg${i}to`] && <p className="text-red-500 text-xs mt-1">{errors[`leg${i}to`]}</p>}
                    </div>

                    {/* Date */}
                    <div>
                      <DatePicker
                        label="Date"
                        value={leg.date}
                        min={i > 0 ? (cityLegs[i - 1].date || TODAY) : TODAY}
                        onChange={(v) => updateLeg(i, 'date', v)}
                        error={errors[`leg${i}date`]}
                        placeholder="Pick a date"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Bottom row: Add City + Travellers */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button type="button" onClick={addLeg}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400 text-xs font-bold hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Add City
                </button>

                {/* Travellers dropdown (reuses same paxRef + showPaxDropdown) */}
                <div className="relative ml-auto" ref={paxRef}>
                  <button type="button" onClick={() => setShowPaxDropdown(!showPaxDropdown)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/60 text-sm font-bold text-slate-900 dark:text-slate-100 hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all">
                    <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                    </svg>
                    {totalPax} Traveller{totalPax > 1 ? 's' : ''} · {travelClass}
                    <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showPaxDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showPaxDropdown && (
                    <div className="absolute top-full right-0 z-[100] mt-1 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 p-4 min-w-[260px]">
                      {[
                        { label: 'Adults', sub: '12+ yrs', value: adults, setter: setAdults, min: 1 },
                        { label: 'Children', sub: '2–11 yrs', value: children, setter: setChildren, min: 0 },
                        { label: 'Infants', sub: 'Under 2', value: infants, setter: setInfants, min: 0 },
                      ].map((pax) => (
                        <div key={pax.label} className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-700 last:border-0">
                          <div>
                            <p className="font-bold text-sm text-slate-900 dark:text-white">{pax.label}</p>
                            <p className="text-xs text-slate-400">{pax.sub}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button type="button" onClick={() => pax.setter(Math.max(pax.min, pax.value - 1))}
                              className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center hover:border-primary-500 hover:text-primary-600 font-bold text-xl transition-colors leading-none">−</button>
                            <span className="w-5 text-center font-black text-slate-900 dark:text-white">{pax.value}</span>
                            <button type="button" onClick={() => pax.setter(Math.min(9, pax.value + 1))}
                              className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center hover:border-primary-500 hover:text-primary-600 font-bold text-xl transition-colors leading-none">+</button>
                          </div>
                        </div>
                      ))}
                      <div className="mt-3">
                        <p className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Cabin Class</p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {['Economy', 'Business', 'First'].map((cls) => (
                            <button key={cls} type="button" onClick={() => setTravelClass(cls)}
                              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${travelClass === cls ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}>
                              {cls}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button type="button" onClick={() => setShowPaxDropdown(false)}
                        className="w-full mt-3 bg-primary-600 text-white py-2 rounded-xl font-bold text-sm hover:bg-primary-700 transition-colors">
                        Done
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Search Row */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-9 gap-3 items-end">
              {/* From – col-span-2 */}
              <div className="lg:col-span-2 relative">
                <AirportInput id="from" label="From" value={from}
                  onChange={setFrom} onLabelChange={setFromLabel} placeholder="City or Airport" />
                {errors.from && <p className="text-red-500 text-xs mt-1">{errors.from}</p>}
                {/* Swap */}
                <button type="button" onClick={swapCities}
                  className="hidden lg:flex absolute -right-4 bottom-3 z-20 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-full w-8 h-8 items-center justify-center hover:bg-primary-50 hover:border-primary-400 transition-all shadow-md"
                  title="Swap">
                  <svg className="w-3.5 h-3.5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>

              <div className="lg:col-span-2">
                <AirportInput id="to" label="To" value={to}
                  onChange={setTo} onLabelChange={setToLabel} placeholder="City or Airport" />
                {errors.to && <p className="text-red-500 text-xs mt-1">{errors.to}</p>}
              </div>


              <div className="lg:col-span-2">
                <DatePicker
                  label="Departure"
                  value={departDate}
                  min={TODAY}
                  onChange={setDepartDate}
                  error={errors.departDate}
                  placeholder="Departure date"
                />
              </div>

              <div className="lg:col-span-2">
                <DatePicker
                  label={tripType !== 'roundtrip' ? 'Return (optional)' : 'Return'}
                  value={returnDate}
                  min={departDate || TODAY}
                  onChange={(v) => { setReturnDate(v); if (v) setTripType('roundtrip'); }}
                  error={errors.returnDate}
                  placeholder="Return date"
                />
              </div>
              {/* Travellers – col-span-1 */}
              <div className="lg:col-span-1 relative" ref={paxRef}>
                <label className={labelCls}>Travellers</label>
                <button type="button" onClick={() => setShowPaxDropdown(!showPaxDropdown)}
                  className="w-full flex items-center gap-2 px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/60 text-slate-900 dark:text-slate-100 text-sm font-bold hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200">
                  <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                  </svg>
                  <span className="flex-1 text-left">{totalPax}</span>
                  <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showPaxDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showPaxDropdown && (
                  <div className="absolute top-full right-0 z-[100] mt-1 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 p-4 min-w-[260px]">
                    {[
                      { label: 'Adults', sub: '12+ yrs', value: adults, setter: setAdults, min: 1 },
                      { label: 'Children', sub: '2–11 yrs', value: children, setter: setChildren, min: 0 },
                      { label: 'Infants', sub: 'Under 2', value: infants, setter: setInfants, min: 0 },
                    ].map((pax) => (
                      <div key={pax.label} className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-700 last:border-0">
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white">{pax.label}</p>
                          <p className="text-xs text-slate-400">{pax.sub}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => pax.setter(Math.max(pax.min, pax.value - 1))}
                            className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center hover:border-primary-500 hover:text-primary-600 font-bold text-xl transition-colors leading-none">
                            −
                          </button>
                          <span className="w-5 text-center font-black text-slate-900 dark:text-white">{pax.value}</span>
                          <button type="button" onClick={() => pax.setter(Math.min(9, pax.value + 1))}
                            className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center hover:border-primary-500 hover:text-primary-600 font-bold text-xl transition-colors leading-none">
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                    {/* Class selector inside pax dropdown */}
                    <div className="mt-3">
                      <p className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Cabin Class</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {['Economy', 'Business', 'First'].map((cls) => (
                          <button key={cls} type="button" onClick={() => setTravelClass(cls)}
                            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${travelClass === cls || (cls === 'Economy' && !['Economy', 'Business', 'First'].includes(travelClass))
                              ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}>
                            {cls}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button type="button" onClick={() => setShowPaxDropdown(false)}
                      className="w-full mt-3 bg-primary-600 text-white py-2 rounded-xl font-bold text-sm hover:bg-primary-700 transition-colors">
                      Done
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ═══ SECTION 2 — CONTACT DETAILS (ACCORDION) ════════════════════ */}
        <div className="border-t border-slate-100 dark:border-slate-700/50">
          <AccordionHeader
            title="Your Contact Details"
            subtitle={!contactExpanded && !name ? '* Required to get deals' : (!contactExpanded && name ? `${name} · ${phone}` : '')}
            // iconBg="bg-blue-100 dark:bg-blue-900/30"
            // iconColor="text-blue-600 dark:text-blue-400"
            icon="🙍🏻‍♂️"
            expanded={contactExpanded}
            onToggle={() => setContactExpanded(!contactExpanded)}
            badge={name && phone && email ? '✓ Filled' : null}
          />

          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${contactExpanded ? 'max-h-96' : 'max-h-0'}`}>
            <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Name */}
              <div>
                <label className={labelCls}>Full Name</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className={`${inputCls(errors.name)} pl-9`} />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className={labelCls}>Mobile Number</label>
                <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent transition-all">
                  <div className="flex items-center px-3 bg-slate-50 dark:bg-slate-700 text-xs font-black text-slate-600 dark:text-slate-300 whitespace-nowrap border-r border-slate-200 dark:border-slate-600">
                    +91
                  </div>
                  <input type="tel" value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit number"
                    className={`flex-1 px-3 py-3 text-sm font-medium bg-white dark:bg-slate-700/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none ${errors.phone ? 'border-red-400' : ''}`} />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <label className={labelCls}>Email Address</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className={`${inputCls(errors.email)} pl-9`} />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ SECTION 3 — TRAVEL DETAILS (ACCORDION) ═════════════════════ */}
        <div className="border-t border-slate-100 dark:border-slate-700/50">
          <AccordionHeader
            title="Travel Details"
            // subtitle="Optional"
            // iconBg="bg-green-100 dark:bg-green-900/30"
            // iconColor="text-green-600 dark:text-green-400"
            icon="📋"
            expanded={travelExpanded}
            onToggle={() => setTravelExpanded(!travelExpanded)}
          />
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${travelExpanded ? 'max-h-[600px]' : 'max-h-0'}`}>
            <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Visa */}
              <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
                <p className={`${labelCls} mb-3`}>Visa Available?</p>
                <YesNoToggle value={hasVisa} onChange={setHasVisa} />
                {hasVisa && (
                  <select value={visaType} onChange={(e) => setVisaType(e.target.value)}
                    className="mt-3 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Select Visa Type</option>
                    {VISA_TYPES.map(v => <option key={v} value={v}>{v} Visa</option>)}
                  </select>
                )}
              </div>

              {/* Purpose */}
              <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
                <p className={`${labelCls} mb-3`}>Travel Purpose</p>
                <div className="flex gap-2">
                  {[{ value: 'leisure', label: 'Leisure' }, { value: 'business', label: 'Business' }].map((opt) => (
                    <button key={opt.value} type="button" onClick={() => setTravelPurpose(opt.value)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${travelPurpose === opt.value ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-primary-400'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hotel */}
              <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
                <p className={`${labelCls} mb-3`}>Hotel Required?</p>
                <YesNoToggle value={needsHotel} onChange={setNeedsHotel} />
                {needsHotel && <p className="text-xs text-primary-600 dark:text-primary-400 mt-2 font-medium">We'll include hotel options in your quote!</p>}
              </div>

              {/* First Time */}
              <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
                <p className={`${labelCls} mb-3`}>First-Time Traveller?</p>
                <YesNoToggle value={isFirstTime} onChange={setIsFirstTime} />
                {isFirstTime && <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">Our expert will give extra guidance!</p>}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ SECTION 4 — PREFERENCES (ACCORDION) ════════════════════════ */}
        <div className="border-t border-slate-100 dark:border-slate-700/50">
          <AccordionHeader
            title="Preferences"
            // subtitle="Optional"
            // iconBg="bg-purple-100 dark:bg-purple-900/30"
            icon="⭐"
            // iconColor="text-purple-600 dark:text-purple-400"
            expanded={prefExpanded}
            onToggle={() => setPrefExpanded(!prefExpanded)}
          />
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${prefExpanded ? 'max-h-[500px]' : 'max-h-0'}`}>
            <div className="px-5 pb-5 space-y-5">
              {/* Travel Class */}
              <div>
                <p className={labelCls}>Travel Class</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'Economy', label: '💺 Economy' },
                    { value: 'Premium Economy', label: '✨ Premium Eco' },
                    { value: 'Business', label: '💼 Business' },
                    { value: 'First Class', label: '👑 First Class' },
                  ].map((cls) => (
                    <button key={cls.value} type="button" onClick={() => setTravelClass(cls.value)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${travelClass === cls.value ? 'bg-primary-600 text-white border-primary-600 shadow-md' : 'bg-white dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-primary-400 hover:text-primary-600'}`}>
                      {cls.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Package Type */}
              <div>
                <p className={labelCls}>Package Type</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'Family', label: 'Family' },
                    { value: 'Honeymoon', label: 'Honeymoon' },
                    { value: 'Adventure', label: 'Adventure' },
                    { value: 'Corporate', label: 'Corporate' },
                    { value: 'Custom', label: 'Custom' },
                  ].map((pkg) => (
                    <button key={pkg.value} type="button" onClick={() => setPackageType(packageType === pkg.value ? '' : pkg.value)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${packageType === pkg.value ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-purple-400 hover:text-purple-600'}`}>
                      {pkg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Airline */}
              <div>
                <p className={labelCls}>Preferred Airline</p>
                <select value={preferredAirline} onChange={(e) => setPreferredAirline(e.target.value)}
                  className="w-full sm:w-72 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all">
                  {airlines.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ CTA ═════════════════════════════════════════════════════════ */}
        <div className="border-t border-slate-100 dark:border-slate-700/50 p-5">
          <button type="submit" disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-accent-500 to-orange-500 hover:from-accent-600 hover:to-orange-600 text-white font-black py-4 rounded-xl text-lg transition-all duration-200 hover:shadow-xl active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-3 tracking-wide">
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing…
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                GET BEST DEALS — FREE
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
            Our travel expert will contact you shortly
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-4">
            {[
              { icon: '✓', text: 'No Hidden Charges', color: 'text-green-600 dark:text-green-400' },
              { icon: '⚡', text: 'Fast Response', color: 'text-amber-500 dark:text-amber-400' },
              { icon: '🏆', text: 'Best Price', color: 'text-blue-600 dark:text-blue-400' },
              { icon: '🔒', text: 'Secure & Private', color: 'text-purple-600 dark:text-purple-400' },
            ].map((b) => (
              <div key={b.text} className={`flex items-center gap-1 text-xs font-bold ${b.color}`}>
                <span>{b.icon}</span><span>{b.text}</span>
              </div>
            ))}
          </div>
        </div>

      </form>
    </div>
  );
};

export default FlightSearch;
