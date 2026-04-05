import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookingsAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_STEPS = {
  confirmed: ['Booking Created', 'Payment Confirmed', 'Ticket Issued', 'Ready to Fly'],
  pending: ['Booking Created', 'Awaiting Payment', 'Ticket Pending', 'Not Ready'],
  cancelled: ['Booking Created', 'Cancellation Requested', 'Cancelled', 'Refund Processing'],
  completed: ['Booking Created', 'Payment Confirmed', 'Ticket Issued', 'Flight Completed'],
  failed: ['Booking Initiated', 'Payment Failed', 'Booking Failed', 'Please Retry'],
};

const STATUS_STEP_INDEX = { pending: 1, confirmed: 3, cancelled: 2, completed: 4, failed: 1 };

const StatusBadge = ({ status }) => {
  const config = {
    confirmed: { color: 'badge-success', label: 'Confirmed', icon: '✓' },
    pending: { color: 'badge-warning', label: 'Pending', icon: '⏳' },
    cancelled: { color: 'badge-danger', label: 'Cancelled', icon: '✕' },
    completed: { color: 'badge-success', label: 'Completed', icon: '✓' },
    failed: { color: 'badge-danger', label: 'Failed', icon: '!' },
  };
  const c = config[status] || config.pending;
  return <span className={`badge ${c.color} text-sm`}>{c.icon} {c.label}</span>;
};

