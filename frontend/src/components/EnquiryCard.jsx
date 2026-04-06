import React, { useState } from 'react';

const STATUS_CONFIG = {
  new: { color: 'bg-blue-100 text-blue-700', label: 'New', icon: '✨' },
  contacted: { color: 'bg-amber-100 text-amber-700', label: 'Contacted', icon: '📞' },
  converted: { color: 'bg-emerald-100 text-emerald-700', label: 'Booked', icon: '✅' },
  closed: { color: 'bg-slate-100 text-slate-700', label: 'Closed', icon: '✕' },
};

const EnquiryCard = ({ enquiry }) => {
  const [showDetails, setShowDetails] = useState(false);

  const {
    id,
    from_city,
    to_city,
    status,
    created_at,
    trip_type,
    departure_date,
    return_date,
    adults,
    children,
    infants,
    cabin_class,
    message
  } = enquiry;

  const statusConf = STATUS_CONFIG[status] || STATUS_CONFIG.new;

  const dateFormatted = (d) => d
    ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'N/A';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-all hover:shadow-md">
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-800/50 px-5 py-3.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <span className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-tight">
            {from_city || '--'} → {to_city || '--'}
          </span>
          <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
            {trip_type || 'One Way'}
          </span>
        </div>
        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusConf.color}`}>
          {statusConf.icon} {statusConf.label}
        </span>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Departure</p>
            <p className="font-bold text-slate-900 dark:text-white text-sm">{dateFormatted(departure_date)}</p>
          </div>
          {trip_type === 'round-trip' && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Return</p>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{dateFormatted(return_date)}</p>
            </div>
          )}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Travellers</p>
            <p className="font-bold text-slate-900 dark:text-white text-sm">{adults}A, {children}C, {infants}I</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Class</p>
            <p className="font-bold text-primary-600 dark:text-primary-400 text-sm italic">{cabin_class || 'Economy'}</p>
          </div>
        </div>

        {showDetails && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 animate-fade-in">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Your Message</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {message || 'No additional notes provided.'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span>Submitted on {new Date(created_at).toLocaleString('en-IN')}</span>
                <span>•</span>
                <span>Ref: TS-{id.toString().padStart(5, '0')}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-widest hover:underline"
          >
            {showDetails ? '▲ Hide Details' : '▼ View Details'}
          </button>
          
          <div className="flex gap-2">
             <span className="text-[10px] text-slate-400 italic">Our expert will call you shortly</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryCard;
