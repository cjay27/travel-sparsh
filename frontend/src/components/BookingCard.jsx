import React, { useState } from 'react';

const STATUS_CONFIG = {
  confirmed: { color: 'badge-success', label: 'Confirmed', icon: '✓' },
  pending: { color: 'badge-warning', label: 'Pending', icon: '⏳' },
  cancelled: { color: 'badge-danger', label: 'Cancelled', icon: '✕' },
  completed: { color: 'badge-success', label: 'Completed', icon: '✓' },
  failed: { color: 'badge-danger', label: 'Failed', icon: '!' },
};

const BookingCard = ({ booking, onCancel }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const {
    _id,
    pnr,
    bookingRef,
    flightDetails,
    status,
    bookingDate,
    totalAmount,
    currency,
    isRoundTrip,
  } = booking;

  const statusConf = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const fd = flightDetails || {};

  const departureDate = fd.departureDate
    ? new Date(fd.departureDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    : 'N/A';

  const bookingDateFormatted = bookingDate
    ? new Date(bookingDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    : 'N/A';

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(true);
    await onCancel(_id);
    setCancelling(false);
  };

  return (
    <div className="card overflow-hidden">
      {/* Header strip */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-sm">
            {fd.origin || '--'} → {fd.destination || '--'}
          </span>
          {isRoundTrip && (
            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">Round Trip</span>
          )}
        </div>
        <span className={`badge ${statusConf.color}`}>
          {statusConf.icon} {statusConf.label}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* PNR Banner */}
        <div className="flex items-center justify-between bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-xl px-4 py-3 mb-4">
          <div>
            <p className="text-xs font-medium text-primary-500 dark:text-primary-400 uppercase tracking-wider mb-0.5">PNR Number</p>
            <p className="text-xl font-black tracking-widest text-primary-700 dark:text-primary-300">
              {pnr || 'PENDING'}
            </p>
          </div>
          {pnr && (
            <a
              href={`/pnr?pnr=${pnr}`}
              className="text-xs bg-gradient-to-r from-primary-500 to-accent-500
shadow-lg hover:shadow-[0_0_25px_rgba(249,115,22,0.35)] text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Track →
            </a>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Flight</p>
            <p className="font-semibold text-slate-900 dark:text-white text-sm">
              {fd.airline || '--'} {fd.flightNo || ''}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Date</p>
            <p className="font-semibold text-slate-900 dark:text-white text-sm">{departureDate}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Amount</p>
            <p className="font-bold text-primary-600 dark:text-primary-400 text-sm">
              {currency || 'INR'} {totalAmount ? totalAmount.toLocaleString('en-IN') : 'N/A'}
            </p>
          </div>
        </div>

        {/* Passenger count */}
        {fd.adultCount !== undefined && (
          <div className="flex gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
            {fd.adultCount > 0 && <span>{fd.adultCount} Adult{fd.adultCount > 1 ? 's' : ''}</span>}
            {fd.childCount > 0 && <span>{fd.childCount} Child{fd.childCount > 1 ? 'ren' : ''}</span>}
            {fd.infantCount > 0 && <span>{fd.infantCount} Infant{fd.infantCount > 1 ? 's' : ''}</span>}
            {fd.class && <span>• {fd.class}</span>}
          </div>
        )}

        {/* Details toggle */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 animate-fade-in">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500 dark:text-slate-400">From</p>
                <p className="font-semibold dark:text-white">{fd.originCity || fd.origin}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">To</p>
                <p className="font-semibold dark:text-white">{fd.destinationCity || fd.destination}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Booking Ref</p>
                <p className="font-semibold dark:text-white">{bookingRef || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Booked On</p>
                <p className="font-semibold dark:text-white">{bookingDateFormatted}</p>
              </div>
              {fd.duration && (
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Duration</p>
                  <p className="font-semibold dark:text-white">{fd.duration}</p>
                </div>
              )}
              {fd.stops !== undefined && (
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Stops</p>
                  <p className="font-semibold dark:text-white">{fd.stops === 0 ? 'Non-stop' : `${fd.stops} stop(s)`}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline"
          >
            {showDetails ? '▲ Less Details' : '▼ More Details'}
          </button>
          <div className="flex gap-2">
            {status === 'confirmed' && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="text-sm text-red-500 hover:text-red-700 font-medium border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Cancel'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