const PNRStatus = () => {
  const [searchParams] = useSearchParams();
  const [pnrInput, setPnrInput] = useState(searchParams.get('pnr') || '');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const pnr = searchParams.get('pnr');
    if (pnr) {
      setPnrInput(pnr);
      handleSearch(null, pnr);
    }
  }, []);

  const handleSearch = async (e, pnr) => {
    if (e) e.preventDefault();
    const searchPnr = pnr || pnrInput;
    if (!searchPnr.trim()) {
      setError('Please enter a PNR number');
      return;
    }
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const res = await bookingsAPI.checkPNR(searchPnr.trim().toUpperCase());
      setBooking(res.data.data);
    } catch (err) {
      setBooking(null);
      setError(err.response?.data?.message || 'PNR not found. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const fd = booking?.flightDetails || {};
  const steps = booking ? (STATUS_STEPS[booking.status] || STATUS_STEPS.pending) : [];
  const currentStep = booking ? (STATUS_STEP_INDEX[booking.status] || 1) : 0;

  const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }) : 'N/A';

  const formatTime = (date) => date ? new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true
  }) : 'N/A';

  return (
    <div className="min-h-screen pt-16 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl mb-4 shadow-glow">
            <span className="text-white text-2xl">📍</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">PNR Status Check</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Enter your PNR number to track your flight booking status
          </p>
        </div>

        {/* Search form */}
        <div className="card p-6 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="label">PNR Number</label>
              <input
                type="text"
                value={pnrInput}
                onChange={(e) => setPnrInput(e.target.value.toUpperCase())}
                placeholder="e.g., ABC123, XY4567"
                maxLength={10}
                className="input-field font-mono tracking-widest text-lg uppercase"
              />
              <p className="text-xs text-slate-400 mt-1">Enter the 6-10 character PNR from your ticket</p>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading || !pnrInput.trim()}
                className="btn-primary flex items-center gap-2 w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>🔍 Check Status</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Fetching booking details..." />
          </div>
        )}

        {/* Error */}
        {!loading && error && searched && (
          <div className="card p-8 text-center">
            <div className="text-5xl mb-4">❌</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">PNR Not Found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">{error}</p>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-left mt-4">
              <p className="text-amber-700 dark:text-amber-400 text-sm font-semibold mb-1">Tips:</p>
              <ul className="text-amber-600 dark:text-amber-500 text-sm space-y-1 list-disc list-inside">
                <li>Check for typos in the PNR number</li>
                <li>PNR is usually 6 characters (letters and numbers)</li>
                <li>PNR can be found in your booking confirmation email</li>
                <li>It may take a few minutes for new bookings to appear</li>
              </ul>
            </div>
          </div>
        )}

        {/* Result */}
        {!loading && booking && (
          <div className="space-y-6 animate-fade-in">
            {/* Status Header */}
            <div className="card overflow-hidden">
              <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-primary-200 text-sm">PNR Number</p>
                    <p className="text-white font-black text-3xl tracking-widest">{booking.pnr}</p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
              </div>

              {/* Journey Progress */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6 relative">
                  {steps.map((step, idx) => {
                    const isCompleted = idx < currentStep;
                    const isCurrent = idx === currentStep - 1;
                    return (
                      <React.Fragment key={idx}>
                        <div className="flex flex-col items-center gap-1 z-10">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${isCompleted || isCurrent
                                ? 'bg-gradient-to-r from-primary-500 to-accent-500
shadow-lg hover:shadow-[0_0_25px_rgba(249,115,22,0.35)] text-white shadow-md'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                              }`}
                          >
                            {isCompleted ? '✓' : idx + 1}
                          </div>
                          <p className={`text-xs font-medium text-center max-w-[80px] leading-tight ${isCompleted || isCurrent ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'
                            }`}>
                            {step}
                          </p>
                        </div>
                        {idx < steps.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? 'bg-gradient-to-r from-primary-500 to-accent-500
shadow-lg hover:shadow-[0_0_25px_rgba(249,115,22,0.35)]' : 'bg-slate-200 dark:bg-slate-700'}`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Flight Details */}
            {Object.keys(fd).length > 0 && (
              <div className="card p-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-5 text-lg">Flight Details</h3>
                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-5 mb-5">
                  <div className="text-center flex-1">
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{fd.origin || '--'}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{fd.originCity || ''}</p>
                    {fd.departureDate && (
                      <p className="text-xs text-slate-500 mt-1">{formatTime(fd.departureDate)}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div className="text-2xl text-primary-500">✈</div>
                    {fd.duration && <p className="text-xs text-slate-500">{fd.duration}</p>}
                    {fd.stops !== undefined && (
                      <p className="text-xs text-slate-500">{fd.stops === 0 ? 'Non-stop' : `${fd.stops} stop`}</p>
                    )}
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{fd.destination || '--'}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{fd.destinationCity || ''}</p>
                    {fd.arrivalDate && (
                      <p className="text-xs text-slate-500 mt-1">{formatTime(fd.arrivalDate)}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Airline', value: `${fd.airline || '--'} ${fd.flightNo || ''}` },
                    { label: 'Date', value: formatDate(fd.departureDate) },
                    { label: 'Class', value: fd.class || 'Economy' },
                    { label: 'Adults', value: fd.adultCount || 1 },
                    { label: 'Children', value: fd.childCount || 0 },
                    { label: 'Total Amount', value: booking.totalAmount ? `₹${booking.totalAmount.toLocaleString('en-IN')}` : 'N/A' },
                  ].map((item) => (
                    <div key={item.label} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{item.label}</p>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Passenger info (if available) */}
            {fd.passengers && fd.passengers.length > 0 && (
              <div className="card p-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-lg">Passengers</h3>
                <div className="space-y-3">
                  {fd.passengers.map((pax, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">
                          {pax.title} {pax.firstName} {pax.lastName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{pax.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Booking Reference */}
            <div className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  {booking.bookingRef && (
                    <div className="flex gap-2 text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Booking Ref:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{booking.bookingRef}</span>
                    </div>
                  )}
                  {booking.adivahaBookingId && (
                    <div className="flex gap-2 text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Adivaha ID:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">{booking.adivahaBookingId}</span>
                    </div>
                  )}
                  <div className="flex gap-2 text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Booked on:</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-IN') : 'N/A'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => window.print()}
                  className="btn-outline text-sm py-2"
                >
                  🖨 Print Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info when no search yet */}
        {!searched && !loading && (
          <div className="card p-8 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Track Your Booking</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Enter your PNR (Passenger Name Record) number above to get real-time flight status, passenger details, and booking information.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              {[
                { icon: '📧', title: 'From Email', desc: 'Check your booking confirmation email for the PNR number' },
                { icon: '📱', title: 'From SMS', desc: 'The PNR was sent via SMS when you completed your booking' },
                { icon: '📋', title: 'From Ticket', desc: 'Find the PNR printed on your physical or e-ticket' },
              ].map((tip) => (
                <div key={tip.title} className="bg-slate-50 bg-white/95 dark:bg-[#020617]/95
backdrop-blur-xl
border border-white/40 dark:border-white/10 rounded-xl p-4">
                  <div className="text-2xl mb-2">{tip.icon}</div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{tip.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PNRStatus;
