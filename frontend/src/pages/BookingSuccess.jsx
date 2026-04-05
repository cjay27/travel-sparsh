import React from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pnr = searchParams.get('pnr');
  const bookingId = searchParams.get('bookingId');

  return (
    <div className="min-h-screen pt-20 pb-10 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="max-w-lg w-full mx-4">
        <div className="bg-white bg-white/95 dark:bg-[#020617]/95
backdrop-blur-xl
border border-white/40 dark:border-white/10 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Booking Confirmed!</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Your payment was successful and your booking is confirmed.
          </p>

          {pnr && (
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 mb-6">
              <p className="text-xs text-primary-600 dark:text-primary-400 font-medium uppercase tracking-wide mb-1">Your PNR Number</p>
              <p className="text-3xl font-black text-primary-700 dark:text-primary-300 tracking-widest">{pnr}</p>
              <p className="text-xs text-slate-500 mt-1">Save this for check-in and future reference</p>
            </div>
          )}

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            A confirmation has been sent to your registered email address.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/bookings" className="btn-primary">
              View My Bookings
            </Link>
            <button onClick={() => navigate('/')} className="btn-outline">
              Search More Flights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
